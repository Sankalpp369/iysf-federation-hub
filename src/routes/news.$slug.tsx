import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav, Footer, IYSF } from "../components/site-chrome";
import { NEWS, formatNewsDate } from "../data/news";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = NEWS.find((n) => n.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "News"} — IYSF` },
      { name: "description", content: loaderData?.summary ?? "IYSF news" },
      { property: "og:title", content: `${loaderData?.title ?? "News"} — IYSF` },
      { property: "og:description", content: loaderData?.summary ?? "IYSF news" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      Article not found. <Link to="/" className="underline">Back home</Link>
    </div>
  ),
  component: Article,
});

function Article() {
  const n = Route.useLoaderData();
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal }}>
      <Nav />
      <main className="mx-auto max-w-[760px] px-5 py-16 md:px-8">
        <Link to="/" hash="news" className="text-sm font-semibold" style={{ color: IYSF.magenta }}>
          ← All news
        </Link>
        <time dateTime={n.date} className="mt-6 block text-sm font-semibold" style={{ color: IYSF.blue }}>
          {formatNewsDate(n.date)}
        </time>
        <h1 className="mt-2 text-[30px] leading-tight md:text-[42px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
          {n.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed">{n.summary}</p>
      </main>
      <Footer />
    </div>
  );
}
