import { createFileRoute } from "@tanstack/react-router";
import { listFeedPosts } from "@/lib/cms.functions";
import { SITE_URL } from "@/lib/blocks";

const STATIC = [
  "/", "/news", "/events", "/events/world-championship-2026", "/rules", "/results", "/academy", "/academy/training",
  "/academy/judging", "/academy/coaching", "/directory", "/sponsorship", "/donate", "/contact", "/join-us", "/privacy",
  "/about/history", "/about/governance", "/about/executive-committee", "/about/champions", "/about/yoga-as-a-sport",
  "/about/international-judges", "/about/international-coaches", "/about/athletes-commission", "/about/technical-committee",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await listFeedPosts();
        const urls = [
          ...STATIC.map((p) => `<url><loc>${SITE_URL}${p}</loc></url>`),
          ...posts.map((p) => `<url><loc>${SITE_URL}/news/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod></url>`),
        ].join("");
        return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
          headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
