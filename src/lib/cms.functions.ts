import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { contentSchema } from "@/lib/blocks";

function publicClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h, signal: init?.signal ?? AbortSignal.timeout(3000) });
      },
    },
  });
}

const LIST_COLS = "id,title,slug,excerpt,cover_image_url,cover_alt,published_at,tags,author_name";

export const listPublishedPosts = createServerFn({ method: "GET" })
  .validator((d: { limit?: number; offset?: number; tag?: string }) =>
    z.object({ limit: z.number().int().min(1).max(50).default(9), offset: z.number().int().min(0).default(0), tag: z.string().max(80).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb.from("posts").select(LIST_COLS, { count: "exact" }).order("published_at", { ascending: false }).range(data.offset, data.offset + data.limit - 1);
    if (data.tag) q = q.contains("tags", [data.tag]);
    const { data: rows, error, count } = await q;
    if (error) throw new Error("Could not load news");
    return { posts: rows ?? [], total: count ?? 0 };
  });

export const listAllTags = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("posts").select("tags").limit(500);
  return Array.from(new Set((data ?? []).flatMap((r) => r.tags ?? []))).sort();
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: post } = await sb.from("posts").select("*").eq("slug", data.slug).maybeSingle();
    if (!post) return null;
    const [prev, next] = await Promise.all([
      sb.from("posts").select("slug,title").lt("published_at", post.published_at!).order("published_at", { ascending: false }).limit(1).maybeSingle(),
      sb.from("posts").select("slug,title").gt("published_at", post.published_at!).order("published_at", { ascending: true }).limit(1).maybeSingle(),
    ]);
    return { post, prev: prev.data, next: next.data };
  });

export const listFeedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("posts").select("slug,title,excerpt,published_at,updated_at").order("published_at", { ascending: false }).limit(100);
  return data ?? [];
});

export const listPublicCmsUrls = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient() as any;
  const [events, results] = await Promise.all([
    sb.from("cms_events").select("slug,updated_at").eq("status", "published"),
    sb.from("cms_results").select("slug,updated_at").eq("status", "published"),
  ]);
  if (events.error || results.error) return { events: [], results: [] };
  return { events: events.data ?? [], results: results.data ?? [] };
});

// Publicly list visible rules documents and download cards.
export const listPublicRules = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await (publicClient() as any).from("cms_rules")
    .select("id,kind,slug,title,content,accent,availability,tone,description,download_url,display_order,visible")
    .eq("visible", true).order("display_order", { ascending: true });
  if (error) throw new Error("Could not load rules");
  return data ?? [];
});

async function assertStaff(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "staff" });
  if (!data) throw new Error("Forbidden: staff only");
}

function assertServiceRoleConfigured() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Staff account management requires the server-only SUPABASE_SERVICE_ROLE_KEY.");
  }
}

const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const textValue = (max: number) => z.string().max(max);
const imageUrlValue = z.string().max(2000).refine((value) => !value || value.startsWith("/api/public/media/") || /^https:\/\//i.test(value), "Use a secure image URL or a media-library image.");
const optionalImageUrl = imageUrlValue.nullable();

const eventValuesSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime().nullable(),
  location: textValue(300),
  description: z.array(z.unknown()).max(500),
  cover_image_url: optionalImageUrl,
  cover_alt: textValue(500).nullable(),
  registration_url: z.string().max(2000).nullable(),
  status: z.enum(["draft", "published"]),
}).strict();

const resultValuesSchema = z.object({
  competition_name: z.string().trim().min(1).max(200),
  slug: slugSchema,
  competition_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: textValue(300),
  category: textValue(200),
  rows: z.array(z.unknown()).max(5000),
  official_sheet_url: z.string().max(2000).nullable(),
  status: z.enum(["draft", "published"]),
}).strict();

const officialValuesSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role_title: z.string().trim().min(1).max(200),
  country: textValue(120),
  photo_url: optionalImageUrl,
  bio: textValue(5000),
  display_order: z.number().int().min(0).max(10000),
  visible: z.boolean(),
}).strict();

const homepageValuesSchema = z.object({
  hero_image_url: optionalImageUrl,
  hero_alt: textValue(500),
  headline: textValue(300),
  button_text: textValue(100),
  button_url: textValue(2000),
  intro_text: textValue(5000),
  sections: z.array(z.string().max(50)).max(30),
}).strict();

const ruleValuesSchema = z.object({
  kind: z.enum(["document", "download"]),
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  content: textValue(12000),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  availability: textValue(200),
  tone: z.enum(["success", "warning", "neutral"]),
  description: textValue(5000),
  download_url: z.string().max(2000).refine((value) => !value || /^https:\/\//i.test(value), "Use an HTTPS download URL."),
  display_order: z.number().int().min(0).max(10000),
  visible: z.boolean(),
}).strict();

const saveSectionSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("events"), id: z.string().uuid().optional(), values: eventValuesSchema }),
  z.object({ section: z.literal("rules"), id: z.string().uuid().optional(), values: ruleValuesSchema }),
  z.object({ section: z.literal("results"), id: z.string().uuid().optional(), values: resultValuesSchema }),
  z.object({ section: z.literal("officials"), id: z.string().uuid().optional(), values: officialValuesSchema }),
  z.object({ section: z.literal("homepage"), values: homepageValuesSchema }),
]);

// Create or update a CMS section row after verifying the caller's staff role.
export const saveCmsSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => saveSectionSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const table = {
      events: "cms_events",
      rules: "cms_rules",
      results: "cms_results",
      officials: "cms_officials",
      homepage: "cms_homepage",
    }[data.section];
    const db = context.supabase as any;
    if (data.section === "homepage") {
      const { data: row, error } = await db.from(table).upsert({ id: true, ...data.values }, { onConflict: "id" }).select("id").single();
      if (error) throw new Error(error.message);
      return { id: row.id };
    }
    const query = data.id
      ? db.from(table).update(data.values).eq("id", data.id)
      : db.from(table).insert(data.values);
    const { data: row, error } = await query.select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

// Delete an event, result, or official after verifying the caller's staff role.
export const deleteCmsSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ section: z.enum(["events", "rules", "results", "officials", "homepage"]), id: z.union([z.string().uuid(), z.literal(true)]) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const table = { events: "cms_events", rules: "cms_rules", results: "cms_results", officials: "cms_officials", homepage: "cms_homepage" }[data.section];
    const id = data.section === "homepage" ? true : data.id;
    const { error } = await (context.supabase as any).from(table).delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Apply a complete staff-controlled officials ordering in one validated request.
export const reorderOfficials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ ids: z.array(z.string().uuid()).min(1).max(1000) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const db = context.supabase as any;
    const results = await Promise.all(data.ids.map((id, display_order) =>
      db.from("cms_officials").update({ display_order }).eq("id", id),
    ));
    const failure = results.find((result: any) => result.error);
    if (failure) throw new Error(failure.error.message);
    return { ok: true };
  });

// Update staff review fields on a membership application.
export const updateApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    status: z.enum(["new", "reviewed", "approved", "rejected"]),
    internal_notes: z.string().max(10000),
  }).strict().parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await (context.supabase as any).from("federation_applications")
      .update({ status: data.status, internal_notes: data.internal_notes }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Delete a membership application after verifying the caller's staff role.
export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await (context.supabase as any).from("federation_applications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const postWriteSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  excerpt: z.string().max(500).nullable(),
  status: z.enum(["draft", "scheduled", "published"]),
  published_at: z.string().datetime().nullable(),
  content: contentSchema,
  cover_image_url: optionalImageUrl,
  cover_alt: textValue(300).nullable(),
  tags: z.array(z.string().max(80)).max(20),
  seo_title: z.string().max(70).nullable(),
  seo_description: z.string().max(170).nullable(),
  author_name: textValue(120),
}).strict();

// Create or update a news post after validating its content and staff role.
export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => postWriteSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { id, ...values } = data;
    const db = context.supabase as any;
    const row = { ...values, updated_by: context.userId };
    const query = id
      ? db.from("posts").update(row).eq("id", id)
      : db.from("posts").insert({ ...row, created_by: context.userId });
    const { data: saved, error } = await query.select("id").single();
    if (error) throw new Error(error.message);
    return { id: saved.id };
  });

// Delete a news post after validating its id and the caller's staff role.
export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await (context.supabase as any).from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const mediaRecordSchema = z.object({
  path: z.string().min(1).max(300).regex(/^[A-Za-z0-9/_.-]+$/).refine((path) => !path.includes("..")),
  url: z.string().min(1).max(400).startsWith("/api/public/media/"),
  alt: z.string().max(500).nullable(),
  width: z.number().int().min(0).nullable(),
  height: z.number().int().min(0).nullable(),
  size_bytes: z.number().int().min(0).max(5 * 1024 * 1024),
  mime_type: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
}).strict();

// Save uploaded media metadata after checking the authenticated staff role.
export const createMediaRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => mediaRecordSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data: row, error } = await (context.supabase as any).from("media")
      .insert({ ...data, uploaded_by: context.userId }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

// Update media alt text after checking the authenticated staff role.
export const updateMediaAlt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid(), alt: z.string().trim().max(500).nullable() }).strict().parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await (context.supabase as any).from("media").update({ alt: data.alt }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Remove the stored object and its metadata after checking the authenticated staff role.
export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const db = context.supabase as any;
    const { data: row, error: lookupError } = await db.from("media").select("path").eq("id", data.id).single();
    if (lookupError || !row) throw new Error(lookupError?.message ?? "Media item not found");
    const { error: storageError } = await context.supabase.storage.from("media").remove([row.path]);
    if (storageError) throw new Error(storageError.message);
    const { error } = await db.from("media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    assertServiceRoleConfigured();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id,created_at").eq("role", "staff");
    const out = [];
    for (const r of roles ?? []) {
      const { data } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
      out.push({ id: r.user_id, email: data.user?.email ?? "(unknown)", since: r.created_at, confirmed: !!data.user?.last_sign_in_at });
    }
    return { staff: out, me: context.userId };
  });

export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { email: string; origin: string }) => z.object({ email: z.string().trim().email().max(255), origin: z.string().url() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    assertServiceRoleConfigured();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();
    let userId: string | undefined;
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === email);
    if (existing) {
      userId = existing.id;
      await supabaseAdmin.auth.resetPasswordForEmail(email, { redirectTo: `${data.origin}/reset-password` });
    } else {
      const { data: inv, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, { redirectTo: `${data.origin}/reset-password` });
      if (error) throw new Error(error.message);
      userId = inv.user?.id;
    }
    if (!userId) throw new Error("Could not create the account");
    const { error: rErr } = await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: "staff" }, { onConflict: "user_id,role" });
    if (rErr) throw new Error(rErr.message);
    return { ok: true, existing: !!existing };
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You can't remove your own access.");
    assertServiceRoleConfigured();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "staff");
    if ((count ?? 0) <= 1) throw new Error("You can't remove the last staff member.");
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "staff");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
