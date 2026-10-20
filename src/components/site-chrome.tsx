import { useEffect, useState } from "react";
import { Menu, X, Facebook, Instagram, Youtube, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logoSrc from "../assets/iysf-logo.png";
import { useSession } from "@/hooks/use-session";

export const IYSF = {
  blue: "#4298D3",
  orange: "#FAAF40",
  magenta: "#DE007A",
  charcoal: "#414042",
  blueWash: "rgba(66,152,211,0.06)",
  blueLine: "rgba(66,152,211,0.28)",
  blueShadow: "0 14px 34px -18px rgba(66,152,211,0.55)",
} as const;

export function IysfWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logoSrc}
        alt="IYSF — International Yoga Sports Federation"
        width={40}
        height={40}
        className="h-9 w-auto"
      />
      <span
        className="hidden text-[15px] font-extrabold leading-tight tracking-[0.12em] sm:block"
        style={{ color: light ? "#FFFFFF" : IYSF.charcoal, fontFamily: "var(--font-display)" }}
      >
        IYSF
      </span>
    </span>
  );
}

type Item = { label: string; to: string; hash?: string };

const ABOUT_ITEMS: Item[] = [
  { label: "History", to: "/about/history" },
  { label: "Governance", to: "/about/governance" },
  { label: "Executive Committee", to: "/about/executive-committee" },
  { label: "Champions", to: "/about/champions" },
  { label: "Yoga as a Sport", to: "/about/yoga-as-a-sport" },
  { label: "International Judges", to: "/about/international-judges" },
  { label: "International Coaches", to: "/about/international-coaches" },
  { label: "Athletes' Commission", to: "/about/athletes-commission" },
  { label: "Technical Committee", to: "/about/technical-committee" },
];

const COMPETITION_ITEMS: Item[] = [
  { label: "Rules", to: "/rules" },
  { label: "Events", to: "/events" },
  { label: "Results", to: "/results" },
];

const ACADEMY_ITEMS: Item[] = [
  { label: "Academy overview", to: "/academy" },
  { label: "Training", to: "/academy/training" },
  { label: "Judging", to: "/academy/judging" },
  { label: "Coaching", to: "/academy/coaching" },
];

const TAIL_LINKS: Item[] = [
  { label: "News", to: "/news" },
  { label: "Directory", to: "/directory" },
  { label: "Sponsorship", to: "/sponsorship" },
];

export const FOOTER_GROUPS: { title: string; links: Item[] }[] = [
  { title: "About", links: [
    { label: "History", to: "/about/history" },
    { label: "Governance", to: "/about/governance" },
    { label: "Executive Committee", to: "/about/executive-committee" },
  ] },
  { title: "Competition", links: [
    { label: "Rules", to: "/rules" },
    { label: "Events", to: "/events" },
    { label: "Results", to: "/results" },
    { label: "News", to: "/news" },
  ] },
  { title: "Get involved", links: [
    { label: "Join us", to: "/join-us" },
    { label: "Academy", to: "/academy" },
    { label: "Directory", to: "/directory" },
    { label: "Sponsorship", to: "/sponsorship" },
    { label: "Donate", to: "/donate" },
    { label: "Contact", to: "/contact" },
  ] },
  { title: "Legal", links: [{ label: "Privacy", to: "/privacy" }] },
];

export const EXPLORE_LINKS: Item[] = FOOTER_GROUPS.flatMap((g) => g.links);

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4298D3]";

function Dropdown({
  label,
  items,
  wide = false,
}: {
  label: string;
  items: Item[];
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`group relative inline-flex min-h-11 items-center gap-1 rounded text-[13px] font-semibold transition-colors ${FOCUS}`}
        style={{ color: IYSF.charcoal }}
      >
        {label}
        <ChevronDown size={13} aria-hidden="true" />
        <span
          className="absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-[calc(100%-16px)]"
          style={{ background: IYSF.magenta }}
        />
      </button>
      {open && (
        <div className={`absolute left-0 top-full z-50 pt-4 ${wide ? "w-[430px]" : "w-[230px]"}`}>
          <div
            className="rounded-xl border bg-white p-2 shadow-[0_24px_50px_-26px_rgba(66,152,211,0.7)]"
            style={{ borderColor: IYSF.blueLine }}
          >
            <div className={wide ? "grid grid-cols-2 gap-0.5" : ""}>
              {items.map((it) => (
                <Link
                  key={it.label}
                  to={it.to}
                  hash={it.hash}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-[13px] ${FOCUS}`} 
                  style={{ color: IYSF.charcoal }}
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <>
    {/* Announcement banner — single tappable row, safe-area aware */}
    <Link
      to="/events/world-championship-2026"
      className="iysf-safe-top flex min-h-8 w-full max-w-full items-center justify-center overflow-hidden px-4 text-center text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-white transition-opacity hover:opacity-90 sm:text-[12px] sm:tracking-[0.18em]"
      style={{ background: IYSF.magenta, fontFamily: "var(--font-sans)" }}
      aria-label="Register now for the 17th World Yogasana Championship"
    >
      {/* Short label on small phones so it never wraps */}
      <span className="truncate sm:hidden">17th World Championship · Italy · Dec 4–6 →</span>
      {/* Full label from sm breakpoint up */}
      <span className="hidden truncate sm:inline">Register Now — 17th World Yogasana Championship · Italy · Dec 4–6, 2026 →</span>
    </Link>

    <header
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur"
      style={{ borderBottom: `1px solid ${IYSF.blueLine}`, fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5 md:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link to="/" aria-label="IYSF home" className="min-w-0 justify-self-start">
          <IysfWordmark />
        </Link>

        <nav aria-label="Main" className="hidden min-w-0 items-center justify-center gap-5 lg:flex">
          <Link
            to="/"
            className={`group relative inline-flex min-h-11 items-center rounded text-[13px] font-semibold transition-colors ${FOCUS}`}
            style={{ color: IYSF.charcoal }}
          >
            Home
            <span
              className="absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ background: IYSF.magenta }}
            />
          </Link>
          <Dropdown label="About" items={ABOUT_ITEMS} />
          <Dropdown label="Competition" items={COMPETITION_ITEMS} />
          <Dropdown label="Academy" items={ACADEMY_ITEMS} />
          {TAIL_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className={`group relative inline-flex min-h-11 items-center rounded text-[13px] font-semibold transition-colors ${FOCUS}`}
              style={{ color: IYSF.charcoal }}
            >
              {l.label}
              <span
                className="absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: IYSF.magenta }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/contact"
            className={`hidden min-h-11 items-center rounded text-[13px] font-semibold transition-colors hover:opacity-70 lg:inline-flex ${FOCUS}`}
            style={{ color: IYSF.charcoal }}
          >
            Contact
          </Link>
          <Link
            to={session ? "/dashboard" : "/login"}
            className={`hidden min-h-11 items-center rounded text-[13px] font-semibold transition-colors hover:opacity-70 lg:inline-flex ${FOCUS}`}
            style={{ color: IYSF.charcoal }}
          >
            {session ? "My account" : "Log in"}
          </Link>
          <Link
            to="/donate"
            className={`hidden min-h-11 items-center rounded text-[13px] font-semibold underline-offset-4 hover:underline lg:inline-flex ${FOCUS}`}
            style={{ color: IYSF.blue }}
          >
            Donate
          </Link>
          <Link
            to="/join-us"
            className={`inline-flex min-h-11 items-center rounded-[10px] px-4 py-2 text-[13px] font-bold transition-all hover:-translate-y-0.5 motion-reduce:transform-none ${FOCUS}`}
            style={{ background: IYSF.orange, color: "#3A2400", boxShadow: "0 10px 22px -12px rgba(250,175,64,0.9)" }}
          >
            Join us
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[10px] hover:bg-[rgba(66,152,211,0.08)] lg:hidden ${FOCUS}`}
            style={{ color: IYSF.charcoal }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

    </header>
      {open && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        >
          {/* Backdrop */}
          <button type="button" aria-label="Close menu" tabIndex={-1} className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          {/* Drawer panel */}
          <div
            className="iysf-slide-in absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto overscroll-contain bg-white shadow-xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 1rem)" }}
          >
            <div className="flex shrink-0 items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${IYSF.blueLine}` }}>
              <IysfWordmark />
              <button type="button" autoFocus aria-label="Close menu" onClick={() => setOpen(false)} className={`inline-flex h-11 w-11 items-center justify-center rounded-[10px] ${FOCUS}`} style={{ color: IYSF.charcoal }}>
                <X size={20} />
              </button>
            </div>
            {/* Primary CTA at top of drawer — always visible */}
            <div className="shrink-0 px-4 pt-4">
              <Link
                to="/join-us"
                onClick={() => setOpen(false)}
                className={`flex min-h-12 w-full items-center justify-center rounded-[10px] text-center text-base font-bold ${FOCUS}`}
                style={{ background: IYSF.orange, color: "#3A2400" }}
              >
                Join us
              </Link>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col gap-0.5 px-4 py-3">
              <MobileLink to="/" label="Home" onDone={() => setOpen(false)} />
              <MobileGroup title="About" items={ABOUT_ITEMS} onDone={() => setOpen(false)} />
              <MobileGroup title="Competition" items={COMPETITION_ITEMS} onDone={() => setOpen(false)} />
              <MobileGroup title="Academy" items={ACADEMY_ITEMS} onDone={() => setOpen(false)} />
              {TAIL_LINKS.map((l) => (
                <MobileLink key={l.label} to={l.to} label={l.label} onDone={() => setOpen(false)} />
              ))}
              <div className="my-2 h-px" style={{ background: IYSF.blueLine }} />
              <MobileLink to="/contact" label="Contact" onDone={() => setOpen(false)} />
              <MobileLink to={session ? "/dashboard" : "/login"} label={session ? "My account" : "Log in"} onDone={() => setOpen(false)} />
              <Link to="/donate" onClick={() => setOpen(false)} className={`mt-1 flex min-h-11 items-center justify-center rounded-[10px] border-2 px-3 text-center text-base font-bold ${FOCUS}`} style={{ borderColor: IYSF.blue, color: IYSF.blue }}>
                Donate
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({ to, label, onDone }: { to: string; label: string; onDone: () => void }) {
  return (
    <Link
      to={to}
      onClick={onDone}
      className={`flex min-h-11 items-center rounded-lg px-3 text-base font-semibold hover:bg-[rgba(66,152,211,0.08)] ${FOCUS}`}
      style={{ color: IYSF.charcoal }}
    >
      {label}
    </Link>
  );
}

function MobileGroup({
  title,
  items,
  onDone,
}: {
  title: string;
  items: Item[];
  onDone: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = `mnav-${title.toLowerCase()}`;
  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
        className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-base font-semibold hover:bg-[rgba(66,152,211,0.08)] ${FOCUS}`}
        style={{ color: IYSF.charcoal }}
      >
        {title}
        <ChevronDown size={18} aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div id={id} className="ml-3 border-l-2 pl-2" style={{ borderColor: IYSF.blueLine }}>
          {items.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onDone}
              className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium hover:bg-[rgba(66,152,211,0.08)] ${FOCUS}`}
              style={{ color: IYSF.charcoal }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer({ minimal = false }: { minimal?: boolean }) {
  return <FooterInner minimal={minimal} />;
}

function SocialRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {([
        [Facebook, "Facebook", "https://www.facebook.com/YogaSports/"],
        [Instagram, "Instagram", "https://www.instagram.com/iysf_official"],
        [Youtube, "YouTube", "https://www.youtube.com/c/YogaAsanaSports"],
      ] as const).map(([Icon, name, href]) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`IYSF on ${name}`}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/15 transition-colors hover:bg-white/10 ${FOCUS}`}
        >
          <Icon size={14} color={IYSF.blue} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function FooterInner({ minimal = false }: { minimal?: boolean }) {
    return (
    <footer style={{ background: IYSF.charcoal, color: "#fff", fontFamily: "var(--font-sans)" }}>
      {minimal ? (
        <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-4 px-5 py-10 md:px-8">
          <IysfWordmark light />
          <SocialRow />
        </div>
      ) : (
      <div className="iysf-footer mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-4 py-10 sm:px-5 sm:py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        {/* Brand column */}
        <div className="min-w-0">
          <IysfWordmark light />
          <p className="mt-3 min-w-0 max-w-[320px] break-words text-sm leading-relaxed text-white/70">
            International Yoga Sports Federation — the global governing body for Yogasana sport.
          </p>
          <div className="mt-4">
            <SocialRow />
          </div>
        </div>

        {/* Link groups — 2-col grid on all sizes */}
        <nav aria-label="Footer" className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-6">
          {FOOTER_GROUPS.map((g) => (
            <div key={g.title} className="min-w-0">
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: IYSF.orange }}>{g.title}</div>
              <ul>
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={`flex min-h-11 items-center text-sm text-white/85 hover:text-white sm:min-h-9 ${FOCUS}`}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Headquarters */}
        <div className="min-w-0">
          <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: IYSF.orange }}>
            Headquarters
          </div>
          <address className="break-words text-sm not-italic leading-relaxed text-white/80">
            Maison du Sport International<br />
            Av de Rhodanie 54<br />
            Lausanne, Switzerland
          </address>
          <Link
            to="/contact"
            className={`mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-white/85 hover:text-white ${FOCUS}`}
          >
            Contact IYSF →
          </Link>
        </div>
      </div>
      )}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1320px] px-4 py-3 text-center text-[11px] text-white/60 sm:px-5 sm:py-5 sm:text-xs md:px-8">
          © 2026 IYSF
        </div>
      </div>
    </footer>
  );
}

export function Breadcrumb({
  parentLabel,
  parentTo,
  current,
  color = IYSF.blue,
}: {
  parentLabel: string;
  parentTo: string;
  current: string;
  color?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[11px] font-semibold uppercase tracking-[0.22em]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <Link to={parentTo} className="hover:underline" style={{ color }}>
        {parentLabel}
      </Link>
      <span aria-hidden="true" style={{ color: "rgba(65,64,66,0.45)" }}>
        {" "}
        —{" "}
      </span>
      <span style={{ color: "rgba(65,64,66,0.7)" }}>{current}</span>
    </nav>
  );
}
