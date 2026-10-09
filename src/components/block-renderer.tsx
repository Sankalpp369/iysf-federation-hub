import { IYSF } from "./site-chrome";
import { type Block, toEmbedUrl, safeHref, safeImageSrc } from "@/lib/blocks";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[16px] leading-relaxed" style={{ color: IYSF.charcoal }}>
      {blocks.map((b) => (
        <RenderBlock key={b.id} b={b} />
      ))}
    </div>
  );
}

function RenderBlock({ b }: { b: Block }) {
  switch (b.type) {
    case "paragraph":
      return b.text.trim() ? <p className="whitespace-pre-line">{b.text}</p> : null;
    case "heading": {
      const cls = "leading-tight pt-2";
      const st = { fontFamily: "var(--font-display)", fontWeight: 800 } as const;
      return b.level === 2 ? (
        <h2 className={`${cls} text-[24px] md:text-[28px]`} style={st}>{b.text}</h2>
      ) : (
        <h3 className={`${cls} text-[19px] md:text-[22px]`} style={st}>{b.text}</h3>
      );
    }
    case "list": {
      const items = b.items.filter((i) => i.trim());
      return b.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-6">{items.map((i, k) => <li key={k}>{i}</li>)}</ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-6">{items.map((i, k) => <li key={k}>{i}</li>)}</ul>
      );
    }
    case "image": {
      const src = safeImageSrc(b.url);
      if (!src) return null;
      return (
        <figure>
          <img src={src} alt={b.alt} loading="lazy" className="w-full rounded-lg" />
          {b.caption && <figcaption className="mt-2 text-sm opacity-75">{b.caption}</figcaption>}
        </figure>
      );
    }
    case "quote":
      return (
        <blockquote className="border-l-4 pl-4 py-1" style={{ borderColor: IYSF.magenta }}>
          <p className="text-[18px] italic">{b.text}</p>
          {b.attribution && <footer className="mt-2 text-sm font-semibold" style={{ color: IYSF.blue }}>— {b.attribution}</footer>}
        </blockquote>
      );
    case "video": {
      const src = toEmbedUrl(b.url);
      if (!src) return null;
      return (
        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            src={src}
            title="Embedded video"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          />
        </div>
      );
    }
    case "button": {
      const href = safeHref(b.href);
      if (!href || !b.label) return null;
      const ext = /^https?:/.test(href);
      return (
        <p>
          <a
            href={href}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-11 items-center rounded-[10px] px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: IYSF.magenta }}
          >
            {b.label}
          </a>
        </p>
      );
    }
    case "divider":
      return <hr style={{ borderColor: IYSF.blueLine }} />;
    case "callout":
      return (
        <div className="rounded-lg border-l-4 p-4" style={{ borderColor: IYSF.orange, background: "rgba(250,175,64,0.1)" }}>
          <p className="whitespace-pre-line">{b.text}</p>
        </div>
      );
  }
}
