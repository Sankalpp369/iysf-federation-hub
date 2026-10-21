import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav, Footer, IYSF } from "../components/site-chrome";
import { NewsArticle } from "../components/news-article";
import { getPublishedPost } from "@/lib/cms.functions";
import { safeImageSrc, SITE_URL } from "@/lib/blocks";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const res = await getPublishedPost({ data: { slug: params.slug } });
    if (!res) throw notFound();
    return res;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Article not found — IYSF" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.post;
    const title = `${p.seo_title || p.title} — IYSF`;
    const desc = p.seo_description || p.excerpt || "IYSF news";
    const cover = p.cover_image_url ? safeImageSrc(p.cover_image_url) : null;
    const img = cover ? new URL(cover, SITE_URL).toString() : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE_URL}/news/${params.slug}` },
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/news/${params.slug}` }],
    };
  },
  notFoundComponent: NotFoundArticle,
  errorComponent: () => (
    <div className="p-10 text-center">This article couldn't load. <Link to="/news" className="underline">Back to news</Link></div>
  ),
  component: ArticlePage,
});

function NotFoundArticle() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal }}>
      <Nav />
      <main className="mx-auto max-w-[760px] px-4 py-20 text-center">
        <p className="text-6xl font-extrabold" style={{ color: IYSF.blue }}>404</p>
        <h1 className="mt-3 text-2xl font-bold">Article not found</h1>
        <p className="mt-2">It may have been moved or unpublished.</p>
        <Link to="/news" className="mt-6 inline-block font-semibold underline" style={{ color: IYSF.magenta }}>Browse all news</Link>
      </main>
      <Footer />
    </div>
  );
}

function ArticlePage() {
  const { post, prev, next } = Route.useLoaderData();
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal }}>
      <Nav />
      <main><NewsArticle post={post} prev={prev} next={next} /></main>
      <Footer />
    </div>
  );
}
