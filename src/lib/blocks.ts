import { z } from "zod";

export type Block =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 2 | 3; text: string }
  | { id: string; type: "list"; ordered: boolean; items: string[] }
  | { id: string; type: "image"; url: string; alt: string; caption?: string }
  | { id: string; type: "quote"; text: string; attribution?: string }
  | { id: string; type: "video"; url: string }
  | { id: string; type: "button"; label: string; href: string }
  | { id: string; type: "divider" }
  | { id: string; type: "callout"; text: string };

export type BlockType = Block["type"];

const id = z.string().min(1).max(64);
export const blockSchema = z.discriminatedUnion("type", [
  z.object({ id, type: z.literal("paragraph"), text: z.string().max(20000) }),
  z.object({ id, type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3)]), text: z.string().max(500) }),
  z.object({ id, type: z.literal("list"), ordered: z.boolean(), items: z.array(z.string().max(2000)).max(200) }),
  z.object({ id, type: z.literal("image"), url: z.string().max(2000), alt: z.string().max(500), caption: z.string().max(1000).optional() }),
  z.object({ id, type: z.literal("quote"), text: z.string().max(5000), attribution: z.string().max(300).optional() }),
  z.object({ id, type: z.literal("video"), url: z.string().max(2000) }),
  z.object({ id, type: z.literal("button"), label: z.string().max(200), href: z.string().max(2000) }),
  z.object({ id, type: z.literal("divider") }),
  z.object({ id, type: z.literal("callout"), text: z.string().max(5000) }),
]);
export const contentSchema = z.array(blockSchema).max(500);

export function parseContent(raw: unknown): Block[] {
  if (!Array.isArray(raw)) return [];
  const out: Block[] = [];
  for (const b of raw) {
    const r = blockSchema.safeParse(b);
    if (r.success) out.push(r.data as Block);
  }
  return out;
}

export const newId = () => Math.random().toString(36).slice(2, 10);

export function emptyBlock(type: BlockType): Block {
  const i = newId();
  switch (type) {
    case "paragraph": return { id: i, type, text: "" };
    case "heading": return { id: i, type, level: 2, text: "" };
    case "list": return { id: i, type, ordered: false, items: [""] };
    case "image": return { id: i, type, url: "", alt: "", caption: "" };
    case "quote": return { id: i, type, text: "", attribution: "" };
    case "video": return { id: i, type, url: "" };
    case "button": return { id: i, type, label: "", href: "" };
    case "divider": return { id: i, type };
    case "callout": return { id: i, type, text: "" };
  }
}

export const BLOCK_MENU: { type: BlockType; label: string; hint: string }[] = [
  { type: "paragraph", label: "Paragraph", hint: "Plain text" },
  { type: "heading", label: "Heading", hint: "H2 or H3" },
  { type: "list", label: "List", hint: "Bulleted or numbered" },
  { type: "image", label: "Image", hint: "From media library" },
  { type: "quote", label: "Quote", hint: "With attribution" },
  { type: "video", label: "Video", hint: "YouTube or Vimeo" },
  { type: "button", label: "Button", hint: "Label + link" },
  { type: "divider", label: "Divider", hint: "Horizontal line" },
  { type: "callout", label: "Callout", hint: "Highlighted box" },
];

export function toEmbedUrl(raw: string): string | null {
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const ok = (s: string) => /^[A-Za-z0-9_-]{6,20}$/.test(s);
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = u.searchParams.get("v");
    if (v && ok(v)) return `https://www.youtube-nocookie.com/embed/${v}`;
    const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
    if (m && ok(m[1])) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    return null;
  }
  if (host === "youtu.be") {
    const v = u.pathname.slice(1);
    return ok(v) ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(\d{5,12})/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : null;
  }
  return null;
}

export function safeHref(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (s.startsWith("#")) return s;
  try {
    const u = new URL(s);
    if (u.protocol === "https:" || u.protocol === "http:" || u.protocol === "mailto:") return u.toString();
  } catch { /* invalid */ }
  return null;
}

export function safeImageSrc(raw: string): string | null {
  const s = raw.trim();
  if (s.startsWith("/api/public/media/")) return s;
  try {
    const u = new URL(s);
    if (u.protocol === "https:") return u.toString();
  } catch { /* invalid */ }
  return null;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export const SITE_URL = "https://iysf-federation-hub.lovable.app";
export const absoluteUrl = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);
