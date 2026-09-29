import { useState } from "react";
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
  { label: "Yoga as a Sport", to: "/about/yoga-as-a-sport" },
];

const OFFICIALS_ITEMS: Item[] = [
  { label: "Executive Committee", to: "/about/executive-committee" },
  { label: "Athletes' Commission", to: "/about/athletes-commission" },
  { label: "Technical Committee", to: "/about/technical-committee" },
  { label: "International Judges", to: "/about/international-judges" },
  { label: "International Coaches", to: "/about/international-coaches" },
];

const ACADEMY_ITEMS: Item[] = [
  { label: "Training", to: "/academy/training" },
  { label: "Judging", to: "/academy/judging" },
  { label: "Coaching", to: "/academy/coaching" },
];

const RULES_EVENTS_LINKS: Item[] = [
  { label: "Rules", to: "/rules" },
  { label: "Events", to: "/events" },
  { label: "Sponsorship", to: "/sponsorship" },
  { label: "Championship Results", to: "/results" },
];

const TAIL_LINKS: Item[] = [
  { label: "Directory", to: "/directory" },
  { label: "Champions", to: "/about/champions" },
];

export const EXPLORE_LINKS: Item[] = [
  { label: "History", to: "/about/history" },
  { label: "Governance", to: "/about/governance" },
  { label: "Rules", to: "/rules" },
  { label: "Events", to: "/events" },
  { label: "Sponsorship", to: "/sponsorship" },
  { label: "Results", to: "/results" },
  { label: "Academy", to: "/academy" },
  { label: "Directory", to: "/directory" },
  { label: "Executive Committee", to: "/about/executive-committee" },
  { label: "Contact", to: "/contact" },
  { label: "Donate", to: "/donate" },
  { label: "Privacy", to: "/privacy" },
  { label: "Join us", to: "/join-us" },
];

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
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="group relative inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
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
                  className="block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[rgba(66,152,211,0.08)]"
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
  return (
    <>
    <Link
      to="/events/world-championship-2026"
      className="flex h-8 w-full items-center overflow-hidden text-[10.5px] font-bold uppercase leading-none tracking-[0.12em] text-white transition-opacity hover:opacity-90 sm:text-[12px] sm:tracking-[0.18em]"
      style={{ background: IYSF.magenta, fontFamily: "var(--font-sans)" }}
      aria-label="Register now for the 17th World Yogasana Championship"
    >
      <span className="iysf-marquee-track flex min-w-max items-center whitespace-nowrap motion-reduce:mx-auto">
        <span className="px-5">Register Now — 17th World Yogasana Championship, Italy · Dec 4–6, 2026 →</span>
        <span className="px-5" aria-hidden="true">Register Now — 17th World Yogasana Championship, Italy · Dec 4–6, 2026 →</span>
      </span>
    </Link>

    <header
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur"
      style={{ borderBottom: `1px solid ${IYSF.blueLine}`, fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 md:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link to="/" aria-label="IYSF home" className="min-w-0 justify-self-start">
          <IysfWordmark />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-5 xl:flex">
          <Link
            to="/"
            className="group relative text-[13px] font-semibold transition-colors"
            style={{ color: IYSF.charcoal }}
          >
            Home
            <span
              className="absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
              style={{ background: IYSF.magenta }}
            />
          </Link>
          <Dropdown label="About" items={ABOUT_ITEMS} />
          <Dropdown label="Officials" items={OFFICIALS_ITEMS} />
          {RULES_EVENTS_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group relative text-[13px] font-semibold transition-colors"
              style={{ color: IYSF.charcoal }}
            >
              {l.label}
              <span
                className="absolute -bottom-1.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: IYSF.magenta }}
              />
            </Link>
          ))}
          <Dropdown label="Academy" items={ACADEMY_ITEMS} />
          {TAIL_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="group relative text-[13px] font-semibold transition-colors"
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
            className="hidden text-[13px] font-semibold transition-colors hover:opacity-70 lg:inline-block"
            style={{ color: IYSF.charcoal }}
          >
            Contact
          </Link>
          <Link
            to={session ? "/dashboard" : "/login"}
            className="hidden text-[13px] font-semibold transition-colors hover:opacity-70 lg:inline-block"
            style={{ color: IYSF.charcoal }}
          >
            {session ? "My account" : "Log in"}
          </Link>
          <Link
            to="/donate"
            className="hidden rounded-[10px] border-2 px-3.5 py-1.5 text-[13px] font-bold transition-colors hover:bg-[rgba(66,152,211,0.08)] lg:inline-block"
            style={{ borderColor: IYSF.blue, color: IYSF.blue }}
          >
            Donate
          </Link>
          <Link
            to="/join-us"
            className="hidden rounded-[10px] px-4 py-2 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 sm:inline-flex"
            style={{ background: IYSF.orange, boxShadow: "0 10px 22px -12px rgba(250,175,64,0.9)" }}
          >
            Join us
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] hover:bg-[rgba(66,152,211,0.08)] xl:hidden"
            style={{ color: IYSF.charcoal }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="absolute inset-x-0 top-full overflow-y-auto overscroll-contain bg-white shadow-xl xl:hidden"
          style={{ borderTop: `1px solid ${IYSF.blueLine}`, maxHeight: "calc(100dvh - 4rem)" }}
        >
          <nav className="mx-auto flex max-w-[1320px] flex-col gap-0.5 px-5 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <MobileLink to="/" label="Home" onDone={() => setOpen(false)} />
            <MobileGroup title="About" items={ABOUT_ITEMS} onDone={() => setOpen(false)} />
            <MobileGroup title="Officials" items={OFFICIALS_ITEMS} onDone={() => setOpen(false)} />
            {RULES_EVENTS_LINKS.map((l) => (
              <MobileLink key={l.label} to={l.to} label={l.label} onDone={() => setOpen(false)} />
            ))}
            <MobileGroup title="Academy" items={ACADEMY_ITEMS} onDone={() => setOpen(false)} />
            {TAIL_LINKS.map((l) => (
              <MobileLink key={l.label} to={l.to} label={l.label} onDone={() => setOpen(false)} />
            ))}
            <div className="my-2 h-px" style={{ background: IYSF.blueLine }} />
            <MobileLink to="/contact" label="Contact" onDone={() => setOpen(false)} />
            <MobileLink
              to={session ? "/dashboard" : "/login"}
              label={session ? "My account" : "Log in"}
              onDone={() => setOpen(false)}
            />
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-[10px] border-2 px-3 py-2.5 text-center text-sm font-bold"
              style={{ borderColor: IYSF.blue, color: IYSF.blue }}
            >
              Donate
            </Link>
            <Link
              to="/join-us"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-[10px] px-3 py-2.5 text-center text-sm font-bold text-white"
              style={{ background: IYSF.orange }}
            >
              Join us
            </Link>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}

function MobileLink({ to, label, onDone }: { to: string; label: string; onDone: () => void }) {
  return (
    <Link
      to={to}
      onClick={onDone}
      className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-[rgba(66,152,211,0.08)]"
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
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold hover:bg-[rgba(66,152,211,0.08)]"
        style={{ color: IYSF.charcoal }}
      >
        {title}
        <ChevronDown size={18} aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div id={id} className="ml-3 border-l-2 pl-2" style={{ borderColor: IYSF.blueLine }}>
          {items.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onDone}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[rgba(66,152,211,0.08)]"
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
    <div className="flex items-center gap-3">
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/15 transition-colors hover:bg-white/10 sm:h-9 sm:w-9 sm:rounded-[10px]"
        >
          <Icon size={14} color={IYSF.blue} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function FooterInner({ minimal = false }: { minimal?: boolean }) {
  const links: Item[] = EXPLORE_LINKS;
  return (
    <footer style={{ background: IYSF.charcoal, color: "#fff", fontFamily: "var(--font-sans)" }}>
      {minimal ? (
        <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-4 px-5 py-10 md:px-8">
          <IysfWordmark light />
          <SocialRow />
        </div>
      ) : (
      <div className="iysf-footer mx-auto grid max-w-[1320px] grid-cols-1 gap-3 px-4 py-4 sm:gap-10 sm:px-5 sm:py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 sm:block">
            <div className="shrink-0 origin-left scale-75 sm:scale-100"><IysfWordmark light /></div>
            <p className="min-w-0 text-[11px] leading-snug text-white/70 sm:mt-4 sm:max-w-[320px] sm:text-sm sm:leading-relaxed">
              International Yoga Sports Federation — the global governing body for Yogasana sport.
            </p>
          </div>
          <div className="mt-2 sm:mt-5">
            <SocialRow />
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] sm:mb-4" style={{ color: IYSF.orange }}>
            Explore
          </div>
          <ul className="grid grid-cols-3 gap-x-3 gap-y-0.5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-2.5">
            {links.map((l) => (
              <li key={l.label} className="min-w-0">
                <Link to={l.to} hash={l.hash} className="block truncate py-0.5 text-[11px] leading-tight text-white/80 hover:text-white sm:py-0 sm:text-sm">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] sm:mb-4" style={{ color: IYSF.orange }}>
            Headquarters
          </div>
          <address className="text-[11px] not-italic leading-snug text-white/80 sm:text-sm sm:leading-relaxed">
            Maison du Sport International
            <span className="sm:hidden">, </span>
            <br className="hidden sm:block" />
            Av de Rhodanie 54
            <br />
            Lausanne, Switzerland
          </address>
          <Link
            to="/contact"
            className="mt-1.5 inline-block text-[11px] font-semibold text-white/85 hover:text-white sm:mt-4 sm:text-sm"
          >
            Contact IYSF →
          </Link>
        </div>
      </div>
      )}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1320px] px-4 py-2 text-center text-[11px] text-white/60 sm:px-5 sm:py-5 sm:text-xs md:px-8">
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
