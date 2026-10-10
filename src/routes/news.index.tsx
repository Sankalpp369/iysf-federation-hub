import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Nav, Footer, IYSF } from "../components/site-chrome";
import { fmtDate } from "../components/news-article";
import { listPublishedPosts, listAllTags } from "@/lib/cms.functions";
import { safeImageSrc } from "@/lib/blocks";

const PAGE = 9;

export const Route = createFileRoute("/news/")({
  validateSearch: z.object({ tag: z.string().max(80).optional() }),
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: async ({ deps }) => {
    const [first, tags] = await Promise.all([listPublishedPosts({ data: { limit: PAGE, offset: 0, tag: deps.tag } }), listAllTags()]);
    return { ...first, tags };
  },
  head: () => ({
    meta: [
      { title: "News — IYSF" },
      { name: "description", content: "Latest news from the International Yoga Sports Federation: championships, federations and the Academy." },
      { property: "og:title", content: "News — IYSF" },
      { property: "og:description", content: "Championship, federation and Academy news from IYSF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "alternate", type: "application/rss+xml", title: "IYSF News", href: "/news/rss.xml" }],
  }),
  pendingComponent: () => (
    <div className="mx-auto grid max-w-[1240px] gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-xl bg-black/5" />)}
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center">News couldn't load. Please refresh.</div>,
  component: NewsIndex,
});

type Row = Awaited<ReturnType<typeof listPublishedPosts>>["posts"][number];

function NewsIndex() {
  const data = Route.useLoaderData();
  const { tag } = Route.useSearch();
  const navigate = useNavigate({ from: "/news/" });
  const [extra, setExtra] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const posts = [...data.posts, ...extra];

  async function more() {
    setLoading(true);
    try {
      const r = await listPublishedPosts({ data: { limit: PAGE, offset: posts.length, tag } });
      setExtra((e) => [...e, ...r.posts]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal }}>
      <Nav />
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-8 md:py-16">
        <h1 className="text-[32px] md:text-[48px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>News</h1>
        {data.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
            {[undefined, ...data.tags].map((t) => {
              const active = t === tag;
              return (
                <button key={t ?? "all"} type="button" aria-pressed={active}
                  onClick={() => { setExtra([]); void navigate({ search: t ? { tag: t } : {} }); }}
                  className="min-h-9 rounded-full border px-3.5 text-sm font-semibold"
                  style={{ borderColor: IYSF.blue, background: active ? IYSF.blue : "transparent", color: active ? "#fff" : IYSF.blue }}>
                  {t ?? "All"}
                </button>
              );
            })}
          </div>
        )}
        {posts.length === 0 ? (
          <div className="mt-10 rounded-xl border p-10 text-center" style={{ borderColor: IYSF.blueLine }}>
            <p className="text-lg font-bold">No news yet</p>
            <p className="mt-1 text-sm">Check back soon for championship and federation updates.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => {
              const img = p.cover_image_url ? safeImageSrc(p.cover_image_url) : null;
              return (
                <Link key={p.id} to="/news/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-lg" style={{ borderColor: IYSF.blueLine }}>
                  <div className="aspect-[16/9]" style={{ background: IYSF.blueWash }}>
                    {img && <img src={img} alt={p.cover_alt ?? ""} loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <time className="text-xs font-semibold uppercase tracking-wider" style={{ color: IYSF.blue }}>{fmtDate(p.published_at)}</time>
                    <h2 className="mt-1 text-[18px] font-bold leading-snug group-hover:underline" style={{ fontFamily: "var(--font-display)" }}>{p.title}</h2>
                    {p.excerpt && <p className="mt-2 line-clamp-3 text-sm">{p.excerpt}</p>}
                    {p.tags.length > 0 && <p className="mt-3 text-xs font-semibold" style={{ color: IYSF.magenta }}>{p.tags.join(" · ")}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {posts.length < data.total && (
          <div className="mt-8 text-center">
            <button type="button" onClick={more} disabled={loading} className="min-h-11 rounded-[10px] px-6 text-sm font-bold text-white disabled:opacity-60" style={{ background: IYSF.magenta }}>
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
