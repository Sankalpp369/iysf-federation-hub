import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Search, X } from "lucide-react";
import events from "../data/events.json";
import { countryThemes, countryThemeList } from "../data/country-themes";

type ArchiveEvent = (typeof events)[number];
type View = "grid" | "timeline";
type Temporal = "upcoming" | "past" | "all";
type Sort = "newest" | "oldest" | "country";

function readUrlState() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "",
    countries: p.get("country")?.split(",").filter(Boolean) ?? [],
    year: p.get("year") ?? "all",
    type: p.get("type") ?? "all",
    registration: p.get("registration") ?? "all",
    temporal: (p.get("when") as Temporal) || "all",
    sort: (p.get("sort") as Sort) || "newest",
    view: (p.get("view") as View) || "grid",
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function eventRange(event: ArchiveEvent) {
  return event.endDate ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}` : formatDate(event.startDate);
}

function downloadCalendar(event: ArchiveEvent) {
  const day = (s: string) => s.replaceAll("-", "");
  const escape = (s: string) => s.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
  const end = new Date(`${event.endDate || event.startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//IYSF//Events Archive//EN", "BEGIN:VEVENT",
    `UID:iysf-archive-${event.id}@iysf.org`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${day(event.startDate)}`, `DTEND;VALUE=DATE:${day(end.toISOString().slice(0, 10))}`,
    `SUMMARY:${escape(event.name)}`, `DESCRIPTION:${escape(event.description || `${event.type} · ${event.registrationStatus}`)}`,
    `LOCATION:${escape(event.location || countryThemes[event.countryCode].name)}`,
    ...(event.link ? [`URL:${event.link}`] : []), "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `iysf-event-${event.id}.ics`; a.click();
  URL.revokeObjectURL(url);
}

export function EventsArchive() {
  const initial = useMemo(readUrlState, []);
  const [query, setQuery] = useState(initial.q ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(initial.q ?? "");
  const [countries, setCountries] = useState<string[]>(initial.countries ?? []);
  const [year, setYear] = useState(initial.year ?? "all");
  const [type, setType] = useState(initial.type ?? "all");
  const [registration, setRegistration] = useState(initial.registration ?? "all");
  const [temporal, setTemporal] = useState<Temporal>(initial.temporal ?? "all");
  const [sort, setSort] = useState<Sort>(initial.sort ?? "newest");
  const [view, setView] = useState<View>(initial.view ?? "grid");
  const [selected, setSelected] = useState<ArchiveEvent | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Keep a shareable URL in sync with controls; popstate restores state for browser navigation.
  useEffect(() => {
    const updateUrl = () => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (countries.length) p.set("country", countries.join(","));
      if (year !== "all") p.set("year", year);
      if (type !== "all") p.set("type", type);
      if (registration !== "all") p.set("registration", registration);
      if (temporal !== "all") p.set("when", temporal);
      if (sort !== "newest") p.set("sort", sort);
      if (view !== "grid") p.set("view", view);
      const search = p.toString();
      const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", next);
    };
    updateUrl();
    const onPopState = () => {
      const s = readUrlState();
      setQuery(s.q ?? ""); setCountries(s.countries ?? []); setYear(s.year ?? "all");
      setType(s.type ?? "all"); setRegistration(s.registration ?? "all");
      setTemporal(s.temporal ?? "all"); setSort(s.sort ?? "newest"); setView(s.view ?? "grid");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [query, countries, year, type, registration, temporal, sort, view]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (selected && !el.open) el.showModal();
    if (!selected && el.open) el.close();
  }, [selected]);

  const years = useMemo(() => [...new Set(events.map((event) => event.year))].sort((a, b) => b - a), []);
  const filtered = useMemo(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const list = events.filter((event) => {
      const theme = countryThemes[event.countryCode];
      const matchesSearch = !debouncedQuery || `${event.name} ${theme.name} ${event.countryCode}`.toLowerCase().includes(debouncedQuery);
      const matchesCountry = !countries.length || countries.includes(event.countryCode);
      const matchesYear = year === "all" || String(event.year) === year;
      const matchesType = type === "all" || event.type === type;
      const matchesStatus = registration === "all" || event.registrationStatus === registration;
      const eventEnd = event.endDate || event.startDate;
      const matchesTime = temporal === "all" || (temporal === "upcoming" ? eventEnd >= today : eventEnd < today);
      return matchesSearch && matchesCountry && matchesYear && matchesType && matchesStatus && matchesTime;
    });
    return list.sort((a, b) => sort === "oldest" ? a.startDate.localeCompare(b.startDate) || a.id - b.id : sort === "country" ? countryThemes[a.countryCode].name.localeCompare(countryThemes[b.countryCode].name) || b.startDate.localeCompare(a.startDate) : b.startDate.localeCompare(a.startDate) || b.id - a.id);
  }, [debouncedQuery, countries, year, type, registration, temporal, sort]);

  const countriesWithCounts = useMemo(() => countryThemeList.map((country) => ({ ...country, count: filtered.filter((event) => event.countryCode === country.code).length })).filter((country) => country.count), [filtered]);
  const yearsWithCounts = useMemo(() => years.map((y) => ({ year: y, count: filtered.filter((event) => event.year === y).length })).filter((item) => item.count), [filtered, years]);
  const grouped = useMemo(() => yearsWithCounts.map(({ year: y }) => ({ year: y, events: filtered.filter((event) => event.year === y) })), [filtered, yearsWithCounts]);
  const clear = () => { setQuery(""); setCountries([]); setYear("all"); setType("all"); setRegistration("all"); setTemporal("all"); setSort("newest"); setView("grid"); };
  const toggleCountry = (code: string) => setCountries((value) => value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);

  const card = (event: ArchiveEvent) => {
    const theme = countryThemes[event.countryCode];
    return <li key={event.id} className="min-w-0">
      <button type="button" onClick={() => setSelected(event)} className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-black/[0.08] bg-white text-left shadow-sm transition-[transform,box-shadow,border-color] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]" style={{ borderTop: `4px solid ${theme.accent}` }}>
        <span className="flex w-full flex-col p-4">
          <span className="flex items-start justify-between gap-2">
            <span className="font-mono text-[12px] font-semibold text-[#414042]">{formatDate(event.startDate).split(" ").slice(0, 2).join(" ")} {event.year}{event.endDate ? ` – ${formatDate(event.endDate).split(" ").slice(0, 2).join(" ")}` : ""}</span>
            <span className="text-[20px] leading-none" role="img" aria-label={theme.name}>{theme.flag}</span>
          </span>
          <span className="mt-3 block min-h-[3.2rem] font-display text-[16px] font-bold leading-tight text-[#414042]">{event.name}</span>
          <span className="mt-2 text-xs text-[#555]">{theme.name}</span>
          <span className="mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#4298D3]/10 px-2.5 py-1 text-[10px] font-semibold text-[#286B9A]">{event.type}</span>
            <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-semibold text-[#414042]">{event.registrationStatus}</span>
          </span>
        </span>
      </button>
    </li>;
  };

  return <section className="border-t border-black/[0.06] bg-[#FAFAFA]" aria-labelledby="events-archive-title">
    <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4298D3]">IYSF archive</p><h2 id="events-archive-title" className="font-display text-[28px] font-extrabold leading-tight text-[#414042] md:text-[38px]">All 80 events</h2><p className="mt-2 max-w-xl text-sm text-[#414042]">Explore national championships, training, and international events.</p></div>
        <div className="flex gap-2" role="group" aria-label="Event display mode">
          {(["grid", "timeline"] as const).map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)} className="min-h-10 rounded-md border px-3 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]" style={{ borderColor: view === item ? "#4298D3" : "rgba(0,0,0,.12)", background: view === item ? "#4298D3" : "white", color: view === item ? "white" : "#414042" }}>{item}</button>)}
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-black/[0.08] bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative sm:col-span-2"><span className="sr-only">Search by event or country</span><Search aria-hidden="true" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#414042]"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search event or country" className="min-h-11 w-full rounded-md border border-black/10 px-9 text-sm text-[#414042] outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/25"/></label>
        <label className="text-xs font-semibold text-[#414042]">Year<select aria-label="Filter by year" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-normal"><option value="all">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
        <label className="text-xs font-semibold text-[#414042]">Event type<select aria-label="Filter by event type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-normal"><option value="all">All types</option>{[...new Set(events.map((e) => e.type))].map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-xs font-semibold text-[#414042]">Registration status<select aria-label="Filter by registration status" value={registration} onChange={(e) => setRegistration(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-normal"><option value="all">All statuses</option>{[...new Set(events.map((e) => e.registrationStatus))].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-xs font-semibold text-[#414042]">Sort by<select aria-label="Sort events" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-1 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-normal"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="country">Country A–Z</option></select></label>
        <label className="text-xs font-semibold text-[#414042]">Date status<select aria-label="Filter upcoming or past events" value={temporal} onChange={(e) => setTemporal(e.target.value as Temporal)} className="mt-1 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-normal"><option value="all">All events</option><option value="upcoming">Upcoming</option><option value="past">Past</option></select></label>
        <details className="relative text-xs font-semibold text-[#414042]"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md border border-black/10 bg-white px-3">Countries{countries.length ? ` (${countries.length})` : " (all)"}<span aria-hidden="true">⌄</span></summary><div className="absolute right-0 z-20 mt-1 max-h-64 w-64 overflow-auto rounded-lg border border-black/10 bg-white p-2 shadow-xl">{countryThemeList.map((c) => <label key={c.code} className="flex min-h-10 cursor-pointer items-center gap-2 rounded px-2 hover:bg-[#f4f9fc]"><input type="checkbox" checked={countries.includes(c.code)} onChange={() => toggleCountry(c.code)}/><span role="img" aria-label={c.name}>{c.flag}</span><span className="font-normal">{c.name}</span></label>)}</div></details>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Quick country filters">
        <span className="mr-1 text-xs font-semibold text-[#414042]">Countries</span>
        {countriesWithCounts.map((c) => <button key={c.code} type="button" aria-pressed={countries.includes(c.code)} onClick={() => toggleCountry(c.code)} className="min-h-9 rounded-full border px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]" style={{ borderColor: countries.includes(c.code) ? c.accent : "rgba(0,0,0,.12)", color: "#414042", background: countries.includes(c.code) ? `${c.accent}12` : "white" }}><span role="img" aria-label={c.name}>{c.flag}</span> {c.name} <span className="text-[#666]">{c.count}</span></button>)}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-md border border-black/[0.07] bg-white px-4 py-3"><div className="font-mono text-xl font-bold text-[#414042]">{filtered.length}</div><div className="text-xs text-[#555]">events shown</div></div>
        <div className="rounded-md border border-black/[0.07] bg-white px-4 py-3"><div className="font-mono text-xl font-bold text-[#414042]">{new Set(filtered.map((e) => e.countryCode)).size}</div><div className="text-xs text-[#555]">countries / regions</div></div>
        <div className="rounded-md border border-black/[0.07] bg-white px-4 py-3"><div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs font-bold text-[#414042]">{yearsWithCounts.map(({ year: y, count }) => <span key={y}>{y} · {count}</span>)}{!yearsWithCounts.length && "—"}</div><div className="mt-1 text-xs text-[#555]">events per year</div></div>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? <div className="rounded-lg border border-dashed border-black/15 bg-white px-6 py-12 text-center"><p className="font-display text-lg font-bold text-[#414042]">No events match these filters</p><p className="mt-1 text-sm text-[#555]">Try broadening your search or clear the filters.</p><button type="button" onClick={clear} className="mt-4 min-h-11 rounded-md bg-[#4298D3] px-5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#414042]">Clear filters</button></div> : view === "grid" ? <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(card)}</ul> : <div className="space-y-8">{grouped.map((group) => <section key={group.year} aria-labelledby={`archive-year-${group.year}`}><h3 id={`archive-year-${group.year}`} className="sticky top-[108px] z-10 -mx-2 mb-3 border-b border-black/[0.08] bg-[#FAFAFA]/95 px-2 py-2 font-display text-xl font-extrabold text-[#414042] backdrop-blur">{group.year}<span className="ml-2 font-sans text-sm font-normal">{group.events.length} events</span></h3><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{group.events.map(card)}</ul></section>)}</div>}
      </div>
    </div>

    <dialog ref={dialog} aria-labelledby="archive-event-title" className="m-auto max-h-[min(85dvh,720px)] w-[calc(100%-2rem)] max-w-[560px] overflow-auto rounded-xl border-0 bg-white p-0 text-[#414042] shadow-2xl backdrop:bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }} onCancel={(e) => { e.preventDefault(); setSelected(null); }} onClose={() => setSelected(null)}>
      {selected && (() => { const theme = countryThemes[selected.countryCode]; return <div><div className="h-1.5" style={{ background: `linear-gradient(90deg, ${theme.accent} 0 50%, ${theme.accent2 || theme.accent} 50%)` }}/><div className="p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold" style={{ color: theme.accent }}><span role="img" aria-label={theme.name}>{theme.flag}</span> {theme.name}</p><h2 id="archive-event-title" className="mt-2 font-display text-2xl font-extrabold leading-tight">{selected.name}</h2></div><button type="button" onClick={() => setSelected(null)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]" aria-label="Close event details"><X size={20}/></button></div><p className="mt-4 font-mono text-sm">{eventRange(selected)}</p>{selected.approx && <p className="mt-3 rounded-md bg-[#FAAF40]/20 px-3 py-2 text-sm font-semibold text-[#414042]">Approximate date — date to be confirmed.</p>}<div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-[#4298D3]/10 px-3 py-1.5 text-xs font-semibold text-[#286B9A]">{selected.type}</span><span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-xs font-semibold">{selected.registrationStatus}</span></div>{selected.description && <p className="mt-4 text-sm leading-relaxed">{selected.description}</p>}{selected.location && <p className="mt-3 text-sm">{selected.location}</p>}<div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => downloadCalendar(selected)} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#4298D3] px-4 text-sm font-bold text-white hover:bg-[#337FB7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#414042]"><CalendarDays size={16}/>Add to calendar</button>{selected.link && <a href={selected.link} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-md border border-black/15 px-4 text-sm font-bold text-[#414042] hover:bg-black/[0.04]">Event link</a>}</div></div></div>; })()}
    </dialog>
  </section>;
}
