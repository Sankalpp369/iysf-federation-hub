import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  BedDouble,
  Bus,
  CalendarDays,
  Car,
  ChevronDown,
  FileText,
  Globe2,
  ImageIcon,
  Mail,
  MapPin,
  Plane,
  Train,
  Trophy,
  Users,
} from "lucide-react";
import { PageShell, Section, Prose } from "../components/page-shell";
import { IYSF } from "../components/site-chrome";
import { useServerFn } from "@tanstack/react-start";
import { submitNewsletterSignup } from "@/lib/submissions.functions";

export const Route = createFileRoute("/events/world-championship-2026")({
  head: () => ({
    meta: [
      { title: "17th World Championship of Yogasana Sports — Italy 2026" },
      {
        name: "description",
        content:
          "Marina di Camerota, Italy, December 4–6, 2026. Registration is open for the 17th edition of the world championship: 150+ athletes, 30+ countries, three days of competition.",
      },
      {
        property: "og:title",
        content: "17th World Championship of Yogasana Sports — Italy 2026",
      },
      {
        property: "og:description",
        content:
          "Marina di Camerota, Italy — December 4–6, 2026. Registration now open for the 17th edition.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldChampionship2026,
});

const GLANCE: [string, string, typeof Trophy][] = [
  ["17th", "consecutive edition", Trophy],
  ["150+", "athletes expected", Users],
  ["30+", "countries represented", Globe2],
  ["3", "days of competition", CalendarDays],
];

const EXPECT = [
  {
    title: "Elite competition",
    accent: IYSF.blue,
    body: "Athletes compete across individual, pair, and group categories, judged by certified international officials under IYSF standards.",
  },
  {
    title: "A global community",
    accent: IYSF.magenta,
    body: "Competitors, coaches, and guests from more than 30 countries share three days of competition, cultural exchange, and connection.",
  },
  {
    title: "A legacy continued",
    accent: IYSF.orange,
    body: "The 17th edition carries forward a championship shaped by generations of practitioners, now arriving on Italy's Cilento coast.",
  },
];

const GALLERY = [
  "Opening Ceremony",
  "Individual Category",
  "Competition Floor",
  "Medal Ceremony",
  "Individual Category – Italy Podium",
  "Group Category – Italy Podium",
];

function FaqItem({
  title,
  icon: Icon,
  kicker,
  children,
}: {
  title: string;
  icon: typeof Plane;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <details
      className="group rounded-[12px] border bg-white"
      style={{ borderColor: IYSF.blueLine, boxShadow: IYSF.blueShadow }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 marker:hidden md:px-6">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: IYSF.blueWash, color: IYSF.blue }}
        >
          <Icon size={21} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: IYSF.magenta }}>
            {kicker}
          </span>
          <span
            className="mt-1 block text-[18px] leading-snug md:text-[20px]"
            style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            {title}
          </span>
        </span>
        <ChevronDown
          size={20}
          className="shrink-0 transition-transform duration-200 group-open:rotate-180"
          style={{ color: IYSF.blue }}
          aria-hidden="true"
        />
      </summary>
      <div className="border-t px-5 py-6 md:px-6 md:pl-[84px]" style={{ borderColor: IYSF.blueLine }}>
        <div className="max-w-[840px] space-y-4 text-[15px] leading-relaxed" style={{ color: IYSF.charcoal }}>
          {children}
        </div>
      </div>
    </details>
  );
}

function PrimaryButton({ children, href }: { children: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-[12px] px-6 py-3.5 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
      style={{ background: IYSF.orange, color: IYSF.charcoal }}
    >
      {children}
    </a>
  );
}

function SecondaryButton({ children, href }: { children: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-[12px] border-2 px-6 py-3 text-[15px] font-bold transition-colors hover:bg-white"
      style={{ borderColor: IYSF.blue, color: IYSF.blue }}
    >
      {children}
    </a>
  );
}

function WorldChampionship2026() {
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [signupBusy, setSignupBusy] = useState(false);
  const [signupError, setSignupError] = useState("");
  const subscribe = useServerFn(submitNewsletterSignup);

  return (
    <PageShell>
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 pt-12 pb-10 md:px-8 md:pt-16">
          <div
            className="flex aspect-[2/1] min-h-[240px] flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed text-center"
            style={{ borderColor: IYSF.blueLine, boxShadow: IYSF.blueShadow }}
            role="img"
            aria-label="Championship artwork placeholder"
          >
            <ImageIcon size={28} color={IYSF.blue} aria-hidden="true" />
            <span className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: IYSF.charcoal }}>
              Championship artwork placeholder
            </span>
          </div>
          <div
            className="mt-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
            style={{ background: IYSF.magenta }}
          >
            Registration now open
          </div>
          <h1
            className="mt-4 max-w-[900px] text-[36px] leading-[1.04] tracking-[-0.02em] md:text-[56px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
          >
            17th World Championship of Yogasana Sports
          </h1>
          <div
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-semibold"
            style={{ color: IYSF.blue }}
          >
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" /> Marina di Camerota, Italy
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} aria-hidden="true" /> December 4–6, 2026
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="https://pci.jotform.com/form/261821599724366">Athlete Registration</PrimaryButton>
            <SecondaryButton href="https://app.winddoc.com/short/26mb/">Book Accommodation</SecondaryButton>
            <SecondaryButton href="/sponsorship">Become a Sponsor</SecondaryButton>
          </div>
        </div>
      </section>

      <Section heading="Join the longest-running Yogasana Sports championship" tint>
        <Prose>
          <p>
            For sixteen editions, athletes from every continent have come together to compete in
            Yogasana Sports — a discipline that tests precision, balance, and endurance under
            international judging standards. This December the tradition continues on Italy's
            southern coast, as the 17th edition brings the championship to Marina di Camerota.
          </p>
        </Prose>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {GLANCE.map(([figure, label, Icon]) => (
            <li
              key={label}
              className="rounded-[12px] border bg-white p-5"
              style={{ borderColor: IYSF.blueLine }}
            >
              <Icon size={18} color={IYSF.magenta} aria-hidden="true" />
              <div
                className="mt-3 text-[30px] leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
              >
                {figure}
              </div>
              <div
                className="mt-2 text-[11.5px] font-bold uppercase tracking-[0.16em]"
                style={{ color: IYSF.charcoal }}
              >
                {label}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading="What to expect">
        <ul className="grid gap-5 md:grid-cols-3">
          {EXPECT.map((e) => (
            <li
              key={e.title}
              className="rounded-[12px] border bg-white p-6"
              style={{ borderColor: IYSF.blueLine, borderTop: `3px solid ${e.accent}` }}
            >
              <h3
                className="text-[19px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
              >
                {e.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
                {e.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading="The venue" tint>
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-[12px] border bg-white p-6"
            style={{ borderColor: IYSF.blueLine }}
          >
            <div
              className="text-[20px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
            >
              Palazzetto dello Sport
            </div>
            <div className="mt-2 text-[15px]" style={{ color: IYSF.charcoal }}>
              Marina di Camerota, Campania, Italy
            </div>
            <div
              className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: IYSF.blue, fontFamily: "var(--font-mono)" }}
            >
              In use: December 4–6, 2026
            </div>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
              The official competition venue, hosting all rounds across the three days. Directions
              and access details will be added as they are confirmed.
            </p>
            <blockquote
              className="mt-5 border-l-[3px] py-1 pl-4 text-[15px] italic leading-relaxed"
              style={{ borderColor: IYSF.orange, color: IYSF.charcoal }}
            >
              A warm welcome on Italy's Cilento coast, shaped by heritage, hospitality, and the sea.
            </blockquote>
          </div>
          <div
            className="rounded-[12px] border bg-white p-6"
            style={{ borderColor: IYSF.blueLine }}
          >
            <div
              className="text-[20px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
            >
              The destination: Marina di Camerota
            </div>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
              A coastal town in southern Italy known for centuries-old olive groves, dramatic
              Mediterranean coves, and sea air — a fitting backdrop for a championship built on
              discipline and presence. Beyond the competition floor, the Cilento region offers
              handmade pasta, estate wine, and olive oil pressed from groves that have stood for
              generations: a warm welcome for athletes and guests arriving from around the world.
            </p>
          </div>
        </div>
      </Section>

      <Section heading="Where to stay">
        <Prose>
          <p>
            <strong>Cilento Dreams Village</strong> is the recommended accommodation, located
            closest to the Palazzetto dello Sport and just minutes from the Marina di Camerota
            coastline.
          </p>
        </Prose>
        <div className="mt-6">
          <PrimaryButton href="https://app.winddoc.com/short/26mb/">Book Accommodation</PrimaryButton>
        </div>
      </Section>

      <Section heading="Frequently Asked Questions" kicker="Plan your journey" tint>
        <p className="max-w-[760px] text-[16px] leading-relaxed" style={{ color: IYSF.charcoal }}>
          Everything you need to know about travelling to Marina di Camerota, transfers,
          accommodation and visa requirements.
        </p>

        <div className="mt-9 space-y-5">
          <FaqItem title="How to reach Marina di Camerota?" icon={Plane} kicker="Plane · Car · Train · Bus">
            <p>
              Marina di Camerota is easily accessible by car, train, bus and plane, with direct
              connections from Naples, Salerno and other Italian cities.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [Plane, "By Plane", "The nearest airport is Naples Capodichino, about 170–190 km away. It is possible to book the transfer service to reach Marina di Camerota."],
                [Car, "By Car", "The most common route is the A3 motorway (Naples-Salerno-Reggio Calabria) or the A2 del Mediterraneo to the SS18 Variante Cilentana, recommended Poderia exit, then the SR 562 towards the coast to Marina di Camerota. From Salerno the journey takes about 2 hours, from Naples about 2 and a half hours."],
                [Train, "By Train", "Frecciarossa trains connect Milan Central, Rome, Naples and other cities with the Centola-Palinuro-Marina di Camerota station. From the station it is possible to book the transfer service to Marina di Camerota."],
                [Bus, "By Bus", "FlixBus and other services offer direct connections to Marina di Camerota. Tickets can be purchased online or via the app — just show the QR code to the driver. The main stop is in the center, easily accessible from the port and the promenade."],
              ].map(([TravelIcon, label, copy]) => {
                const Icon = TravelIcon as typeof Plane;
                return (
                  <div key={label as string} className="border-l-2 pl-4" style={{ borderColor: IYSF.blueLine }}>
                    <div className="flex items-center gap-2 font-bold" style={{ color: IYSF.blue }}>
                      <Icon size={16} aria-hidden="true" /> {label as string}
                    </div>
                    <p className="mt-2">{copy as string}</p>
                  </div>
                );
              })}
            </div>
          </FaqItem>

          <FaqItem title="How to book the transfer?" icon={Car} kicker="Arrival and departure">
            <p>
              When you fill out the accommodation form, click &quot;I need the transfer.&quot; Once
              we&apos;ve collected all registrations, we&apos;ll contact you by email to agree on arrival
              time and pickup location. Cars for 6–8 people will be organized according to
              arrival/departure times provided. The cost shown in the transfer flyer covers the
              scheduled arrival window of 2–3 December and departure window of 7–8 December; any
              other dates must be agreed in advance and may carry a different price.
            </p>
          </FaqItem>

          <FaqItem title="Accommodation" icon={BedDouble} kicker="Residence · Hotel · B&B">
            <p>
              When filling out the accommodation form, choose between Residence, Hotel, or B&amp;B.
              You&apos;ll receive a confirmation email. As registrations close, we&apos;ll contact you with
              the quote and the address of your assigned accommodation.
            </p>
            <p className="rounded-[10px] border-l-[3px] px-4 py-3 font-semibold" style={{ background: IYSF.blueWash, borderColor: IYSF.orange }}>
              First come, first served — accommodations closest to the venue are assigned in
              booking order, so submit early.
            </p>
            <p>The accommodation form must be completed by November 2, 2026.</p>
            <p>For personal needs, your confirmation email includes a WhatsApp number for direct contact.</p>
            <p>Traveling alone and want to split a room? Book your room and note it in the form.</p>
            <p>Note: the Holiday Village Resort only has apartments for 4 people.</p>
          </FaqItem>

          <FaqItem title="Visa" icon={FileText} kicker="Documents and deadlines">
            <p>
              We highly recommend travel insurance covering flights and travel, and confirming your
              visa is valid for at least 6 months at the time of the event. Review the updates below
              to ensure Schengen entry visas are secured on time and competition categories are
              registered correctly.
            </p>
            <p>
              <strong>Countries requiring visa invitation support</strong> — delegations and athletes
              with passports from these regions must submit the Google Sheet request form to
              invitationletter@iysf.org as soon as possible: countries across Asia/South Asia
              (including India, Nepal, Pakistan, Bangladesh, Sri Lanka, China, Philippines, Vietnam,
              Indonesia, Thailand), the Americas (Ecuador, Bolivia, Cuba, Dominican Republic,
              Jamaica, Guyana), all African nations, the Middle East (Turkey, Iran, Iraq, Jordan,
              Lebanon, Saudi Arabia, Qatar, UAE non-citizens), and Central Asia/Eastern Europe
              (Kazakhstan, Uzbekistan, Armenia, Azerbaijan).
            </p>
            <p>
              <strong>Countries that do NOT need a Schengen visa</strong> — for short stays up to 90
              days: all EU/EEA/Switzerland member states, the Americas (United States, Canada,
              Mexico, Argentina, Brazil, Chile, Colombia, Peru, Uruguay), Asia-Pacific (Japan, South
              Korea, Singapore, Malaysia, Australia, New Zealand), and non-EU Europe (United
              Kingdom, Ukraine, Georgia).
            </p>
            <p>
              <strong>Visa invitation request process</strong> — submissions are collected via a
              standardized Google Sheet template; official invitation letters are issued on official
              letterhead by the Italian Federation. Include any special requirements needed to
              obtain the letter.
            </p>
            <p><strong>Visa submission deadline:</strong> November 4, 2026</p>
            <p><strong>Visa questions:</strong> invitationletter@iysf.org</p>
          </FaqItem>
        </div>

        <div
          className="mt-8 flex max-w-[840px] items-start gap-3 rounded-[10px] border-l-[3px] p-5 text-[15px] font-semibold"
          style={{ background: "#fff", borderColor: IYSF.orange, color: IYSF.charcoal }}
        >
          <Plane size={19} color={IYSF.blue} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>Travel note: We strongly recommend you purchase flight insurance with your ticket.</span>
        </div>
      </Section>

      <Section heading="Moments from the Malaysian Championship" kicker="Photo gallery" tint>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((caption) => (
            <li
              key={caption}
              className="overflow-hidden rounded-[12px] border bg-white"
              style={{ borderColor: IYSF.blueLine }}
            >
              <div
                className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border-b border-dashed"
                style={{ background: IYSF.blueWash, borderColor: IYSF.blueLine }}
                role="img"
                aria-label={`${caption} photo placeholder`}
              >
                <ImageIcon size={24} color={IYSF.blue} aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: IYSF.charcoal }}>
                  Photo placeholder
                </span>
              </div>
              <div className="px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: IYSF.charcoal }}>
                {caption}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section heading="Join us in Italy">
        <div className="grid gap-5 md:grid-cols-2">
          <div
            className="rounded-[12px] border p-6"
            style={{ borderColor: IYSF.blueLine, background: "#fff", borderTop: `3px solid ${IYSF.magenta}` }}
          >
            <h3
              className="text-[19px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
            >
              For athletes
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
              Register to compete and secure your place among 150+ athletes from 30+ countries.
              Registration confirms category entry and official credentials for the 17th World
              Championship.
            </p>
            <div className="mt-5">
              <PrimaryButton href="https://pci.jotform.com/form/261821599724366">Athlete Registration</PrimaryButton>
            </div>
          </div>
          <div
            className="rounded-[12px] border p-6"
            style={{ borderColor: IYSF.blueLine, background: "#fff", borderTop: `3px solid ${IYSF.blue}` }}
          >
            <h3
              className="text-[19px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
            >
              For athletes &amp; guests
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
              Book your stay at Cilento Dreams Village, the closest recommended accommodation to
              the venue.
            </p>
            <div className="mt-5">
              <SecondaryButton href="https://app.winddoc.com/short/26mb/">Book Accommodation</SecondaryButton>
            </div>
          </div>
        </div>
      </Section>

      <section style={{ background: IYSF.charcoal }}>
        <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8">
          <div className="max-w-[620px]">
            <div
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: IYSF.orange }}
            >
              Keep updated
            </div>
            <h2
              className="mt-3 text-[26px] leading-[1.1] text-white md:text-[34px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
            >
              Championship news, straight to your inbox
            </h2>
            <p className="mt-3 text-[15px] text-white/80">
              Schedule releases, category confirmations, and travel details for Marina di Camerota.
            </p>
            {signedUp ? (
              <p className="mt-6 text-[15px] font-semibold" style={{ color: IYSF.orange }}>
                Thanks — you're on the list for 2026 championship updates.
              </p>
            ) : (
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSignupBusy(true);
                  setSignupError("");
                  try {
                    await subscribe({ data: { email, source: "world-championship-2026" } });
                    setSignedUp(true);
                  } catch {
                    setSignupError("We couldn't add you right now. Please try again.");
                  } finally {
                    setSignupBusy(false);
                  }
                }}
              >
                <label className="relative flex-1">
                  <span className="sr-only">Email address</span>
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[10px] border border-white/25 bg-white/10 px-9 py-3 text-[15px] text-white placeholder:text-white/50 outline-none focus:border-white/60"
                  />
                </label>
                {signupError && <p role="alert" className="text-sm font-semibold text-white sm:basis-full">{signupError}</p>}
                <button
                  type="submit"
                  disabled={signupBusy}
                  className="rounded-[10px] px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
                  style={{ background: IYSF.orange, color: IYSF.charcoal }}
                >
                  {signupBusy ? "Subscribing…" : "Keep me updated"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}