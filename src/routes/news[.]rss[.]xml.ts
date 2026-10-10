import { createFileRoute } from "@tanstack/react-router";
import { listFeedPosts } from "@/lib/cms.functions";
import { SITE_URL } from "@/lib/blocks";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export const Route = createFileRoute("/news.rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listFeedPosts();
        const items = posts
          .map((p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}/news/${p.slug}</link><guid>${SITE_URL}/news/${p.slug}</guid>${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ""}<description>${esc(p.excerpt ?? "")}</description></item>`)
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>IYSF News</title><link>${SITE_URL}/news</link><description>News from the International Yoga Sports Federation</description>${items}</channel></rss>`;
        return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=600" } });
      },
    },
  },
});
