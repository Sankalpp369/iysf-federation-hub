import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const LIST_COLS = "id,title,slug,excerpt,cover_image_url,cover_alt,published_at,tags,author_name";

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { limit?: number; offset?: number; tag?: string }) =>
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
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
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

async function assertStaff(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "staff" });
  if (!data) throw new Error("Forbidden: staff only");
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
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
  .inputValidator((d: { email: string; origin: string }) => z.object({ email: z.string().trim().email().max(255), origin: z.string().url() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
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
  .inputValidator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You can't remove your own access.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "staff");
    if ((count ?? 0) <= 1) throw new Error("You can't remove the last staff member.");
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "staff");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
