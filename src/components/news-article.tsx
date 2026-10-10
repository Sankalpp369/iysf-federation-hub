import { Link } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { IYSF } from "./site-chrome";
import { BlockRenderer } from "./block-renderer";
import { parseContent, safeImageSrc } from "@/lib/blocks";

export const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Not scheduled";

type Post = {
  title: string; excerpt: string | null; cover_image_url: string | null; cover_alt: string | null;
  content: unknown; published_at: string | null; tags: string[]; author_name: string | null;
};

export function NewsArticle({ post, prev, next, preview = false }: {
  post: Post; prev?: { slug: string; title: string } | null; next?: { slug: string; title: string } | null; preview?: boolean;
}) {
  const cover = post.cover_image_url ? safeImageSrc(post.cover_image_url) : null;
  async function share() {
    const url = window.location.href;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: post.title, url }); } catch { /* cancelled */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }
  return (
    <article className="mx-auto max-w-[760px] px-4 py-10 md:px-8 md:py-16">
      {!preview && (
        <Link to="/news" className="text-sm font-semibold" style={{ color: IYSF.magenta }}>← All news</Link>
      )}
      <div className="mt-5 text-sm font-semibold" style={{ color: IYSF.blue }}>
        <time dateTime={post.published_at ?? undefined}>{fmtDate(post.published_at)}</time>
        {post.author_name && <span> · {post.author_name}</span>}
      </div>
      <h1 className="mt-2 text-[28px] leading-tight md:text-[42px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
        {post.title}
      </h1>
      {post.excerpt && <p className="mt-3 text-[17px] opacity-80">{post.excerpt}</p>}
      {cover && <img src={cover} alt={post.cover_alt ?? ""} className="mt-6 w-full rounded-xl object-cover" style={{ aspectRatio: "16 / 9" }} />}
      <div className="mt-8"><BlockRenderer blocks={parseContent(post.content)} /></div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6" style={{ borderColor: IYSF.blueLine }}>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link key={t} to="/news" search={{ tag: t }} className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: IYSF.blueLine, color: IYSF.blue }}>{t}</Link>
          ))}
        </div>
        <button type="button" onClick={share} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border-2 px-4 text-sm font-bold" style={{ borderColor: IYSF.blue, color: IYSF.blue }}>
          <Share2 size={16} aria-hidden="true" /> Share
        </button>
      </div>
      {(prev || next) && (
        <nav aria-label="More articles" className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link to="/news/$slug" params={{ slug: prev.slug }} className="rounded-lg border p-4 text-sm" style={{ borderColor: IYSF.blueLine }}>
              <span className="block text-xs font-semibold uppercase tracking-wider" style={{ color: IYSF.blue }}>Previous</span>
              <span className="font-bold">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to="/news/$slug" params={{ slug: next.slug }} className="rounded-lg border p-4 text-right text-sm" style={{ borderColor: IYSF.blueLine }}>
              <span className="block text-xs font-semibold uppercase tracking-wider" style={{ color: IYSF.blue }}>Next</span>
              <span className="font-bold">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
