import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FileText, ArrowRight, ArrowDown, MapPin } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitNewsletterSignup } from "@/lib/submissions.functions";
import { Nav, Footer } from "../components/site-chrome";
import type { MapPin as MapPinData } from "../components/events-map";
import { pastEvents, WORLD_CHAMPIONSHIP_2026 } from "@/data/iysf";
import { eventToMapPin } from "@/lib/map-data";
import {
  Reveal,
  CountUp,
  useInView,
  usePrefersReducedMotion,
} from "../components/history-motion";

export const Route = createFileRoute("/about/history")({
  head: () => ({
    meta: [
      { title: "Our History — IYSF International Yoga Sports Federation" },
      {
        name: "description",
        content:
          "From the 1973 Calcutta āsana competitions to world championships across five continents — the history of the International Yoga Sports Federation.",
      },
      { property: "og:title", content: "Our History — IYSF" },
      {
        property: "og:description",
        content:
          "1973 Calcutta, the Ghosh Cup revival, founding in Lausanne, and the road toward Olympic recognition.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const WorldMap = lazy(() => import("../components/events-map"));

function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

const POSES = [
  "M60 12a7 7 0 1 0 0.1 0M60 20v34M60 26 34 40M60 26l26 14M60 54 42 92M60 54l18 38",
  "M52 14a7 7 0 1 0 .1 0M52 22v26M52 28l30-8M52 28 26 40M52 48 30 88M52 48l38 12",
  "M70 10a7 7 0 1 0 .1 0M70 18v30M70 24 40 24M70 24l22 16M70 48 52 92M70 48l14 42",
];

function PoseBackdrop() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % POSES.length), 5200);
    return () => clearInterval(t);
  }, [reduced]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 120 100"
        className="absolute -right-10 top-1/2 h-[120%] -translate-y-1/2 opacity-[0.09] md:right-[6%]"
        preserveAspectRatio="xMidYMid meet"
      >
        {POSES.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke="#414042"
            strokeWidth="1.1"
            strokeLinecap="round"
            style={{
              opacity: reduced ? (idx === 0 ? 1 : 0) : idx === i ? 1 : 0,
              transition: "opacity 2200ms ease-in-out",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function Hero() {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, [reduced]);

  const words = "The International Yoga Sports Federation".split(" ");

  return (
    <section className="relative flex min-h-[88svh] items-center bg-white">
      <PoseBackdrop />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
        <div
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#DE007A" }}
        >
          Our history
        </div>
        <h1
          className="max-w-[16ch] text-[38px] leading-[1.02] tracking-[-0.02em] md:text-[76px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              className="inline-block"
              style={
                reduced
                  ? undefined
                  : {
                      opacity: shown ? 1 : 0,
                      transform: shown ? "none" : "translateY(20px)",
                      transition: `opacity 620ms ease-out ${i * 85}ms, transform 620ms cubic-bezier(.2,.7,.3,1) ${i * 85}ms`,
                    }
              }
            >
              {w}&nbsp;
            </span>
          ))}
        </h1>
        <p
          className="mt-7 max-w-[680px] text-[17px] leading-relaxed md:text-[20px]"
          style={{ color: "#414042" }}
        >
          The global governing body for yoga āsana sport — a discipline that honors the art of
          stillness in motion.
        </p>
        <p className="mt-5 max-w-[620px] text-base leading-relaxed" style={{ color: "#414042" }}>
          We promote excellence in yogasana competition, grounded in integrity, inclusivity, and
          unity across generations. Since 2003, IYSF has been guiding the evolution of yoga as an
          international sport.
        </p>

        <div className="mt-14 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#414042" }}>
          <ArrowDown size={14} className={reduced ? "" : "animate-bounce"} aria-hidden="true" />
          Scroll to explore
        </div>
      </div>
    </section>
  );
}

function Origins() {
  return (
    <section style={{ background: "#F3EFE8" }}>
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#8A6A2F" }}
          >
            Our origins · 1973
          </div>
          <h2
            className="text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            On the shoulders of pioneers
          </h2>
          <p className="mt-6 text-base leading-relaxed md:text-[17px]" style={{ color: "#4A4438" }}>
            IYSF stands on the shoulders of pioneers. The first formal āsana competitions took place
            in 1973 in Calcutta, India, organized by the West Bengal Yoga Federation (WBYF) —
            founded by students of the legendary teacher Bishnu Charan Ghosh. These early events
            laid the foundation for scoring, posture categories, and presentation standards still
            used today.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function GhoshCup() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#4298D3" }}
          >
            The Ghosh Cup revival · 2003–2014
          </div>
          <h2
            className="text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            A legacy revived, internationally
          </h2>
          <p className="mt-6 max-w-[620px] text-base leading-relaxed md:text-[17px]" style={{ color: "#414042" }}>
            In 2003, the legacy of these competitions was revived internationally through the Bishnu
            Charan Ghosh Cup (often called the Ghosh Cup), held annually in Los Angeles. These
            championships ran every year from 2003 to 2014, attracting participants from around the
            world and sparking the global yoga sports movement.
          </p>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed md:text-[17px]" style={{ color: "#414042" }}>
            In 2012, Honorable B.K.S. Iyengar endorsed our organization and Championship.
          </p>
          <a
            href="https://www.iysf.org/wp-content/uploads/2025/06/iyengar-letter.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-md border px-4 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.03]"
            style={{ borderColor: "rgba(20,24,31,0.15)", color: "#414042" }}
          >
            <FileText size={16} color="#4298D3" aria-hidden="true" />
            View the B.K.S. Iyengar endorsement letter (PDF, opens in a new tab)
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Lausanne() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const reduced = usePrefersReducedMotion();
  return (
    <section style={{ background: "#0D1830" }}>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-16 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#FAAF40" }}
          >
            From legacy to leadership · 2013–2014
          </div>
          <h2
            className="text-[30px] leading-[1.08] tracking-[-0.015em] text-white md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            Founded in Lausanne
          </h2>
          <p
            className="mt-6 max-w-[620px] text-base leading-relaxed md:text-[17px]"
            style={{ color: "#C9D5E8" }}
          >
            Recognizing the need for unified rules and international governance, the International
            Yoga Sports Federation (IYSF) was founded in Lausanne, Switzerland in 2013, and
            officially registered in 2014. Since then, IYSF has developed the first global scoring
            system for yoga sport, established a tiered judge-certification program, and created
            international pathways for athletes and coaches alike.
          </p>
        </Reveal>
        <div ref={ref} className="flex justify-center">
          <div className="relative flex h-[190px] w-[190px] items-center justify-center">
            <span
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "rgba(250,175,64,0.35)",
                opacity: inView ? 1 : 0,
                transform: inView || reduced ? "scale(1)" : "scale(0.6)",
                transition: reduced
                  ? undefined
                  : "opacity 700ms ease, transform 900ms cubic-bezier(.2,.7,.3,1)",
              }}
            />
            <span
              className="absolute h-[110px] w-[110px] rounded-full border"
              style={{
                borderColor: "rgba(250,175,64,0.55)",
                opacity: inView ? 1 : 0,
                transform: inView || reduced ? "scale(1)" : "scale(0.6)",
                transition: reduced
                  ? undefined
                  : "opacity 700ms ease 140ms, transform 900ms cubic-bezier(.2,.7,.3,1) 140ms",
              }}
            />
            <div
              className="relative flex flex-col items-center gap-1"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView || reduced ? "none" : "translateY(-14px)",
                transition: reduced
                  ? undefined
                  : "opacity 500ms ease 260ms, transform 600ms cubic-bezier(.2,.9,.3,1) 260ms",
              }}
            >
              <MapPin size={30} color="#FAAF40" aria-hidden="true" />
              <span
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "#FAAF40", fontFamily: "var(--font-mono)" }}
              >
                Lausanne, CH
              </span>
              <span
                className="text-[11px]"
                style={{ color: "#8FA2C0", fontFamily: "var(--font-mono)" }}
              >
                Founded 2013
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const TIMELINE: {
  year: string;
  host: string;
  place: string;
  note: string;
  upcoming?: boolean;
}[] = [
  {
    year: "2003–2013",
    host: "Annual Ghosh Cup",
    place: "USA",
    note: "Held annually in Los Angeles, the championship that sparked the global yoga sports movement.",
  },
  {
    year: "2014",
    host: "London",
    place: "United Kingdom",
    note: "The first World Championship staged under the newly registered IYSF.",
  },
  {
    year: "2016",
    host: "Pordenone",
    place: "Italy",
    note: "Continental participation broadens across Europe.",
  },
  {
    year: "2018",
    host: "Beijing",
    place: "China",
    note: "The championship reaches East Asia.",
  },
  {
    year: "2021",
    host: "Online Edition",
    place: "During COVID-19",
    note: "A fully remote championship kept the global calendar unbroken.",
  },
  {
    year: "2022",
    host: "Bengaluru",
    place: "India",
    note: "A return to the birthplace of the discipline.",
  },
  {
    year: "2025",
    host: "Cyberjaya",
    place: "Malaysia",
    note: "The most recent World Championship edition.",
  },
  {
    year: "2026",
    host: WORLD_CHAMPIONSHIP_2026.location,
    place: WORLD_CHAMPIONSHIP_2026.countryName ?? "",
    note: `${WORLD_CHAMPIONSHIP_2026.edition} Edition · ${WORLD_CHAMPIONSHIP_2026.date}`,
    upcoming: true,
  },
];

const ACCENTS = ["#4298D3", "#FAAF40", "#DE007A"];

function TimelinePoint({
  item,
  index,
  open,
  onToggle,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  const color = ACCENTS[index % ACCENTS.length];
  return (
    <div ref={ref} className="relative md:w-[240px] md:shrink-0">
      <div className="flex items-start gap-4 md:block">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`${item.year}, ${item.host}, ${item.place}`}
          className="group relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:mb-5"
          style={{ outlineColor: color }}
        >
          <span
            className="block h-3.5 w-3.5 rounded-full transition-all duration-500 group-hover:scale-125"
            style={{
              background: inView ? color : "#C7CCD4",
              boxShadow: inView ? `0 0 0 5px ${color}22` : "none",
            }}
          />
        </button>
        <div className="pb-8 md:pb-0">
          <div
            className="text-[13px] font-medium tracking-[0.02em]"
            style={{ fontFamily: "var(--font-mono)", color }}
          >
            {item.year}
          </div>
          <div
            className="mt-1 text-[18px] leading-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
          >
            {item.host}
          </div>
          <div className="mt-0.5 text-sm" style={{ color: "#414042" }}>
            {item.place}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="text-xs font-semibold underline-offset-4 hover:underline"
              style={{ color: "#414042" }}
            >
              {open ? "Hide detail" : "Show detail"}
            </button>
            {item.upcoming && (
              <span className="inline-flex h-4 items-center rounded-full bg-[#FAAF40]/20 px-2 text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-[#75500C]">
                Upcoming
              </span>
            )}
          </div>
          {open && (
            <div
              className="mt-3 max-w-[260px] rounded-md border border-black/10 bg-white p-3 text-xs leading-relaxed"
              style={{ color: "#414042" }}
            >
              {item.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Timeline() {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const reduced = usePrefersReducedMotion();

  return (
    <section style={{ background: "#FAFAFA" }}>
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#DE007A" }}
          >
            Championship history
          </div>
          <h2
            className="max-w-[16ch] text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            Two decades of world championships
          </h2>
          <p className="mt-6 max-w-[720px] text-base leading-relaxed md:text-[17px]" style={{ color: "#414042" }}>
            These championships showcase IYSF's commitment to technical rigor, artistic expression,
            and cultural celebration. Every event is judged using our standardized scoring system
            and features divisions for youth, adult, and masters athletes.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          <svg
            className="pointer-events-none absolute left-0 top-3 hidden h-[2px] w-full md:block"
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="1000" y2="1" stroke="#E1E4E9" strokeWidth="2" />
            <line
              x1="0"
              y1="1"
              x2="1000"
              y2="1"
              stroke="#4298D3"
              strokeWidth="2"
              strokeDasharray="1000"
              style={{
                strokeDashoffset: reduced ? 0 : inView ? 0 : 1000,
                transition: reduced ? undefined : "stroke-dashoffset 2200ms ease-out",
              }}
            />
          </svg>
          <span
            className="absolute left-3 top-0 w-[2px] md:hidden"
            style={{ background: "#E1E4E9", height: "100%" }}
            aria-hidden="true"
          />
          <span
            className="absolute left-3 top-0 w-[2px] md:hidden"
            style={{
              background: "#4298D3",
              height: reduced || inView ? "100%" : "0%",
              transition: reduced ? undefined : "height 2200ms ease-out",
            }}
            aria-hidden="true"
          />

          <ol className="relative flex flex-col gap-0 overflow-x-auto pb-2 md:flex-row md:gap-6">
            {TIMELINE.map((item, i) => (
              <li key={item.year}>
                <TimelinePoint
                  item={item}
                  index={i}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function GlobalMovement() {
  const hydrated = useHydrated();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const historyEvents = useMemo(() => pastEvents().filter((event) => (event.endDateISO ?? event.dateISO) < today), [today]);
  const pins = useMemo(() => historyEvents.map(eventToMapPin).filter((pin): pin is MapPinData => Boolean(pin)), [historyEvents]);
  const onlineCount = historyEvents.length - pins.length;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#4298D3" }}
          >
            A global movement
          </div>
          <h2
            className="max-w-[18ch] text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            Championships across the world
          </h2>
          <p className="mt-6 max-w-[720px] text-base leading-relaxed md:text-[17px]" style={{ color: "#414042" }}>
            Explore past IYSF championship locations and the corresponding event records. Online
            editions remain in the event list even when they have no physical map location.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <div className="rounded-lg border border-black/10">
            <div className="h-[300px] overflow-hidden md:h-[420px]" style={{ background: "#FAFAFA" }}>
            {hydrated ? (
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm" style={{ color: "#414042" }}>
                    Loading map…
                  </div>
                }
              >
                <WorldMap
                  pins={pins}
                  selectedId={selectedId}
                  highlightedId={hoveredId}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  label="Map of past IYSF championships"
                />
              </Suspense>
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
            </div>
            {onlineCount > 0 && <p className="mt-2 text-xs" style={{ color: "#414042" }}>{onlineCount} online or international {onlineCount === 1 ? "event is" : "events are"} not shown on the map.</p>}
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: historyEvents.length, suffix: "", label: "past events" },
                { value: pins.length, suffix: "", label: "map locations" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-black/10 p-5">
                  <div
                    className="text-[38px] leading-none"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
                  >
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div
                    className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "#414042" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <ul className="mt-6 max-h-[300px] divide-y divide-black/[0.08] overflow-auto rounded-lg border border-black/[0.08] bg-white" aria-label="Past IYSF championship events">
              {historyEvents.map((event) => (
                <li key={event.id} onMouseEnter={() => setHoveredId(event.id)} onMouseLeave={() => setHoveredId(null)}>
                  <Link to="/events/$slug" params={{ slug: event.slug }} onClick={() => setSelectedId(event.id)} className="block px-4 py-3 hover:bg-black/[0.03]" style={{ background: selectedId === event.id || hoveredId === event.id ? "rgba(66,152,211,0.10)" : undefined }}>
                    <span className="block text-xs" style={{ color: "#4298D3", fontFamily: "var(--font-mono)" }}>{event.year}</span>
                    <span className="mt-1 block text-sm font-semibold" style={{ color: "#414042", fontFamily: "var(--font-display)" }}>{event.name}</span>
                    <span className="mt-0.5 block text-xs" style={{ color: "#414042" }}>{event.location}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Olympic() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const reduced = usePrefersReducedMotion();
  const pct = (25 / 40) * 100;
  return (
    <section id="olympic" style={{ background: "#16264A" }}>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16 md:px-8 md:py-28">
        <Reveal>
          <div
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#FAAF40" }}
          >
            Toward Olympic recognition
          </div>
          <h2
            className="max-w-[18ch] text-[30px] leading-[1.08] tracking-[-0.015em] text-white md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            An active mission, not a finished one
          </h2>
          <p className="mt-6 max-w-[640px] text-base leading-relaxed md:text-[17px]" style={{ color: "#C9D5E8" }}>
            Our long-term mission is to bring Yogasana Sports to the Olympic stage. We are actively
            working to meet the IOC's criteria, including broad international participation and
            standardized governance. With over 25 and a goal of reaching over 40 active and forming
            federations, a growing youth pipeline, and global championships, IYSF is on the path to
            official recognition.
          </p>
        </Reveal>

        <div ref={ref} className="rounded-lg border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-baseline justify-between">
            <span
              className="text-[13px]"
              style={{ fontFamily: "var(--font-mono)", color: "#FAAF40" }}
            >
              25+ federations today
            </span>
            <span className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "#8FA2C0" }}>
              goal 40+
            </span>
          </div>
          <div
            className="mt-3 h-3 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
            role="progressbar"
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={40}
            aria-label="Progress toward the goal of 40 or more active and forming federations"
          >
            <span
              className="block h-full rounded-full"
              style={{
                background: "linear-gradient(90deg,#FAAF40,#DE007A)",
                width: reduced || inView ? `${pct}%` : "0%",
                transition: reduced ? undefined : "width 1600ms cubic-bezier(.2,.7,.3,1)",
              }}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: "#8FA2C0" }}>
                    Target figure — 40+ active and forming federations is a stated goal.
          </p>
        </div>
      </div>
    </section>
  );
}

function JoinMovement() {
  const cards = [
    { title: "Compete at our next World Championship", to: "/events" as const, hash: undefined, color: "#4298D3" },
    { title: "Start or grow your national federation", to: "/directory" as const, hash: undefined, color: "#FAAF40" },
    { title: "Become a certified judge or coach", to: "/academy" as const, hash: undefined, color: "#DE007A" },
    { title: "Support the journey to Olympic recognition", to: "/join-us" as const, color: "#414042" },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2
            className="max-w-[18ch] text-[30px] leading-[1.08] tracking-[-0.015em] md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
          >
            Join the movement
          </h2>
          <p className="mt-5 max-w-[640px] text-base leading-relaxed md:text-[17px]" style={{ color: "#414042" }}>
            Whether you are an athlete, coach, judge, organizer, or simply passionate about yoga,
            there's a place for you in IYSF:
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <Link
                to={c.to}
                hash={c.hash}
                className="group flex h-full items-start justify-between gap-4 rounded-lg border border-black/10 p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-18px_rgba(20,24,31,0.5)]"
              >
                <span
                  className="text-[18px] leading-snug"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
                >
                  {c.title}
                </span>
                <ArrowRight
                  size={18}
                  color={c.color}
                  className="mt-1 shrink-0 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p
            className="mt-12 max-w-[760px] text-[19px] leading-snug md:text-[26px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#414042" }}
          >
              Together, we're writing the next chapter of yoga's evolution as a sport — honoring
            tradition, embracing excellence, and inspiring the world.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function KeepUpdated() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const subscribe = useServerFn(submitNewsletterSignup);
  return (
    <section style={{ background: "#FAAF40" }}>
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <h2
              className="text-[26px] leading-[1.1] md:text-[36px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#3A2400" }}
            >
              Keep updated
            </h2>
            <p className="mt-3 max-w-[460px] text-sm leading-relaxed" style={{ color: "#5A3A05" }}>
              Championship announcements, rulebook updates and federation news.
            </p>
          </div>
          {done ? (
            <div
              className="rounded-md bg-white/70 px-5 py-4 text-sm font-medium"
              style={{ color: "#3A2400" }}
              role="status"
            >
              Thanks — you're on the list.
            </div>
          ) : (
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setError("");
                try {
                  await subscribe({ data: { email, source: "history" } });
                  setDone(true);
                } catch {
                  setError("We couldn't add you right now. Please try again.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <label htmlFor="history-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="history-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2"
                style={{ color: "#414042" }}
              />
              {error && <p role="alert" className="text-sm font-semibold text-[#5A3A05] sm:basis-full">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="shrink-0 rounded-md px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: "#414042", color: "#fff" }}
              >
                {saving ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function HistoryPage() {
  return (
    <div className="min-h-dvh bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Nav />
      <main>
        <Hero />
        <Origins />
        <GhoshCup />
        <Lausanne />
        <Timeline />
        <GlobalMovement />
        <Olympic />
        <JoinMovement />
        <KeepUpdated />
      </main>
      <Footer />
    </div>
  );
}
