import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer, IYSF } from "./site-chrome";
import { photoFor } from "../data/officer-photos";

export function PageHeader({
  kicker,
  title,
  sub,
  accent = IYSF.blue,
}: {
  kicker: string;
  title: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 pt-14 pb-8 md:px-8 md:pt-20 md:pb-10">
        <div
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {kicker}
        </div>
        <h1
          className="text-[36px] leading-[1.04] tracking-[-0.02em] md:text-[56px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
        >
          {title}
        </h1>
        {sub && (
          <p className="mt-4 max-w-[680px] text-base md:text-[17px]" style={{ color: IYSF.charcoal }}>
            {sub}
          </p>
        )}
        <div className="mt-6 h-[3px] w-16" style={{ background: IYSF.orange }} />
      </div>
    </section>
  );
}

export function Section({
  heading,
  kicker,
  tint = false,
  accent = IYSF.blue,
  children,
}: {
  heading?: string;
  kicker?: string;
  tint?: boolean;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={tint ? "border-y" : ""}
      style={
        tint
          ? { background: IYSF.blueWash, borderColor: IYSF.blueLine }
          : { background: "#fff" }
      }
    >
      <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-16">
        {kicker && (
          <div
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            {kicker}
          </div>
        )}
        {heading && (
          <h2
            className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            {heading}
          </h2>
        )}
        <div className={heading || kicker ? "mt-6" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="max-w-[720px] space-y-4 text-[15px] leading-relaxed md:text-base"
      style={{ color: "#3a3a3a" }}
    >
      {children}
    </div>
  );
}

export function initialsOf(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export function PhotoPlaceholder({
  name,
  size = "md",
  accent = IYSF.blue,
}: {
  name: string;
  size?: "sm" | "md";
  accent?: string;
}) {
  const dim = size === "sm" ? "h-16 w-16 text-[15px]" : "h-24 w-24 text-[22px]";
  const src = photoFor(name);
  if (src) {
    return (
      <img
        src={src}
        alt={`Portrait of ${name}`}
        loading="lazy"
        className={`${dim} rounded-full object-cover`}
        style={{ border: `2px solid ${IYSF.blueLine}` }}
      />
    );
  }
  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-full font-bold`}
      style={{ background: IYSF.blueWash, color: accent, border: `2px solid ${IYSF.blueLine}` }}
      role="img"
      aria-label={`Photo placeholder for ${name} — approved headshot pending`}
      title={`Photo placeholder — ${name}`}
    >
      {initialsOf(name)}
    </div>
  );
}

export function InfoCard({
  title,
  meta,
  children,
  accent = IYSF.blue,
  photo = false,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
  accent?: string;
  photo?: boolean;
}) {
  return (
    <div
      className="rounded-[12px] border bg-white p-3.5 sm:p-6"
      style={{ borderColor: IYSF.blueLine, boxShadow: IYSF.blueShadow }}
    >
      {photo ? (
        <PhotoPlaceholder name={title} accent={accent} />
      ) : (
        <div className="h-[3px] w-10" style={{ background: accent }} />
      )}
      <h3
        className="mt-3 text-[15px] sm:mt-4 sm:text-[18px]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
      >
        {title}
      </h3>
      {meta && (
        <div
          className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] sm:text-[12px] sm:tracking-[0.16em]"
          style={{ color: IYSF.magenta }}
        >
          {meta}
        </div>
      )}
      {children && (
        <div className="mt-2 text-[12.5px] leading-snug sm:mt-3 sm:text-sm sm:leading-relaxed" style={{ color: IYSF.charcoal }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function ComingSoon({
  title = "Coming soon",
  body,
  cta,
}: {
  title?: string;
  body: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div
      className="rounded-[12px] border border-dashed p-10 text-center"
      style={{ borderColor: IYSF.blueLine, background: IYSF.blueWash }}
    >
      <div
        className="text-[20px]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
      >
        {title}
      </div>
      <p
        className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed"
        style={{ color: IYSF.charcoal }}
      >
        {body}
      </p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          style={{ color: IYSF.blue }}
        >
          {cta.label} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function JoinCta() {
  return (
    <section style={{ background: IYSF.orange }}>
      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-5 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h2
            className="text-[24px] leading-tight md:text-[30px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#3A2400" }}
          >
            Bring your federation into IYSF
          </h2>
          <p className="mt-2 max-w-[560px] text-sm" style={{ color: "#3A2400" }}>
            National federations join a recognized international structure — standardized rules,
            certified officials, and a pathway to continental and world championships.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/join-us"
            className="rounded-[10px] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "#414042" }}
          >
            Start your application
          </Link>
          <Link
            to="/"
            className="rounded-[10px] border-2 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-black/[0.06]"
            style={{ borderColor: "#3A2400", color: "#3A2400" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#414042" }} className="bg-white">
      <Nav />
      <main>{children}</main>
      <JoinCta />
      <Footer />
    </div>
  );
}