import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { IYSF } from "../../components/site-chrome";
import { fmtDate } from "../../components/news-article";
import { deletePost as deletePostAction, savePost as savePostAction } from "@/lib/cms.functions";
import { parseContent } from "@/lib/blocks";

export const Route = createFileRoute("/_authenticated/admin/news/")({ component: NewsAdmin });

const STATUS_COLOR: Record<string, string> = { published: "#1F8A4C", draft: "#8a8a8c", scheduled: "#C27C0E" };

function NewsAdmin() {
  const qc = useQueryClient();
  const savePost = useServerFn(savePostAction);
  const deletePost = useServerFn(deletePostAction);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");

  const rows = useMemo(() => {
    let r = (data ?? []).filter((p) => (status === "all" || p.status === status) && p.title.toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title)
      : sort === "published" ? (b.published_at ?? "").localeCompare(a.published_at ?? "")
      : b.updated_at.localeCompare(a.updated_at));
    return r;
  }, [data, q, status, sort]);

  async function duplicate(id: string) {
    const p = data?.find((x) => x.id === id);
    if (!p) return;
    try {
      await savePost({ data: {
        title: `${p.title} (copy)`, slug: `${p.slug}-copy-${Math.random().toString(36).slice(2, 6)}`,
        excerpt: p.excerpt, cover_image_url: p.cover_image_url, cover_alt: p.cover_alt,
        content: parseContent(p.content), status: "draft", published_at: null, tags: p.tags,
        seo_title: p.seo_title, seo_description: p.seo_description, author_name: p.author_name ?? "IYSF Communications",
      } });
      toast.success("Post duplicated as draft");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't duplicate post"); }
    void qc.invalidateQueries({ queryKey: ["admin-posts"] });
  }
  async function del(id: string, title: string) {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    try { await deletePost({ data: { id } }); toast.success("Post deleted"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't delete post"); }
    void qc.invalidateQueries({ queryKey: ["admin-posts"] });
  }

  const ctl = "min-h-10 rounded-md border bg-white px-3 text-sm";
  const Actions = ({ id, title }: { id: string; title: string }) => (
    <div className="flex flex-wrap gap-3 text-sm font-semibold">
      <Link to="/admin/news/$id" params={{ id }} style={{ color: IYSF.blue }}>Edit</Link>
      <button type="button" onClick={() => duplicate(id)} style={{ color: IYSF.charcoal }}>Duplicate</button>
      <button type="button" onClick={() => del(id, title)} style={{ color: IYSF.magenta }}>Delete</button>
    </div>
  );
  const Badge = ({ s }: { s: string }) => <span className="rounded-full px-2 py-0.5 text-xs font-semibold capitalize text-white" style={{ background: STATUS_COLOR[s] }}>{s}</span>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>News</h1>
        <Link to="/admin/news/new" className="inline-flex min-h-11 items-center rounded-[10px] px-4 text-sm font-bold text-white" style={{ background: IYSF.magenta }}>New post</Link>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input aria-label="Search posts" placeholder="Search titles…" value={q} onChange={(e) => setQ(e.target.value)} className={ctl} style={{ borderColor: IYSF.blueLine }} />
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={ctl} style={{ borderColor: IYSF.blueLine }}>
          <option value="all">All statuses</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="draft">Draft</option>
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className={ctl} style={{ borderColor: IYSF.blueLine }}>
          <option value="updated">Recently edited</option><option value="published">Publish date</option><option value="title">Title A–Z</option>
        </select>
      </div>
      {error && <p className="mt-4 text-sm" style={{ color: IYSF.magenta }}>Couldn't load posts.</p>}
      {isLoading && <div className="mt-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-black/5" />)}</div>}
      {data && rows.length === 0 && <p className="mt-6 text-sm opacity-70">No posts match.</p>}
      <div className="mt-4 hidden overflow-hidden rounded-xl border bg-white md:block" style={{ borderColor: IYSF.blueLine }}>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider" style={{ color: IYSF.blue, background: IYSF.blueWash }}>
            <tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Published</th><th className="p-3">Author</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: IYSF.blueLine }}>
                <td className="p-3 font-semibold">{p.title}</td><td className="p-3"><Badge s={p.status} /></td>
                <td className="p-3">{fmtDate(p.published_at)}</td><td className="p-3">{p.author_name}</td>
                <td className="p-3"><Actions id={p.id} title={p.title} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 space-y-2 md:hidden">
        {rows.map((p) => (
          <li key={p.id} className="rounded-xl border bg-white p-4" style={{ borderColor: IYSF.blueLine }}>
            <div className="flex items-start justify-between gap-2"><span className="font-semibold">{p.title}</span><Badge s={p.status} /></div>
            <div className="mt-1 text-xs opacity-70">{fmtDate(p.published_at)}{p.author_name ? ` · ${p.author_name}` : ""}</div>
            <div className="mt-3"><Actions id={p.id} title={p.title} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
