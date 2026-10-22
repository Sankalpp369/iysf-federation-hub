import { useMobileMore, MobileMoreButton } from "../components/mobile-more";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Search, ExternalLink, X, Users, ArrowRight } from "lucide-react";
import { Nav, Footer } from "../components/site-chrome";
import {
  FEDERATIONS,
  REGIONS,
  STATUS_COLOR,
  type Federation,
  type Region,
  type MembershipStatus,
} from "../data/iysf";

export const Route = createFileRoute("/directory/")({
  head: () => ({
    meta: [
      { title: "Federation Directory — IYSF Member Federations" },
      {
        name: "description",
        content:
          "Browse IYSF's network of national member federations governing competitive Yogasana worldwide.",
      },
      { property: "og:title", content: "Federation Directory — IYSF" },
      {
        property: "og:description",
        content:
          "National member federations of the International Yoga Sports Federation, by region and membership status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DirectoryPage,
});

const PinMap = lazy(() => import("../components/events-map"));

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

function DirectoryPage() {
  const more = useMobileMore();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEDERATIONS.filter((f) => {
      const matchesQ =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.country.toLowerCase().includes(q);
      const matchesR = region === "All" || f.region === region;
      return matchesQ && matchesR;
    });
  }, [query, region]);

  useEffect(() => {
    if (selectedId && !filtered.some((f) => f.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((f) => f.id === selectedId) ?? null;
  const hydrated = useHydrated();

  const pins = useMemo(
    () =>
      filtered.map((f) => ({
        id: f.id,
        name: f.name,
        location: `${f.country} · ${f.status}`,
        lat: f.lat,
        lng: f.lng,
        tier: f.status,
      })),
    [filtered]
  );

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#414042" }}>
      <Nav />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 pt-14 pb-6 md:px-8 md:pt-20 md:pb-8">
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#4298D3" }}
            >
              Federation
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
              Federation Directory
            </h1>
            <p
              className="mt-4 max-w-[620px] text-base md:text-[17px]"
              style={{ color: "#414042" }}
            >
              IYSF's network of national federations governing competitive
              Yogasana worldwide.
            </p>
          </div>
        </section>

        <div className="sticky top-[61px] z-30 border-y border-black/[0.06] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:px-8">
            <label className="relative block flex-1">
              <span className="sr-only">Search federations by name or country</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                color="#414042"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by federation or country"
                className="w-full rounded-md border border-black/10 bg-white px-9 py-2.5 text-sm outline-none transition-colors focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
              />
            </label>

            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Filter by region"
            >
              {REGIONS.map((r) => {
                const active = region === r;
                return (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setRegion(r)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
                    style={{
                      borderColor: active ? "#414042" : "rgba(0,0,0,0.12)",
                      background: active ? "#414042" : "#fff",
                      color: active ? "#fff" : "#414042",
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div>
                <div
                  className="overflow-hidden rounded-lg border border-black/[0.08]"
                  style={{ height: 460 }}
                >
                  {hydrated ? (
                    <Suspense
                      fallback={
                        <div
                          className="flex h-full w-full items-center justify-center text-sm"
                          style={{ color: "#414042" }}
                        >
                          Loading map…
                        </div>
                      }
                    >
                      <PinMap
                        events={pins}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        tierColor={STATUS_COLOR}
                      />
                    </Suspense>
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ background: "#FAFAFA" }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {(Object.keys(STATUS_COLOR) as MembershipStatus[]).map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "#414042" }}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: STATUS_COLOR[s] }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>

                <div
                  aria-live="polite"
                  className="mt-4 motion-safe:transition-all motion-safe:duration-200"
                >
                  {selected && (
                    <div className="motion-safe:animate-[fadein_.2s_ease]">
                      <FederationCard
                        federation={selected}
                        highlighted
                        onClose={() => setSelectedId(null)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#DE007A" }}
                >
                  Member federations
                </div>
                {filtered.length === 0 ? (
                  <EmptyState />
                ) : (
                  <ul className="flex max-h-[560px] flex-col gap-3 overflow-auto pr-1 max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
                    {filtered.map((f, i) => (
                      <li key={f.id} className={more.hide(i, 4)}>
                        <FederationCard
                          federation={f}
                          onSelect={() => setSelectedId(f.id)}
                          highlighted={f.id === selectedId}
                        />
                      </li>
                    ))}
                  </ul>
                )}
                {filtered.length > 4 && (
                  <MobileMoreButton open={more.open} onToggle={() => more.setOpen((v) => !v)} more={`Show all ${filtered.length} federations`} />
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-t border-black/[0.06]"
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
              Becoming a Member Federation
            </h2>
            <p
              className="mt-4 max-w-[680px] text-base"
              style={{ color: "#414042" }}
            >
              National bodies seeking recognition follow a staged review process
              covering governance, athlete safeguarding and competition standards.
            </p>

            <ol className="mt-10 grid grid-cols-1 gap-5 max-sm:mt-6 max-sm:grid-cols-2 max-sm:gap-3 md:grid-cols-4">
              {[
                { t: "Apply", d: "Submit federation details and documentation." },
                { t: "Review", d: "IYSF reviews eligibility and standards compliance." },
                { t: "Provisional status", d: "Approved federations begin as Provisional members." },
                { t: "Ratification", d: "Full membership granted after a review period." },
              ].map((s, i) => (
                <li
                  key={s.t}
                  className="rounded-lg border border-black/[0.08] bg-white p-5"
                >
                  <div
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-mono)", color: "#4298D3" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="mt-2 text-[17px]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#414042",
                    }}
                  >
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "#414042" }}>
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <Link
                to="/join-us"
                className="inline-block rounded-md px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
                style={{ background: "#FAAF40", color: "#3A2400" }}
              >
                Start your application
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[fadein_\\.2s_ease\\] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function FederationCard({
  federation: f,
  onSelect,
  highlighted,
  onClose,
}: {
  federation: Federation;
  onSelect?: () => void;
  highlighted?: boolean;
  onClose?: () => void;
}) {
  const color = STATUS_COLOR[f.status];
  return (
    <article
      className="rounded-lg border bg-white p-4 transition-shadow"
      style={{
        borderColor: highlighted ? color : "rgba(0,0,0,0.08)",
        boxShadow: highlighted ? `0 0 0 2px ${color}22` : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-black/[0.08]"
          style={{ background: "#FAFAFA" }}
          role="img"
          aria-label={`Placeholder flag or crest for ${f.name}`}
        >
          <Users size={16} color="#414042" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {onSelect ? (
                <button
                  onClick={onSelect}
                  className="text-left text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#414042",
                  }}
                >
                  {f.name}
                </button>
              ) : (
                <Link
                  to="/directory/$slug"
                  params={{ slug: f.slug }}
                  className="text-[15px] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#414042",
                  }}
                >
                  {f.name}
                </Link>
              )}
              <div className="mt-1 text-sm" style={{ color: "#414042" }}>
                {f.country} · {f.region}
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close federation details"
                className="rounded-md p-1 text-[#414042] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusBadge status={f.status} />
            <span className="text-xs" style={{ color: "#414042" }}>
              President: {f.president}
            </span>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "#414042" }}
            >
              Joined {f.joined}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              to="/directory/$slug"
              params={{ slug: f.slug }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4298D3] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
            >
              View profile
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            {f.website ? (
              <a
                href={f.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${f.name} website, opens in new tab`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4298D3] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Visit website
              </a>
            ) : (
              <span className="text-xs" style={{ color: "#414042" }}>
                Website pending
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: MembershipStatus }) {
  const color = STATUS_COLOR[status];
  const darkText = color === "#FAAF40";
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: color, color: darkText ? "#3A2400" : "#fff" }}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-lg border border-dashed border-black/15 bg-white p-8 text-center"
      role="status"
    >
      <p
        className="text-[15px]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
      >
        No federations match your search
      </p>
      <p className="mt-2 text-sm" style={{ color: "#414042" }}>
        Try a different keyword or select a different region.
      </p>
    </div>
  );
}
