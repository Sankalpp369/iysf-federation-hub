import { Download, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function TrackIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="24" cy="9" r="2.8" fill={color} />
      <line x1="24" y1="12" x2="24" y2="28" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="24" y1="16" x2="12" y2="8" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="24" y1="16" x2="36" y2="8" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="24" y1="28" x2="16" y2="42" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="24" y1="28" x2="32" y2="42" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export type Tier = { name: string; desc: string };
export type Guide = { title: string; desc: string; pdf: string };

export function TrackHeader({
  track,
  color,
  heading,
  sub,
}: {
  track: string;
  color: string;
  heading: string;
  sub: string;
}) {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto max-w-[1240px] px-5 pt-14 pb-10 md:px-8 md:pt-20 md:pb-14">
        <Link
          to="/academy"
          className="text-[11px] font-semibold uppercase tracking-[0.22em] hover:underline"
          style={{ color: "#4298D3", fontFamily: "var(--font-sans)" }}
        >
          Academy — {track}
        </Link>
        <h1
          className="mt-3 text-[40px] leading-[1.02] tracking-[-0.02em] md:text-[64px]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "#414042",
            fontStretch: "expanded",
          }}
        >
          {heading}
        </h1>
        <p
          className="mt-4 max-w-[640px] text-base leading-relaxed md:text-[17px]"
          style={{ color: "#414042" }}
        >
          {sub}
        </p>
        <div className="mt-6 h-[3px] w-16" style={{ background: color }} />
      </div>
    </section>
  );
}

export function TiersGrid({ tiers, color, note }: { tiers: Tier[]; color: string; note?: string }) {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
        <div
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#414042" }}
        >
          Levels & tiers
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className="rounded-lg border border-black/10 bg-white p-6 transition-all focus-within:ring-2 focus-within:ring-[#4298D3] hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div
                className="mb-4 text-[10.5px] font-mono font-medium tracking-widest"
                style={{ color, fontFamily: "var(--font-mono)" }}
              >
                TIER 0{i + 1}
              </div>
              <div
                className="text-xl leading-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
              >
                {t.name}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#414042" }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
        {note && (
          <p className="mt-6 max-w-[760px] text-sm leading-relaxed" style={{ color: "#414042" }}>
            <span className="font-semibold">Note:</span> {note}
          </p>
        )}
      </div>
    </section>
  );
}

export function GuidesList({
  guides,
  color,
  track,
}: {
  guides: Guide[];
  color: string;
  track: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
        <div
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#414042" }}
        >
          Guides & standards
        </div>
        <ul className="grid gap-4 max-sm:grid-cols-2 max-sm:gap-3 md:grid-cols-2">
          {guides.map((g) => (
            <li
              key={g.title}
              className="flex flex-col justify-between gap-4 rounded-lg border border-black/10 p-5 transition-colors hover:border-black/25"
            >
              <div>
                <div
                  className="text-[15px] leading-snug"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
                >
                  {g.title}
                </div>
                <MobileCollapse label="What's inside">
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#414042" }}>
                    {g.desc}
                  </p>
                </MobileCollapse>
              </div>
              <a
                href={g.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: color, color }}
                aria-label={`Download ${g.title} PDF for ${track}`}
              >
                <Download size={14} aria-hidden="true" />
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SupportingContent({ track, color }: { track: string; color: string }) {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-20">
        <div>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color }}
          >
            The standard
          </div>
          <h2
            className="text-[28px] leading-tight tracking-[-0.01em] md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            What IYSF expects from every certified {track.toLowerCase()}.
          </h2>
          <div className="mt-6 space-y-5 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
            <p>
              Every certified {track.toLowerCase()} works to a single set of IYSF standards, so an
              athlete meets the same expectations in every member federation.
            </p>
            <h3
              className="text-[15px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#414042" }}
            >
              Method
            </h3>
            <p>
              Training combines the published IYSF framework with supervised practice and review by
              senior officials.
            </p>
            <h3
              className="text-[15px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#414042" }}
            >
              Assessment
            </h3>
            <p>
              Competency is assessed under IYSF oversight before certification is granted.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {[1, 2].map((n) => (
            <div
              key={n}
              role="img"
              aria-label={`Image placeholder — ${track} in practice`}
              className={`flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-black/20 bg-white text-center text-xs ${n === 2 ? "max-sm:hidden" : ""}`}
              style={{ color: "#414042", fontFamily: "var(--font-mono)" }}
            >
              Image placeholder — {track} in practice
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({
  track,
  color,
  primaryLabel,
  primaryHref,
  relatedTo,
  relatedLabel,
}: {
  track: string;
  color: string;
  primaryLabel: string;
  primaryHref: string;
  relatedTo?: string;
  relatedLabel?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 border-t border-black/10 px-5 py-14 md:flex-row md:items-center md:px-8">
        <div>
          <div
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color }}
          >
            Get the standards
          </div>
          <p
            className="max-w-[540px] text-[18px] leading-snug"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
          >
            Download the full {track} guide, or reach the Academy directly with questions.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-95"
              style={{ background: color, color: "#fff" }}
              aria-label={`Download ${primaryLabel} PDF`}
            >
              <Download size={15} aria-hidden="true" />
              {primaryLabel}
            </a>
            {/* VERIFY: confirm this is IYSF's current active Academy form before launch. */}
            <a
              href="https://eu.jotform.com/form/260411558517355"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2.5 text-sm font-semibold text-[#414042] transition-colors hover:bg-black/5"
            >
              <Mail size={15} aria-hidden="true" />
              Contact the Academy
            </a>
          </div>
          {relatedTo && relatedLabel && (
            <Link
              to={relatedTo}
              className="text-xs text-[#414042] underline decoration-black/20 underline-offset-2 hover:text-[#414042]"
            >
              Related: {relatedLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}