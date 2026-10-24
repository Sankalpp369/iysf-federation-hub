import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseContent, safeImageSrc } from "@/lib/blocks";
import { BlockRenderer } from "../components/block-renderer";
import { useServerFn } from "@tanstack/react-start";
import { submitEventRegistration } from "@/lib/submissions.functions";
import { Nav, Footer, Breadcrumb } from "../components/site-chrome";
import {
  getEvent,
  getFederationById,
  federationsInEvent,
  relatedEvents,
  TIER_COLOR,
  type Division,
} from "../data/iysf";

export const Route = createFileRoute("/events/$slug")({
  head: ({ params }) => {
    const event = getEvent(params.slug);
    const name = event?.name ?? "Event not found";
    return {
      meta: [
        { title: `${name} — IYSF Events` },
        {
          name: "description",
          content: event
            ? (event.summary ?? `${event.name} · ${event.date} · ${event.location}`)
            : "The requested event could not be found in the IYSF calendar.",
        },
        { property: "og:title", content: `${name} — IYSF Events` },
        {
          property: "og:description",
          content: event
            ? (event.summary ?? `${event.name} · ${event.date} · ${event.location}`)
            : "The requested event could not be found in the IYSF calendar.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventDetailPage,
});

function EventDetailPage() {
  const { slug } = Route.useParams();
  const event = getEvent(slug);
  const managed = useQuery({ queryKey: ["public-cms-event", slug], enabled: !event, queryFn: async () => {
    const { data, error } = await (supabase as any).from("cms_events").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error; return data;
  } });

  if (!event) {
    if (managed.isLoading) return <div className="p-10 text-center">Loading event…</div>;
    if (managed.data) return <div className="min-h-screen bg-white" style={{ color: "#414042" }}><Nav /><main className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16"><Link to="/events" className="font-bold" style={{ color: "#4298D3" }}>← All events</Link>{safeImageSrc(managed.data.cover_image_url ?? "") && <img src={safeImageSrc(managed.data.cover_image_url ?? "")!} alt={managed.data.cover_alt ?? ""} width={1200} height={525} loading="lazy" decoding="async" className="mt-6 aspect-[16/7] w-full rounded-xl object-cover" /> }<p className="mt-6 text-sm font-bold" style={{ color: "#DE007A" }}>{new Date(managed.data.starts_at).toLocaleString()}{managed.data.ends_at ? ` – ${new Date(managed.data.ends_at).toLocaleString()}` : ""}</p><h1 className="mt-2 text-3xl font-extrabold md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{managed.data.title}</h1><p className="mt-3">{managed.data.location}</p><div className="mt-8"><BlockRenderer blocks={parseContent(managed.data.description)} /></div>{managed.data.registration_url && <a href={managed.data.registration_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-lg px-5 py-3 font-bold text-white" style={{ background: "#4298D3" }}>Register</a>}</main><Footer /></div>;
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: "#414042" }}>
        <Nav />
        <main>
          <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8">
            <h1
              className="text-[28px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
            >
              Event not found
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#414042" }}>
              We couldn't find that event in the championship calendar.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-block text-sm font-semibold hover:underline"
              style={{ color: "#4298D3" }}
            >
              ← Back to events
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const color = TIER_COLOR[event.tier];
  const darkOnColor = color === "#FAAF40";
  const hostFederation = getFederationById(event.hostFederationId);
  const federations = federationsInEvent(event);
  const related = relatedEvents(event);
  const resultDivision = event.divisions.find((d) => event.results?.[d]) as
    | Division
    | undefined;
  const topThree = resultDivision ? event.results?.[resultDivision]?.slice(0, 3) : undefined;

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "#414042" }}>
      <Nav />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 pt-10 pb-8 md:px-8 md:pt-14">
            <Breadcrumb
              parentLabel="Events"
              parentTo="/events"
              current={event.name}
              color={color}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                style={{ background: color, color: darkOnColor ? "#3A2400" : "#fff" }}
              >
                {event.tier}
              </span>
              <span
                className="text-[13px]"
                style={{ fontFamily: "var(--font-mono)", color: "#414042" }}
              >
                {event.date}
              </span>
            </div>
            <h1
              className="mt-3 text-[32px] leading-[1.05] tracking-[-0.02em] md:text-[48px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "#414042",
              }}
            >
              {event.name}
            </h1>
            <div className="mt-3 text-sm" style={{ color: "#414042" }}>
              {[event.venue, event.location, event.region].filter(Boolean).join(" · ")}
            </div>
            <p className="mt-6 max-w-[680px] text-base" style={{ color: "#414042" }}>
              {event.summary}
            </p>

            <div className="mt-6">
              <Link
                to="/rules"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#4298D3" }}
              >
                Rules &amp; competition format →
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
            <div className="grid grid-cols-1 gap-10">
              <div>
                <div
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#4298D3" }}
                >
                  Divisions
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.divisions.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium"
                      style={{ borderColor: "rgba(0,0,0,0.12)", color: "#414042" }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>


              {event.schedule?.length ? (
                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#DE007A" }}>
                    Schedule
                  </div>
                  <ul className="divide-y divide-black/[0.08] rounded-lg border border-black/[0.08]">
                    {event.schedule.map((s, i) => (
                      <li key={i} className="px-4 py-3">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#414042" }}>{s.day}</div>
                        <div className="mt-1 text-[15px]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}>{s.label}</div>
                        <div className="mt-1 text-sm" style={{ color: "#414042" }}>{s.detail}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>

{(hostFederation || federations.length > 0) && (
        <section className="border-t border-black/[0.06]" style={{ background: "#FAFAFA" }}>
          <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
            {hostFederation && (
              <div className="mb-8">
                <div
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#414042" }}
                >
                  Host federation
                </div>
                <Link
                  to="/directory/$slug"
                  params={{ slug: hostFederation.slug }}
                  className="block max-w-[420px] rounded-lg border border-black/[0.08] bg-white px-5 py-4 transition-shadow hover:shadow-md"
                >
                  <div
                    className="text-[16px]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#414042",
                    }}
                  >
                    {hostFederation.name}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "#414042" }}>
                    {hostFederation.country}
                  </div>
                </Link>
              </div>
            )}

            <div>
              <div
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#414042" }}
              >
                Federations represented
              </div>
              <div className="flex flex-wrap gap-2">
                {federations.map((f) => (
                  <Link
                    key={f.id}
                    to="/directory/$slug"
                    params={{ slug: f.slug }}
                    className="rounded-full border border-black/[0.12] bg-white px-3 py-1.5 text-xs font-medium hover:border-[#4298D3] hover:text-[#4298D3]"
                  >
                    {f.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {event.status === "upcoming" ? (
          <RegistrationSection event={event} />
        ) : (
          event.results && (
            <section className="border-t border-black/[0.06] bg-white">
              <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
                <div
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#DE007A" }}
                >
                  Results
                </div>
                <h2
                  className="text-[24px] md:text-[30px]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "#414042",
                  }}
                >
                  {resultDivision} division — top 3
                </h2>
                {topThree && (
                  <ol className="mt-6 max-w-[520px] divide-y divide-black/[0.08] rounded-lg border border-black/[0.08]">
                    {topThree.map((row) => (
                      <li
                        key={row.rank}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span
                          className="font-semibold"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          #{row.rank}
                        </span>
                        <span style={{ color: "#414042" }}>{row.athlete}</span>
                        <span style={{ fontFamily: "var(--font-mono)", color: "#414042" }}>
                          {row.score}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    to="/results"
                    className="text-sm font-semibold hover:underline"
                    style={{ color: "#4298D3" }}
                  >
                    All championship results →
                  </Link>
                </div>
              </div>
            </section>
          )
        )}

        {related.length > 0 && (
          <section className="border-t border-black/[0.06]" style={{ background: "#FAFAFA" }}>
            <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
              <div
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#414042" }}
              >
                Related events
              </div>
              <h2
                className="text-[24px] md:text-[30px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "#414042",
                }}
              >
                You may also be interested in
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to="/events/$slug"
                    params={{ slug: r.slug }}
                    className="block rounded-lg border border-black/[0.08] bg-white px-5 py-4 transition-shadow hover:shadow-md"
                  >
                    <div
                      className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: TIER_COLOR[r.tier] }}
                    >
                      {r.tier}
                    </div>
                    <div
                      className="mt-2 text-[15px]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#414042",
                      }}
                    >
                      {r.name}
                    </div>
                    <div className="mt-1 text-sm" style={{ color: "#414042" }}>
                      {r.location}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function RegistrationSection({ event }: { event: NonNullable<ReturnType<typeof getEvent>> }) {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitRegistration = useServerFn(submitEventRegistration);
  const [form, setForm] = useState({
    name: "",
    email: "",
    federation: "",
    division: event.divisions[0] ?? "",
  });

  return (
    <section className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
        <div
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#4298D3" }}
        >
          Register
        </div>
        <h2
          className="text-[24px] md:text-[30px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
        >
          Register for this event
        </h2>

        <div aria-live="polite" className="mt-6 max-w-[480px]">
          {submitted ? (
            <div className="rounded-lg border border-black/[0.08] px-5 py-8 text-center">
              <div
                className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "#FAAF40", color: "#3A2400" }}
                aria-hidden="true"
              >
                ✓
              </div>
              <p
                className="text-[16px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
              >
                Thanks — we'll be in touch with next steps.
              </p>
              <p className="mt-2 text-sm" style={{ color: "#414042" }}>
                A confirmation has been queued to your federation contact.
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setSubmitError("");
                try {
                  await submitRegistration({ data: { event_slug: event.slug, event_name: `${event.name} — ${form.division}`, full_name: form.name, email: form.email, federation: form.federation } });
                  setSubmitted(true);
                } catch {
                  setSubmitError("We couldn't save your registration. Please try again.");
                } finally {
                  setSaving(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="ef-name"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#414042" }}
                >
                  Full name
                </label>
                <input
                  id="ef-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
                />
              </div>
              <div>
                <label
                  htmlFor="ef-email"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#414042" }}
                >
                  Email
                </label>
                <input
                  id="ef-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
                />
              </div>
              <div>
                <label
                  htmlFor="ef-fed"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#414042" }}
                >
                  Federation
                </label>
                <input
                  id="ef-fed"
                  required
                  placeholder="e.g. national member federation"
                  value={form.federation}
                  onChange={(e) => setForm({ ...form, federation: e.target.value })}
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
                />
              </div>
              <div>
                <label
                  htmlFor="ef-div"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "#414042" }}
                >
                  Division
                </label>
                <select
                  id="ef-div"
                  value={form.division}
                  onChange={(e) =>
                    setForm({ ...form, division: e.target.value as Division })
                  }
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"
                >
                  {event.divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
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
    </section>
  );
}
