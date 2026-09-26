import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer } from "../components/site-chrome";
import { TrackIcon } from "../components/academy-shared";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Academy — IYSF" },
      {
        name: "description",
        content:
          "IYSF Academy — resources, standards, and certification pathways for judges and coaches in competitive Yogasana.",
      },
      { property: "og:title", content: "Academy — IYSF" },
      {
        property: "og:description",
        content:
          "Resources and standards for judges, athletes, and coaches in competitive Yogasana.",
      },
    ],
  }),
  component: AcademyOverview,
});

const TRACKS = [
  {
    slug: "judging" as const,
    name: "Judging",
    desc: "Certification standards and scoring frameworks for IYSF judges.",
    color: "#4298D3",
  },
  {
    slug: "coaching" as const,
    name: "Coaching",
    desc: "Curriculum and certification tiers for coaches supporting IYSF athletes.",
    color: "#DE007A",
  },
];

const STATS = [
  { label: "Certified judges", value: "—" },
  { label: "Active coaches", value: "—" },
  { label: "Athletes trained", value: "—" },
  { label: "Countries represented", value: "—" },
];

function AcademyOverview() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <section className="border-b border-black/5">
        <div className="mx-auto max-w-[1240px] px-5 pt-16 pb-12 md:px-8 md:pt-24 md:pb-16">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#4298D3" }}
          >
            Academy
          </div>
          <h1
            className="mt-3 max-w-[900px] text-[44px] leading-[1.02] tracking-[-0.02em] md:text-[72px]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "#414042",
              fontStretch: "expanded",
            }}
          >
            IYSF Academy
          </h1>
          <p
            className="mt-5 max-w-[640px] text-base leading-relaxed md:text-[17px]"
            style={{ color: "#414042" }}
          >
            The IYSF Academy is the federation's resource center for judges, athletes, and coaches
            — standards, guides, and certification pathways in one place.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-5 md:grid-cols-2">
            {TRACKS.map((t) => (
              <Link
                key={t.slug}
                to={t.slug === "judging" ? "/academy/judging" : "/academy/coaching"}
                className="group flex flex-col rounded-lg border border-black/10 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ ["--tw-ring-color" as never]: t.color }}
              >
                <div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-md"
                  style={{ background: `${t.color}18` }}
                >
                  <TrackIcon color={t.color} />
                </div>
                <div
                  className="text-[10.5px] font-mono font-medium tracking-widest"
                  style={{ color: t.color, fontFamily: "var(--font-mono)" }}
                >
                  TRACK
                </div>
                <div
                  className="mt-1 text-2xl leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "#414042",
                  }}
                >
                  {t.name}
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "#414042" }}
                >
                  {t.desc}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
                  style={{ color: t.color }}
                >
                  Learn more <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          <div
            className="mt-8 flex flex-col gap-6 rounded-lg border-2 bg-white p-7 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "#FAAF40" }}
          >
            <div className="max-w-[720px]">
              <div
                className="text-[10.5px] font-mono font-medium tracking-widest"
                style={{ color: "#C07E10", fontFamily: "var(--font-mono)" }}
              >
                ONLINE SERIES · FROM $10/SESSION
              </div>
              <h2
                className="mt-1 text-2xl leading-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
              >
                IYSF Academy — Athlete Training Sessions
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#414042" }}>
                A donation-based series of online sessions covering sports medicine, nutrition,
                technique, and competition preparation. Open to athletes, coaches, and judges.
              </p>
            </div>
            {/* VERIFY: confirm this is IYSF's current active Academy form before launch. */}
            <a
              href="https://eu.jotform.com/form/260411558517355"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "#FAAF40", color: "#3A2400" }}
            >
              Register <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden"
        style={{ background: "#0D1830", color: "#B7C4DA" }}
      >
        <div
          aria-hidden="true"
          className="iysf-ring-drift pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/[0.06]"
        />
        <div
          aria-hidden="true"
          className="iysf-ring-drift pointer-events-none absolute -left-32 -bottom-40 h-[420px] w-[420px] rounded-full border border-white/[0.05]"
        />
        <div className="relative mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
          <div
            className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#FAAF40" }}
          >
            Academy at a glance
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="text-[44px] leading-none md:text-[56px]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    color: "#fff",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#B7C4DA" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}