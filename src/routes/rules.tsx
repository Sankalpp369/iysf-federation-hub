import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, FileText, Download, Menu, X } from "lucide-react";
import { Nav, Footer } from "../components/site-chrome";
import { Link } from "@tanstack/react-router";
import { listPublicRules } from "@/lib/cms.functions";

type RuleBlock = { type: "p"; text: string };
type RuleDoc = { id: string; title: string; accent: string; blocks: RuleBlock[] };
type RuleDownload = { title: string; status: string; tone: "success" | "warning" | "neutral"; description: string; download_url?: string | null };

export const Route = createFileRoute("/rules")({
  loader: async () => {
    try {
      const rows = await listPublicRules() as Array<Record<string, any>>;
      const docs: RuleDoc[] = rows.filter((row) => row.kind === "document").map((row) => ({
        id: row.slug,
        title: row.title,
        accent: row.accent,
        blocks: [{ type: "p" as const, text: row.content }],
      }));
      const downloads: RuleDownload[] = rows.filter((row) => row.kind === "download").map((row) => ({
        title: row.title,
        status: row.availability,
        tone: row.tone,
        description: row.description,
        download_url: /^https:\/\//i.test(row.download_url ?? "") ? row.download_url : null,
      }));
      return { docs, downloads, managed: true };
    } catch {
      return { docs: DOCS, downloads: DOWNLOADS, managed: false };
    }
  },
  head: () => ({
    meta: [
      { title: "Rules & Regulations — IYSF Governance" },
      {
        name: "description",
        content:
          "The official rulebook governing competitive Yogasana under the International Yoga Sports Federation.",
      },
      { property: "og:title", content: "Rules & Regulations — IYSF Governance" },
      {
        property: "og:description",
        content:
          "Judging criteria, athlete eligibility, competition format, and the current and forthcoming IYSF rulebooks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RulesPage,
});

const DOCS: RuleDoc[] = [
  {
    id: "judging-criteria",
    title: "Judging Criteria",
    accent: "#FAAF40",
    blocks: [
      { type: "p", text: "IYSF judges score every posture on difficulty, minimum expression, and recommended execution, weighing balance, flexibility, and strength across the routine. Each posture is scored out of 10, with deductions for execution errors and rewards for extra skills. A panel of judges plus a dedicated time judge score every competition live, with results displayed immediately via the IYSF tabulation grid. Full scoring procedures and posture-by-posture criteria are set out in the Posture Guidelines above." },
    ],
  },
  {
    id: "athlete-eligibility",
    title: "Athlete Eligibility",
    accent: "#4298D3",
    blocks: [
      { type: "p", text: "Athletes compete for the national federation of the country whose nationality they hold, across five age divisions: three youth groups (9–11, 12–14, 15–17), Adult (18+), and Senior (50+). National championships generate finalists who qualify for continental and world competition. Judges and coaches are certified at Local, National, or International (A-level) tiers, with A-level certification issued only by IYSF." },
    ],
  },
  {
    id: "competition-format",
    title: "Competition Format",
    accent: "#414042",
    blocks: [
      { type: "p", text: "Each athlete performs a routine of six postures — one from each of the six compulsory groups (backbends, forward compressions, tractions, twists, lifts, and inversions) — within a three-minute time limit. Postures must be held in stillness for at least three seconds to score, with a maximum score requiring a five-second hold. Athletes submit their routine and posture order at registration." },
    ],
  },
];

const DOWNLOADS: RuleDownload[] = [
  { title: "Posture Guidelines", status: "Current — used through the 2026 World Championship", tone: "success", description: "Judging criteria, athlete eligibility, and competition format for all IYSF-sanctioned events." },
  { title: "New Rulebook 2027", status: "Effective from the 2027 season", tone: "warning", description: "Updated rules with tracked changes, replacing the Posture Guidelines from 2027 onward." },
  { title: "Coaching Manual", status: "Reference guide", tone: "neutral", description: "Posture-by-posture coaching drills and progressions for IYSF-certified coaches." },
];

function blocksToPlainText(blocks: RuleBlock[]): string {
  return blocks.map((b) => b.text).join(" ");
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(re);
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded-[2px] px-0.5" style={{ background: "#FAAF4040", color: "#414042" }}>
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function RulesPage() {
  const { docs: DOCS, downloads: DOWNLOADS } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeId, setActiveId] = useState(DOCS[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const q = query.trim().toLowerCase();

  const matchesById = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const d of DOCS) {
      if (!q) {
        map[d.id] = true;
      } else {
        const hay = (d.title + " " + blocksToPlainText(d.blocks)).toLowerCase();
        map[d.id] = hay.includes(q);
      }
    }
    return map;
  }, [q]);

  const matchCount = Object.values(matchesById).filter(Boolean).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToDoc = (id: string) => {
    setActiveId(id);
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-dvh bg-white" style={{ fontFamily: "var(--font-sans)", color: "#414042" }}>
      <Nav />

      <main id="rules-main">
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#4298D3" }}>
              Governance
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "#414042" }}>
              Rules &amp; Regulations
            </h1>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[#414042]">
              The official rules governing competitive Yogasana under IYSF, with current guidance and the forthcoming 2027 rulebook.
            </p>

            <div className="mt-6 max-w-[560px]">
              <label htmlFor="rules-search" className="sr-only">Search rulebook content</label>
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414042]" aria-hidden />
                <input
                  id="rules-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search across all rule documents…"
                  className="w-full rounded-md border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-[#414042] placeholder:text-[#414042] focus:border-[#4298D3] focus:outline-none focus:ring-2 focus:ring-[#4298D3]/30"
                />
              </div>
              <div aria-live="polite" className="mt-2 text-xs text-[#414042]" style={{ fontFamily: "var(--font-mono)" }}>
                {q ? `${matchCount} of ${DOCS.length} documents match "${query}"` : "\u00a0"}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-expanded={mobileNavOpen}
              aria-controls="rules-toc-mobile"
              className="mt-6 flex w-full items-center justify-between rounded-md border border-black/15 bg-white px-4 py-3 text-sm font-medium text-[#414042]"
            >
              <span>Contents — {DOCS.find((d) => d.id === activeId)?.title}</span>
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            {mobileNavOpen && (
              <nav id="rules-toc-mobile" aria-label="Rulebook contents" className="mt-2 rounded-md border border-black/10 bg-white p-2">
                <ul>
                  {DOCS.map((d) => (
                    <li key={d.id}>
                      <button
                        onClick={() => scrollToDoc(d.id)}
                        className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${activeId === d.id ? "bg-black/5 font-semibold" : "hover:bg-black/[0.03]"} ${matchesById[d.id] ? "" : "opacity-40"}`}
                        style={{ borderLeft: `3px solid ${activeId === d.id ? d.accent : "transparent"}` }}
                      >
                        <span>{d.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="grid gap-10 py-10 md:grid-cols-[240px_1fr] md:gap-12 md:py-14">
            <aside className="hidden md:block">
              <nav aria-label="Rulebook contents" className="sticky top-24">
                <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#414042" }}>
                  Contents
                </div>
                <ul className="space-y-0.5">
                  {DOCS.map((d) => {
                    const isActive = activeId === d.id;
                    const dimmed = q && !matchesById[d.id];
                    return (
                      <li key={d.id}>
                        <button
                          onClick={() => scrollToDoc(d.id)}
                          className={`flex w-full items-center gap-2 rounded-r px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]/40 ${isActive ? "bg-black/[0.04] font-semibold text-[#414042]" : "text-[#414042]/85 hover:bg-black/[0.03]"} ${dimmed ? "opacity-40" : ""}`}
                          style={{ borderLeft: `3px solid ${isActive ? d.accent : "transparent"}` }}
                          aria-current={isActive ? "true" : undefined}
                        >
                          {d.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0">
              {q && matchCount === 0 ? (
                <div className="rounded-md border border-black/10 bg-[#FAFAFA] p-8 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#414042" }}>
                    No matches
                  </div>
                  <p className="mt-2 text-sm text-[#414042]">
                    No rule content matches “{query}”. Try a shorter or different keyword.
                  </p>
                  <button onClick={() => setQuery("")} className="mt-4 rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-16">
                  <section aria-labelledby="rule-downloads-title">
                    <h2 id="rule-downloads-title" className="sr-only">Rule documents</h2>
                    <div className="grid gap-5 max-sm:grid-cols-2 max-sm:gap-3 lg:grid-cols-3 md:grid-cols-2">
                      {DOWNLOADS.map((doc) => (
                        <article key={doc.title} className="flex flex-col rounded-[12px] border border-black/10 bg-white p-3.5 sm:min-h-[270px] sm:p-5">
                          <div className="flex items-start gap-3">
                            <FileText size={20} className="mt-0.5 shrink-0 text-[#4298D3]" aria-hidden="true" />
                            <h3 className="text-[18px] font-bold text-[#414042]" style={{ fontFamily: "var(--font-display)" }}>{doc.title}</h3>
                          </div>
                          <span className={`mt-4 w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${doc.tone === "success" ? "bg-emerald-50 text-emerald-800" : doc.tone === "warning" ? "bg-amber-50 text-amber-900" : "bg-black/5 text-[#414042]"}`}>{doc.status}</span>
                          <p className="mt-4 text-sm leading-relaxed text-[#414042]">{doc.description}</p>
                          {doc.download_url ? <a href={doc.download_url} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 rounded-md border border-black/15 px-3.5 py-2 text-sm font-medium text-[#414042] hover:bg-black/5">
                            <Download size={15} aria-hidden="true" /> Download PDF
                          </a> : <button type="button" disabled className="mt-auto inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-md border border-black/15 px-3.5 py-2 text-sm font-medium text-[#414042] opacity-55" aria-label={`${doc.title} download not yet available`}>
                            <Download size={15} aria-hidden="true" /> Download PDF
                          </button>}
                        </article>
                      ))}
                    </div>
                  </section>
                  {DOCS.map((d) => {
                    const isMatch = matchesById[d.id];
                    if (q && !isMatch) return null;
                    return (
                      <section
                        key={d.id}
                        id={d.id}
                        ref={(el) => { sectionRefs.current[d.id] = el; }}
                        aria-labelledby={`${d.id}-title`}
                        className="scroll-mt-24"
                      >
                        <div
                          className="mb-1 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                          style={{ background: `${d.accent}1A`, color: d.accent === "#FAAF40" ? "#3A2400" : d.accent }}
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: d.accent }} aria-hidden />
                          Document
                        </div>
                        <h2
                          id={`${d.id}-title`}
                          className="mt-2 text-2xl font-extrabold tracking-tight md:text-[26px]"
                          style={{ fontFamily: "var(--font-display)", color: "#414042" }}
                        >
                          {highlight(d.title, query)}
                        </h2>
                        <div className="mt-4">
                          {d.id === "judging-criteria" && (
                            <div className="mt-3 text-xs text-[#414042]">
                              Related:{" "}
                              <Link to="/academy/judging" className="underline decoration-black/20 underline-offset-2 hover:text-[#414042]">
                                Judging Academy track
                              </Link>
                            </div>
                          )}
                          {d.id === "athlete-eligibility" && (
                            <div className="mt-3 text-xs text-[#414042]">
                              Related:{" "}
                              <Link to="/academy" className="underline decoration-black/20 underline-offset-2 hover:text-[#414042]">
                                IYSF Academy
                              </Link>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#414042]/90">
                          {d.blocks.map((b, i) => {
                            return <p key={i}>{highlight(b.text, query)}</p>;
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
