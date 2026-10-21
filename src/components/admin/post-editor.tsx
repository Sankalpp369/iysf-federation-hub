import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { savePost as savePostAction } from "@/lib/cms.functions";
import type { Database } from "@/integrations/supabase/types";
import { BlockEditor, useHistory } from "./block-editor";
import { MediaLibrary } from "./media-library";
import { IYSF } from "../site-chrome";
import { contentSchema, parseContent, slugify, emptyBlock } from "@/lib/blocks";

type Post = Database["public"]["Tables"]["posts"]["Row"];

const metaSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().min(1, "Slug is required").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes only"),
  excerpt: z.string().max(500),
  status: z.enum(["draft", "scheduled", "published"]),
  seo_title: z.string().max(70, "SEO title: 70 characters max"),
  seo_description: z.string().max(170, "SEO description: 170 characters max"),
  author_name: z.string().max(120),
  cover_alt: z.string().max(300),
});

const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function PostEditor({ post }: { post?: Post }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const savePost = useServerFn(savePostAction);
  const [id, setId] = useState(post?.id);
  const [m, setM] = useState({
    title: post?.title ?? "", slug: post?.slug ?? "", excerpt: post?.excerpt ?? "", status: (post?.status ?? "draft") as "draft" | "scheduled" | "published",
    seo_title: post?.seo_title ?? "", seo_description: post?.seo_description ?? "", author_name: post?.author_name ?? "IYSF Communications",
    cover_image_url: post?.cover_image_url ?? "", cover_alt: post?.cover_alt ?? "", tags: (post?.tags ?? []).join(", "), published_at: toLocal(post?.published_at ?? null),
  });
  const [slugTouched, setSlugTouched] = useState(!!post);
  const h = useHistory(post ? parseContent(post.content) : [emptyBlock("paragraph")]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [coverPick, setCoverPick] = useState(false);
  const first = useRef(true);

  useEffect(() => { if (first.current) { first.current = false; return; } setDirty(true); }, [m, h.blocks]);

  const set = <K extends keyof typeof m>(k: K, v: (typeof m)[K]) => setM((s) => ({ ...s, [k]: v }));

  const save = useCallback(async (opts: { silent?: boolean } = {}) => {
    const meta = metaSchema.safeParse(m);
    if (!meta.success) { if (!opts.silent) toast.error(meta.error.issues[0].message); return null; }
    const content = contentSchema.safeParse(h.blocks);
    if (!content.success) { if (!opts.silent) toast.error("Some blocks are invalid"); return null; }
    let published_at: string | null = m.published_at ? new Date(m.published_at).toISOString() : null;
    let status = m.status;
    if (status === "published" && !published_at) published_at = new Date().toISOString();
    if (status === "scheduled" && !published_at) { if (!opts.silent) toast.error("Pick a publish date and time for scheduled posts"); return null; }
    if (status === "published" && published_at && new Date(published_at) > new Date()) status = "scheduled";
    setSaving(true);
    let savedId: string;
    try {
      const res = await savePost({ data: {
        ...(id ? { id } : {}),
        ...meta.data,
        status,
        published_at,
        content: content.data,
        excerpt: meta.data.excerpt || null,
        seo_title: meta.data.seo_title || null,
        seo_description: meta.data.seo_description || null,
        cover_image_url: m.cover_image_url || null,
        cover_alt: meta.data.cover_alt || null,
        tags: m.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20),
      } });
      savedId = res.id;
    } catch (error) {
      setSaving(false);
      toast.error(error instanceof Error ? error.message : "Couldn't save post");
      return null;
    }
    setSaving(false);
    setDirty(false);
    setSavedAt(new Date());
    if (status !== m.status) setM((s) => ({ ...s, status }));
    void qc.invalidateQueries({ queryKey: ["admin-posts"] });
    if (!opts.silent) toast.success("Saved");
    if (!id) {
      setId(savedId);
      void navigate({ to: "/admin/news/$id", params: { id: savedId }, replace: true });
    }
    return savedId;
  }, [m, h.blocks, id, navigate, qc]);

  useEffect(() => {
    const t = setInterval(() => { if (dirty && m.status === "draft" && m.title.trim()) void save({ silent: true }); }, 30000);
    return () => clearInterval(t);
  }, [dirty, m.status, m.title, save]);

  useBlocker({ shouldBlockFn: () => dirty && !confirm("You have unsaved changes. Leave anyway?"), enableBeforeUnload: () => dirty });

  async function preview() {
    const pid = dirty || !id ? await save({ silent: false }) : id;
    if (pid) window.open(`/admin/preview/${pid}`, "_blank", "noopener");
  }

  const inp = "w-full min-h-10 rounded-md border bg-white px-3 py-2 text-sm";
  const bc = { borderColor: IYSF.blueLine };
  const lab = "mb-1 block text-xs font-semibold uppercase tracking-wider";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center gap-2 border-b bg-[#FAFAFA] px-4 py-2 md:-mx-8 md:px-8" style={bc}>
          <span className="mr-auto text-xs" aria-live="polite">{saving ? "Saving…" : dirty ? "Unsaved changes" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : id ? "Saved" : "New post"}</span>
          <button type="button" onClick={preview} className="min-h-10 rounded-md border px-3 text-sm font-semibold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>Preview</button>
          <button type="button" onClick={() => save()} disabled={saving} className="min-h-10 rounded-md px-4 text-sm font-bold text-white disabled:opacity-60" style={{ background: IYSF.magenta }}>Save</button>
        </div>
        <div>
          <label htmlFor="pe-title" className="sr-only">Title</label>
          <input id="pe-title" value={m.title} placeholder="Post title" className="w-full bg-transparent text-2xl font-extrabold outline-none md:text-3xl" style={{ fontFamily: "var(--font-display)" }}
            onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
        </div>
        <div>
          <label htmlFor="pe-excerpt" className={lab}>Excerpt</label>
          <textarea id="pe-excerpt" rows={2} value={m.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inp} style={bc} />
        </div>
        <BlockEditor h={h} />
      </div>
      <aside className="space-y-4">
        <div className="space-y-3 rounded-xl border bg-white p-4" style={bc}>
          <div>
            <label htmlFor="pe-status" className={lab}>Status</label>
            <select id="pe-status" value={m.status} onChange={(e) => set("status", e.target.value as typeof m.status)} className={inp} style={bc}>
              <option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option>
            </select>
          </div>
          <div>
            <label htmlFor="pe-date" className={lab}>Publish date & time</label>
            <input id="pe-date" type="datetime-local" value={m.published_at} onChange={(e) => set("published_at", e.target.value)} className={inp} style={bc} />
            <p className="mt-1 text-xs opacity-60">Scheduled posts go live automatically at this time.</p>
          </div>
          <div>
            <label htmlFor="pe-slug" className={lab}>Slug</label>
            <input id="pe-slug" value={m.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} className={inp} style={bc} />
          </div>
          <div>
            <label htmlFor="pe-author" className={lab}>Author</label>
            <input id="pe-author" value={m.author_name} onChange={(e) => set("author_name", e.target.value)} className={inp} style={bc} />
          </div>
          <div>
            <label htmlFor="pe-tags" className={lab}>Tags (comma separated)</label>
            <input id="pe-tags" value={m.tags} onChange={(e) => set("tags", e.target.value)} className={inp} style={bc} />
          </div>
        </div>
        <div className="space-y-3 rounded-xl border bg-white p-4" style={bc}>
          <span className={lab}>Cover image</span>
          {m.cover_image_url && <img src={m.cover_image_url} alt="" className="aspect-video w-full rounded-md object-cover" />}
          <div className="flex gap-2">
            <button type="button" onClick={() => setCoverPick(true)} className="min-h-10 rounded-md border px-3 text-sm font-semibold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>{m.cover_image_url ? "Change" : "Choose"}</button>
            {m.cover_image_url && <button type="button" onClick={() => set("cover_image_url", "")} className="text-sm" style={{ color: IYSF.magenta }}>Remove</button>}
          </div>
          <input aria-label="Cover alt text" placeholder="Cover alt text" value={m.cover_alt} onChange={(e) => set("cover_alt", e.target.value)} className={inp} style={bc} />
        </div>
        <div className="space-y-3 rounded-xl border bg-white p-4" style={bc}>
          <div>
            <label htmlFor="pe-seot" className={lab}>SEO title</label>
            <input id="pe-seot" value={m.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inp} style={bc} />
          </div>
          <div>
            <label htmlFor="pe-seod" className={lab}>SEO description</label>
            <textarea id="pe-seod" rows={3} value={m.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={inp} style={bc} />
          </div>
        </div>
      </aside>
      {coverPick && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label="Choose cover image">
          <div className="max-h-[85dvh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white p-4 sm:rounded-xl">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Choose cover image</h2><button type="button" onClick={() => setCoverPick(false)} className="text-sm font-semibold">Close</button></div>
            <MediaLibrary onPick={(x) => { setM((s) => ({ ...s, cover_image_url: x.url, cover_alt: s.cover_alt || x.alt || "" })); setCoverPick(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
