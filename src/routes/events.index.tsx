import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Nav, Footer } from "../components/site-chrome";
import { useServerFn } from "@tanstack/react-start";
import { submitEventRegistration } from "@/lib/submissions.functions";
import {
  upcomingEvents,
  pastEvents,
  TIER_COLOR,
  REGIONS,
  type Region,
  type Tier,
  type EventRecord,
} from "../data/iysf";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Championship Calendar — IYSF Events" },
      {
        name: "description",
        content:
          "Find and register for upcoming IYSF-sanctioned Yogasana events worldwide.",
      },
      { property: "og:title", content: "Championship Calendar — IYSF Events" },
      {
        property: "og:description",
        content:
          "Browse the full IYSF calendar of continental qualifiers, world championships, and academy camps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsPage,
});

type EventItem = EventRecord;

const UPCOMING: EventItem[] = upcomingEvents();
const ARCHIVE: EventItem[] = pastEvents();

const EventsMap = lazy(() => import("../components/events-map"));

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

function EventsPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [registerFor, setRegisterFor] = useState<EventItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UPCOMING.filter((e) => {
      const matchesQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      const matchesR = region === "All" || e.region === region;
      return matchesQ && matchesR;
    });
  }, [query, region]);

  useEffect(() => {
    if (selectedId && !filtered.some((e) => e.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((e) => e.id === selectedId) ?? null;
  const hydrated = useHydrated();

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
              Calendar
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
              Championship calendar
            </h1>
            <p
              className="mt-4 max-w-[600px] text-base md:text-[17px]"
              style={{ color: "#414042" }}
            >
              Find and register for upcoming IYSF-sanctioned events worldwide.
            </p>
          </div>
        </section>

        <div
          className="sticky top-[61px] z-30 border-y border-black/[0.06] bg-white/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:px-8">
            <label className="relative block flex-1">
              <span className="sr-only">Search events</span>
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
                placeholder="Search by event or location"
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
          <div className="mx-auto max-w-[1240px] px-5 pt-10 md:px-8 md:pt-12">
            <Link
              to="/events/world-championship-2026"
              className="block rounded-[14px] border p-6 transition-transform hover:-translate-y-0.5 md:p-8"
              style={{
                borderColor: "rgba(66,152,211,0.28)",
                background: "rgba(66,152,211,0.06)",
                boxShadow: "0 14px 34px -18px rgba(66,152,211,0.55)",
              }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-white"
                style={{ background: "#DE007A" }}
              >
                Featured — next championship
              </div>
              <h2
                className="mt-4 text-[26px] leading-[1.08] md:text-[36px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "#414042",
                  letterSpacing: "-0.02em",
                }}
              >
                17th World Championship of Yogasana Sports
              </h2>
              <p className="mt-3 text-[15px] font-semibold" style={{ color: "#4298D3" }}>
                Marina di Camerota, Italy · December 4–6, 2026 · Registration now open
              </p>
              <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
                Three days of competition on Italy's Cilento coast, with 150+ athletes from 30+
                countries across individual, pair, and group categories.
              </p>
              <span
                className="mt-5 inline-flex items-center rounded-[12px] px-5 py-3 text-[14px] font-bold"
                style={{ background: "#FAAF40", color: "#414042" }}
              >
                View championship details
              </span>
            </Link>
          </div>
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
                      <EventsMap
                        events={filtered}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        tierColor={TIER_COLOR}
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

                <div
                  aria-live="polite"
                  className="mt-4 motion-safe:transition-all motion-safe:duration-200"
                >
                  {selected && (
                    <div className="motion-safe:animate-[fadein_.2s_ease]">
                      <EventCard
                        event={selected}
                        onRegister={() => setRegisterFor(selected)}
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
                  Upcoming
                </div>
                {filtered.length === 0 ? (
                  <EmptyState />
                ) : (
                  <ul className="flex max-h-[520px] flex-col gap-3 overflow-auto pr-1 max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
                    {filtered.map((e) => (
                      <li key={e.id}>
                        <EventCard
                          event={e}
                          onRegister={() => setRegisterFor(e)}
                          onSelect={() => setSelectedId(e.id)}
                          highlighted={e.id === selectedId}
                        />
                      </li>
                    ))}
                  </ul>
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
              Archive
            </div>
            <h2
              className="text-[26px] leading-[1.08] tracking-[-0.015em] md:text-[36px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              Past events
            </h2>

            <ul className="mt-8 divide-y divide-black/[0.08] rounded-lg border border-black/[0.08] bg-white">
              {ARCHIVE.map((e) => (
                <li
                  key={e.id}
                  className="grid grid-cols-1 gap-2 px-4 py-4 md:grid-cols-[160px_1fr_1fr_auto] md:items-center md:gap-6 md:px-5"
                >
                  <div
                    className="text-[13px]"
                    style={{ fontFamily: "var(--font-mono)", color: "#414042" }}
                  >
                    {e.date}
                  </div>
                  <div>
                    <Link
                      to="/events/$slug"
                      params={{ slug: e.slug }}
                      className="text-[15px] hover:underline"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#414042",
                      }}
                    >
                      {e.name}
                    </Link>
                  </div>
                  <div className="text-sm" style={{ color: "#414042" }}>
                    {e.location}
                  </div>
                  <div className="flex items-center gap-3">
                    <TierBadge tier={e.tier} muted />
                    <Link
                      to="/events/$slug"
                      params={{ slug: e.slug }}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: "#4298D3" }}
                    >
                      View event →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />

      {registerFor && (
        <RegisterModal
          event={registerFor}
          onClose={() => setRegisterFor(null)}
        />
      )}

      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[fadein_\\.2s_ease\\] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function EventCard({
  event,
  onRegister,
  onSelect,
  highlighted,
  onClose,
}: {
  event: EventItem;
  onRegister: () => void;
  onSelect?: () => void;
  highlighted?: boolean;
  onClose?: () => void;
}) {
  const color = TIER_COLOR[event.tier];
  const darkOnColor = color === "#FAAF40";
  return (
    <article
      className="overflow-hidden rounded-lg border bg-white transition-shadow"
      style={{
        borderColor: highlighted ? color : "rgba(0,0,0,0.08)",
        boxShadow: highlighted ? `0 0 0 2px ${color}22` : undefined,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: color, color: darkOnColor ? "#3A2400" : "#fff" }}
      >
        <div>
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.2em] opacity-85"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {event.tier}
          </div>
          <div
            className="mt-1 text-[20px] leading-none"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
          >
            {event.date}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close event details"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="px-4 py-4">
        {onSelect ? (
          <button
            onClick={onSelect}
            className="text-left text-[17px] leading-tight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#414042",
            }}
          >
            {event.name}
          </button>
        ) : (
          <h3
            className="text-[17px] leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#414042",
            }}
          >
            {event.name}
          </h3>
        )}
        <div
          className="mt-2 flex items-center gap-1.5 text-sm"
          style={{ color: "#414042" }}
        >
          <MapPin size={14} aria-hidden="true" /> {event.location}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onRegister}
            className="rounded-md px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
            style={{ background: "#FAAF40", color: "#3A2400" }}
          >
            Register
          </button>
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="text-sm font-semibold hover:underline"
            style={{ color: "#4298D3" }}
          >
            View event →
          </Link>
        </div>
      </div>
    </article>
  );
}

function TierBadge({ tier, muted }: { tier: Tier; muted?: boolean }) {
  const color = TIER_COLOR[tier];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em]"
      style={{
        background: muted ? `${color}18` : color,
        color: muted ? color : color === "#FAAF40" ? "#3A2400" : "#fff",
      }}
    >
      {tier}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-lg border border-dashed border-black/15 px-6 py-10 text-center text-sm"
      style={{ color: "#414042" }}
    >
      No events match your search. Try clearing the filter or switching region.
    </div>
  );
}

function RegisterModal({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitRegistration = useServerFn(submitEventRegistration);
  const [form, setForm] = useState({ name: "", email: "", federation: "" });
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 motion-safe:animate-[fadein_.2s_ease] md:items-center md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[480px] overflow-hidden rounded-t-2xl bg-white shadow-xl md:rounded-2xl"
      >
        <div className="flex items-start justify-between border-b border-black/[0.06] px-5 py-4">
          <div>
            <div
              className="text-[10.5px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#4298D3" }}
            >
              Register
            </div>
            <h2
              id="register-title"
              className="mt-1 text-[20px] leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              {event.name}
            </h2>
            <div
              className="mt-1 text-[12px]"
              style={{ fontFamily: "var(--font-mono)", color: "#414042" }}
            >
              {event.date} · {event.location}
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#414042] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-8 text-center">
            <div
              className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "#FAAF40", color: "#3A2400" }}
              aria-hidden="true"
            >
              ✓
            </div>
            <p
              className="text-[16px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "#414042",
              }}
            >
              Thanks — we'll be in touch with next steps.
            </p>
            <p className="mt-2 text-sm" style={{ color: "#414042" }}>
              A confirmation has been queued to your federation contact.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setSubmitError("");
              try {
                await submitRegistration({ data: { event_slug: event.slug, event_name: event.name, full_name: form.name, email: form.email, federation: form.federation } });
                setSubmitted(true);
              } catch {
                setSubmitError("We couldn't save your registration. Please try again.");
              } finally {
                setSaving(false);
              }
            }}
            className="space-y-4 px-5 py-5"
          >
            <Field label="Full name" htmlFor="rf-name">
              <input
                ref={firstFieldRef}
                id="rf-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
              />
            </Field>
            <Field label="Email" htmlFor="rf-email">
              <input
                id="rf-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
              />
            </Field>
            <Field label="Federation" htmlFor="rf-fed">
              <input
                id="rf-fed"
                required
                placeholder="e.g. national member federation"
                value={form.federation}
                onChange={(e) => setForm({ ...form, federation: e.target.value })}
                className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
              />
            </Field>
            {submitError && <p role="alert" className="text-sm font-semibold text-[#DE007A]">{submitError}</p>}
            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-md px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]"
              style={{ background: "#FAAF40", color: "#3A2400" }}
            >
              {saving ? "Submitting…" : "Submit registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "#414042" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
