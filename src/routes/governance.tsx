import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown, ArrowRight } from "lucide-react";
import { Nav, Footer } from "../components/site-chrome";
import { FEDERATIONS, STATUS_COLOR, type MembershipStatus } from "../data/iysf";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance — How IYSF Is Structured & Governed" },
      {
        name: "description",
        content:
          "IYSF's legal status as a Swiss non-profit in Lausanne, its board and committee structure, bylaws, and governing policies.",
      },
      { property: "og:title", content: "Governance — IYSF" },
      {
        property: "og:description",
        content:
          "Legal status, board and committee structure, bylaws and policy documents of the International Yoga Sports Federation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GovernancePage,
});

const AZURE = "#4298D3";
const ORANGE = "#FAAF40";
const MAGENTA = "#DE007A";

const BODIES = [
  {
    name: "Congress",
    accent: AZURE,
    desc:
      "The general assembly of member federations. Full Members hold voting rights; Provisional and Observer federations attend without a vote.",
  },
  {
    name: "Executive Committee",
    accent: ORANGE,
    desc:
      "Elected officers responsible for day-to-day governance, budget oversight and sanctioning of international events.",
  },
  {
    name: "Technical Committee",
    accent: MAGENTA,
    desc:
      "Owns the competition format, judging criteria and the certification standards published through the IYSF Academy.",
  },
  {
    name: "Athletes' Commission",
    accent: AZURE,
    desc:
      "Represents competing athletes in rule-making, safeguarding and anti-doping consultation.",
  },
  {
    name: "Ethics & Disciplinary Panel",
    accent: "#414042",
    desc:
      "Independent review of Code of Conduct matters, appeals and disciplinary outcomes.",
  },
];

const DOCUMENTS = [
  {
    title: "Judging Criteria",
    href: "/documents/rules/judging-criteria.pdf",
    desc: "How certified judges evaluate a competitive Yogasana routine.",
  },
  {
    title: "Athlete Eligibility",
    href: "/documents/rules/athlete-eligibility.pdf",
    desc: "Who may compete under IYSF sanction, and how athletes are licensed.",
  },
  {
    title: "Anti-Doping Policy",
    href: "/documents/rules/anti-doping.pdf",
    desc: "Testing, exemptions, results management and athlete rights.",
  },
  {
    title: "Code of Conduct",
    href: "/documents/rules/code-of-conduct.pdf",
    desc: "Conduct expected of athletes, coaches, judges and officials.",
  },
  {
    title: "Competition Format",
    href: "/documents/rules/competition-format.pdf",
    desc: "Event structure, rounds and progression at sanctioned competitions.",
  },
];

const STATUS_NOTE: Record<MembershipStatus, string> = {
  "Full Member": "Voting rights at Congress and full championship access.",
  Provisional:
    "Competes and certifies during a review period before ratification.",
  Observer: "Attends congresses and seminars without voting rights.",
};

function GovernancePage() {
  const counts = (Object.keys(STATUS_COLOR) as MembershipStatus[]).map((s) => ({
    status: s,
    n: FEDERATIONS.filter((f) => f.status === s).length,
  }));

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#414042" }}>
      <Nav />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 pt-14 pb-8 md:px-8 md:pt-20 md:pb-10">
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: AZURE }}
            >
              Governance
            </div>
            <h1
              className="text-[36px] leading-[1.04] tracking-[-0.02em] md:text-[60px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
                fontStretch: "expanded",
              }}
            >
              How IYSF is governed
            </h1>
            <p
              className="mt-4 max-w-[660px] text-base md:text-[17px]"
              style={{ color: "#414042" }}
            >
              The International Yoga Sports Federation is a non-profit
              international federation founded in Lausanne, Switzerland in 2013
              and officially registered in 2014. This page sets out its legal
              status, governing bodies and published policies.
            </p>
            <div className="mt-6 h-[3px] w-16" style={{ background: ORANGE }} />
          </div>
        </section>

        <section
          className="border-y border-black/[0.06]"
          style={{ background: "#FAFAFA" }}
        >
          <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-20">
            <div>
              <div
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#414042" }}
              >
                Legal status
              </div>
              <h2
                className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "#414042",
                }}
              >
                A Swiss non-profit federation, based in Lausanne
              </h2>
              <div
                className="mt-5 space-y-4 text-[15px] leading-relaxed"
                style={{ color: "#3a3a3a" }}
              >
                <p>
                  IYSF was founded in Lausanne, Switzerland in 2013 and
                  officially registered in 2014. It operates as a non-profit
                  body whose purpose is to govern Yogasana as a competitive
                  sport: sanctioning international championships, publishing a
                  single scoring standard, and certifying judges and coaches
                  through the IYSF Academy.
                </p>
                <p>
                  Membership is held by national federations rather than
                  individuals. Athletes, judges and coaches take part through
                  their national member federation.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/about/history"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color: AZURE }}
                >
                  Read the full IYSF history <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                  style={{ color: AZURE }}
                >
                  Privacy Policy <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 self-start">
              {[
                { k: "Legal form", v: "Non-profit international federation" },
                { k: "Seat", v: "Lausanne, Switzerland" },
                { k: "Founded", v: "2013" },
                { k: "Registered", v: "2014" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-lg border border-black/[0.08] bg-white p-5"
                >
                  <dt
                    className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "#414042" }}
                  >
                    {row.k}
                  </dt>
                  <dd
                    className="mt-2 text-[15px]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#414042",
                    }}
                  >
                    {row.v}
                  </dd>
                </div>
              ))}
              <div className="col-span-2 rounded-lg border border-black/[0.08] bg-white p-5">
                <dt
                  className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#414042" }}
                >
                  Headquarters
                </dt>
                <dd className="mt-2 text-sm not-italic leading-relaxed" style={{ color: "#3a3a3a" }}>
                  Maison du Sport International
                  <br />
                  Av de Rhodanie 54
                  <br />
                  Lausanne, Switzerland
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: MAGENTA }}
            >
              Structure
            </div>
            <h2
              className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              Board & committees
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {BODIES.map((b) => (
                <li
                  key={b.name}
                  className="rounded-lg border border-black/[0.08] bg-white p-6"
                >
                  <div className="h-[3px] w-10" style={{ background: b.accent }} />
                  <h3
                    className="mt-4 text-[18px]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#414042",
                    }}
                  >
                    {b.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#414042" }}>
                    {b.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-y border-black/[0.06]"
          style={{ background: "#FAFAFA" }}
        >
          <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#414042" }}
            >
              Membership
            </div>
            <h2
              className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              Three classes of membership
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {counts.map(({ status, n }) => (
                <li
                  key={status}
                  className="rounded-lg border border-black/[0.08] bg-white p-6"
                >
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      background: STATUS_COLOR[status],
                      color: STATUS_COLOR[status] === ORANGE ? "#3A2400" : "#fff",
                    }}
                  >
                    {status}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: "#414042" }}>
                    {STATUS_NOTE[status]}
                  </p>
                  <p
                    className="mt-4 text-[13px]"
                    style={{ fontFamily: "var(--font-mono)", color: "#414042" }}
                  >
                    {n} listed in the directory
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/directory"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: AZURE }}
              >
                Browse the federation directory <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                to="/join-us"
                className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: ORANGE, color: "#3A2400" }}
              >
                Apply for membership
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#414042" }}
            >
              Bylaws & policies
            </div>
            <h2
              className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              Governing documents
            </h2>
            <p className="mt-4 max-w-[680px] text-base" style={{ color: "#414042" }}>
              The full rulebook is published on the{" "}
              <Link to="/rules" className="font-semibold hover:underline" style={{ color: AZURE }}>
                Rules & Regulations
              </Link>{" "}
              page.
            </p>
            <ul className="mt-8 divide-y divide-black/[0.08] rounded-lg border border-black/[0.08]">
              {DOCUMENTS.map((d) => (
                <li
                  key={d.title}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div
                      className="text-[15px]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#414042",
                      }}
                    >
                      {d.title}
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "#414042" }}>
                      {d.desc}
                    </p>
                  </div>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:bg-black/[0.03]"
                    style={{ borderColor: AZURE, color: AZURE }}
                    aria-label={`Download ${d.title} PDF`}
                  >
                    <FileDown size={14} aria-hidden="true" />
                    Download PDF
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-t border-black/[0.06]"
          style={{ background: "#FAFAFA" }}
        >
          <div className="mx-auto grid max-w-[1240px] gap-5 px-5 py-14 md:grid-cols-4 md:px-8">
            {[
              { to: "/rules", t: "Rules & Regulations", d: "The five policy documents in full." },
              { to: "/directory", t: "Federation Directory", d: "Who the member federations are." },
              { to: "/privacy", t: "Privacy Policy", d: "How IYSF handles personal data." },
              { to: "/about/history", t: "History", d: "From the Ghosh Cup to Lausanne." },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="rounded-lg border border-black/[0.08] bg-white p-5 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="text-[15px]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#414042",
                  }}
                >
                  {c.t}
                </div>
                <p className="mt-2 text-sm" style={{ color: "#414042" }}>
                  {c.d}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
