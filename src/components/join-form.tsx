import { useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitFederationApplication } from "@/lib/submissions.functions";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;
const MEMBERSHIP = ["Full member", "Provisional member", "Observer"] as const;

const schema = z.object({
  organisation_name: z.string().trim().min(2, "Enter your organisation name").max(120),
  country: z.string().trim().min(2, "Enter a country").max(80),
  region: z.enum(REGIONS, { message: "Select a region" }),
  contact_name: z.string().trim().min(2, "Enter a contact name").max(120),
  contact_role: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  athletes_estimate: z.string().trim().max(40).optional().or(z.literal("")),
  membership_type: z.enum(MEMBERSHIP, { message: "Select a membership type" }),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormState = Record<string, string>;

const EMPTY: FormState = {
  organisation_name: "",
  country: "",
  region: "",
  contact_name: "",
  contact_role: "",
  email: "",
  phone: "",
  website: "",
  athletes_estimate: "",
  membership_type: "",
  message: "",
};

const labelCls = "block text-xs font-semibold uppercase tracking-[0.16em] text-[#414042]";
const fieldCls =
  "mt-2 block w-full min-w-0 rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-base text-[#414042] outline-none transition-colors focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/20";

function Field({
  id,
  label,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium" style={{ color: "#DE007A" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function JoinForm() {
  const saveApplication = useServerFn(submitFederationApplication);
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: "" } : prev));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = document.getElementById(Object.keys(next)[0]);
      first?.focus();
      return;
    }

    setStatus("saving");
    const d = parsed.data;
    try {
      await saveApplication({ data: {
        organisation_name: d.organisation_name,
        country: d.country,
        region: d.region,
        contact_name: d.contact_name,
        contact_role: d.contact_role || null,
        email: d.email,
        phone: d.phone || null,
        website: d.website || null,
        athletes_estimate: d.athletes_estimate || null,
        membership_type: d.membership_type,
        message: d.message || null,
      } });
    } catch {
      setStatus("error");
      setServerError("We couldn't submit your application. Please try again in a moment.");
      return;
    }
    setStatus("done");
    setValues(EMPTY);
  }

  return (
    <section id="join" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#DE007A" }}>
              Membership
            </div>
            <h2
              className="text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
            >
              Join a federation
            </h2>
            <p className="mt-2 text-[13px] sm:hidden" style={{ color: "#414042" }}>
              National Yogasana bodies can apply for IYSF affiliation.
            </p>
            <p className="mt-5 hidden max-w-[420px] text-base leading-relaxed sm:block" style={{ color: "#414042" }}>
              National bodies governing competitive Yogasana may apply for IYSF affiliation. Submit
              your details and the membership commission will respond with the next steps.
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-8 sm:block sm:space-y-4 sm:border-l sm:border-black/10 sm:pl-6">
              {[
                "Application received and acknowledged",
                "Eligibility and governance review",
                "Provisional status granted",
                "Full membership ratified at congress",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-1.5 rounded-full border border-[rgba(66,152,211,0.28)] px-2 py-1 sm:items-start sm:gap-3 sm:rounded-none sm:border-0 sm:p-0">
                  <span
                    className="text-[11px] sm:mt-0.5 sm:text-[12px]"
                    style={{ fontFamily: "var(--font-mono)", color: "#4298D3" }}
                  >
                    0{i + 1}
                  </span>
                  <span className="truncate text-[11px] leading-tight sm:whitespace-normal sm:text-sm sm:leading-snug" style={{ color: "#414042" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 rounded-[14px] border border-[rgba(66,152,211,0.28)] bg-white p-5 shadow-[0_14px_34px_-18px_rgba(66,152,211,0.55)] sm:p-6 md:p-8">
            {status === "done" ? (
              <div className="flex min-h-[320px] flex-col items-start justify-center">
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: "#FAAF40", color: "#3A2400" }}
                  aria-hidden="true"
                >
                  ✓
                </div>
                <h3
                  className="text-[24px] leading-tight"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
                >
                  Application received
                </h3>
                <p className="mt-3 max-w-[420px] text-sm leading-relaxed" style={{ color: "#414042" }}>
                  Thank you. The IYSF membership commission will contact you at the email address
                  provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-md border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ borderColor: "#4298D3", color: "#4298D3" }}
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-5 md:grid-cols-2">
                <Field id="organisation_name" label="Organisation name" error={errors.organisation_name} className="min-w-0 col-span-2 sm:col-span-1 md:col-span-2">
                  <input
                    id="organisation_name"
                    name="organisation_name"
                    value={values.organisation_name}
                    onChange={set("organisation_name")}
                    maxLength={120}
                    className={fieldCls}
                    aria-invalid={!!errors.organisation_name}
                  />
                </Field>

                <Field id="country" label="Country" error={errors.country} className="min-w-0">
                  <input
                    id="country"
                    value={values.country}
                    onChange={set("country")}
                    maxLength={80}
                    className={fieldCls}
                    aria-invalid={!!errors.country}
                  />
                </Field>

                <Field id="region" label="Region" error={errors.region} className="min-w-0">
                  <select
                    id="region"
                    value={values.region}
                    onChange={set("region")}
                    className={fieldCls}
                    aria-invalid={!!errors.region}
                  >
                    <option value="">Select a region</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="contact_name" label="Primary contact" error={errors.contact_name} className="min-w-0 col-span-2 sm:col-span-1">
                  <input
                    id="contact_name"
                    value={values.contact_name}
                    onChange={set("contact_name")}
                    maxLength={120}
                    className={fieldCls}
                    aria-invalid={!!errors.contact_name}
                  />
                </Field>

                <Field id="email" label="Email" error={errors.email} className="min-w-0">
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={set("email")}
                    maxLength={255}
                    className={fieldCls}
                    aria-invalid={!!errors.email}
                  />
                </Field>

<Field id="membership_type" label="Membership sought" error={errors.membership_type} className="min-w-0 sm:col-span-1 md:col-span-1">
                  <select
                    id="membership_type"
                    value={values.membership_type}
                    onChange={set("membership_type")}
                    className={fieldCls}
                    aria-invalid={!!errors.membership_type}
                  >
                    <option value="">Select a membership type</option>
                    {MEMBERSHIP.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>

                <details className="group col-span-2 sm:col-span-1 md:col-span-2">
                  <summary className="flex min-h-[40px] cursor-pointer list-none items-center text-sm font-semibold" style={{ color: "#4298D3" }}>
                    <span className="mr-2 transition-transform group-open:rotate-90" aria-hidden="true">›</span>
                    Add more details (optional)
                  </summary>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-5 md:grid-cols-2">
<Field id="contact_role" label="Role (optional)" error={errors.contact_role} className="min-w-0">
                  <input
                    id="contact_role"
                    value={values.contact_role}
                    onChange={set("contact_role")}
                    maxLength={120}
                    className={fieldCls}
                  />
                </Field>

<Field id="phone" label="Phone (optional)" error={errors.phone} className="min-w-0">
                  <input id="phone" value={values.phone} onChange={set("phone")} maxLength={40} className={fieldCls} />
                </Field>

<Field id="website" label="Website (optional)" error={errors.website} className="min-w-0">
                  <input
                    id="website"
                    value={values.website}
                    onChange={set("website")}
                    maxLength={255}
                    placeholder="example.org"
                    className={fieldCls}
                  />
                </Field>

<Field id="athletes_estimate" label="Registered athletes (optional)" error={errors.athletes_estimate} className="min-w-0">
                  <input
                    id="athletes_estimate"
                    value={values.athletes_estimate}
                    onChange={set("athletes_estimate")}
                    maxLength={40}
                    className={fieldCls}
                  />
                </Field>

<Field id="message" label="Notes (optional)" error={errors.message} className="min-w-0 col-span-2 sm:col-span-1 md:col-span-2">
                  <textarea
                    id="message"
                    rows={4}
                    value={values.message}
                    onChange={set("message")}
                    maxLength={1000}
                    className={fieldCls}
                  />
                </Field>
                  </div>
                </details>

                {serverError ? (
                  <p role="alert" className="text-sm font-medium col-span-2 sm:col-span-1 md:col-span-2" style={{ color: "#DE007A" }}>
                    {serverError}
                  </p>
                ) : null}

                <div className="flex flex-col items-stretch gap-3 col-span-2 sm:col-span-1 md:col-span-2 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    disabled={status === "saving"}
                    className="w-full rounded-md px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    style={{ background: "#FAAF40", color: "#3A2400" }}
                  >
                    {status === "saving" ? "Submitting…" : "Submit application"}
                  </button>
                  <span className="text-xs" style={{ color: "#414042" }}>
                    Reviewed by the IYSF membership commission.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
