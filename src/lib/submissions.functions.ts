import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function getClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  return publicClient(
    url,
    key,
  );
}

const text = (max: number) => z.string().trim().min(1).max(max);
const email = z.string().trim().email().max(255);

const federationSchema = z.object({
  organisation_name: text(120),
  country: text(80),
  region: z.enum(["Africa", "Americas", "Asia", "Europe", "Oceania"]),
  contact_name: text(120),
  contact_role: z.string().trim().max(120).nullable(),
  email,
  phone: z.string().trim().max(40).nullable(),
  website: z.string().trim().max(255).nullable(),
  athletes_estimate: z.string().trim().max(40).nullable(),
  membership_type: z.enum(["Full member", "Provisional member", "Observer"]),
  message: z.string().trim().max(1000).nullable(),
});

export const submitFederationApplication = createServerFn({ method: "POST" })
  .validator((input) => federationSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await getClient().from("federation_applications").insert(data);
    if (error) throw new Error("Submission could not be saved");
    let emailed = false;
    const resendKey = process.env["RESEND_API_KEY"];
    const from = process.env["RESEND_FROM_EMAIL"];
    if (resendKey && from) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "staff");
        const users = await Promise.all((roles ?? []).map(async (role) => (await supabaseAdmin.auth.admin.getUserById(role.user_id)).data.user?.email));
        const recipients = [...new Set(users.filter((email): email is string => !!email))];
        if (recipients.length) {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from,
              to: recipients,
              subject: `New federation membership application: ${data.organisation_name}`,
              text: `A new federation membership application has been submitted.\n\nOrganisation: ${data.organisation_name}\nCountry: ${data.country}\nContact: ${data.contact_name}\nEmail: ${data.email}\nMembership: ${data.membership_type}\n\nReview it in the IYSF admin applications section.`,
            }),
          });
          emailed = response.ok;
          if (!response.ok) console.error("Membership application notification failed", response.status);
        }
      } catch (e) {
        console.error("Membership application notification failed", e);
      }
    }
    return { saved: true, emailed };
  });

const eventSchema = z.object({
  event_slug: z.string().trim().max(160).nullable(),
  event_name: text(200),
  full_name: text(120),
  email,
  federation: text(160),
});

export const submitEventRegistration = createServerFn({ method: "POST" })
  .validator((input) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await getClient().from("event_registrations").insert(data);
    if (error) throw new Error("Registration could not be saved");
    return { saved: true };
  });

const newsletterSchema = z.object({
  email,
  source: text(120),
});

export const submitNewsletterSignup = createServerFn({ method: "POST" })
  .validator((input) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await getClient().from("newsletter_signups").insert(data);
    if (error) throw new Error("Subscription could not be saved");
    return { saved: true };
  });

const donationSchema = z.object({
  full_name: text(120),
  email,
  amount: z.string().trim().regex(/^\d+(\.\d{1,2})?$/).max(20),
  frequency: z.enum(["once", "monthly"]),
});

export const submitDonationPledge = createServerFn({ method: "POST" })
  .validator((input) => donationSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await getClient().from("donation_pledges").insert(data);
    if (error) throw new Error("Pledge could not be saved");
    return { saved: true };
  });

const inquirySchema = z.object({
  organisation_name: text(120),
  contact_name: text(120),
  email,
  phone: z.string().trim().max(40).nullable(),
  country: z.string().trim().max(80).nullable(),
  interest: text(120),
  message: text(2000),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await getClient().from("sponsorship_enquiries").insert(data);
    if (error) throw new Error("Inquiry could not be saved");
    return { saved: true, emailed: false };
  });
