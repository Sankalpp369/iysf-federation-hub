import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, Trophy, GraduationCap } from "lucide-react";
import { Nav, Footer, IYSF } from "../components/site-chrome";
import { JoinForm } from "../components/join-form";
import { Reveal } from "../components/history-motion";
import heroVideo from "../assets/hero-video.mp4.asset.json";
import aboutCompetition from "../assets/about-competition.jpg";
import aboutSport from "../assets/about-sport.jpg";
import aboutChampions from "../assets/about-champions.jpg";
import aboutGovernance from "../assets/about-governance.jpg";
import delegation1 from "../assets/delegation-1.jpg";
import delegation2 from "../assets/delegation-2.jpg";
import delegation3 from "../assets/delegation-3.jpg";
import event1 from "../assets/event-1.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "IYSF — International Yoga Sports Federation" },
      {
        name: "description",
        content:
          "IYSF is the global governing body for Yogasana sport: 64 member federations, world championships, judge certification, and the path toward Olympic recognition.",
      },
      { property: "og:title", content: "IYSF — International Yoga Sports Federation" },
      {
        property: "og:description",
        content: "64 member federations. Is yours one of them? Join the global governing body for Yogasana sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const CARD: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${IYSF.blueLine}`,
  borderRadius: 14,
  boxShadow: IYSF.blueShadow,
};

const H2 = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  color: IYSF.charcoal,
  letterSpacing: "-0.02em",
  ...extra,
});

function Hero() {
  return (
    <section aria-label="IYSF championship film" className="relative isolate overflow-hidden bg-black">
      <video
        src={heroVideo.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-[40vh] min-h-[240px] max-h-[420px] w-full md:max-h-none object-cover object-center md:h-[78vh]"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0))" }}
      />
    </section>
  );
}

function Overview() {
  return (
    <section id="overview" className="bg-white">
      <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <div className="mx-auto max-w-[860px] text-center md:mx-0 md:text-left">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              style={{ background: IYSF.magenta }}
            >
              World Yogasana Championships
            </div>
            <h1
              className="text-[38px] leading-[1.04] md:text-[64px]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: IYSF.charcoal,
              }}
            >
              A practice, judged as a sport.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-lg font-medium md:mx-0 md:text-xl" style={{ color: "rgba(65,64,66,0.78)" }}>
              64 member federations. Is yours one of them?
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center md:justify-start">
              <Link
                to="/"
                hash="join"
                className="rounded-[12px] px-7 py-4 text-center text-base font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: IYSF.orange, boxShadow: "0 16px 36px -16px rgba(250,175,64,0.95)" }}
              >
                Join a federation
              </Link>
              <Link
                to="/events"
                className="rounded-[12px] border-2 px-6 py-[13px] text-center text-base font-bold transition-colors hover:bg-black/5"
                style={{ borderColor: IYSF.charcoal, color: IYSF.charcoal }}
              >
                See results
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MissionStrip() {
  return (
    <section className="bg-white" style={{ borderBottom: `1px solid ${IYSF.blueLine}` }}>
      <div className="mx-auto max-w-[1100px] px-5 py-10 text-center md:px-8 md:py-12">
        <p
          className="text-[19px] leading-snug md:text-[26px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: IYSF.charcoal }}
        >
          IYSF exists to govern Yogasana as a measured sport — one rulebook, one scoring
          standard, and one competitive pathway for every national federation.
        </p>
      </div>
    </section>
  );
}

function StatStrip() {
  const stats = [
    "Founded 2013",
    "64 member federations",
    "48 countries represented",
    "16 championships held",
  ];
  return (
    <section style={{ background: IYSF.blue }}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-5 md:grid-cols-4 md:px-8">
        {stats.map((s, i) => (
          <Reveal
            key={s}
            delay={i * 90}
            className="flex min-h-20 min-w-0 items-center justify-center px-2 py-5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.08em] text-white sm:px-3 sm:text-[12px] sm:tracking-[0.12em] md:py-6 md:text-[14px] md:tracking-[0.14em]"
            style={{
              borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.25)" : undefined,
              borderTop: i > 1 ? "1px solid rgba(255,255,255,0.2)" : undefined,
            }}
          >
            <span className="block">{s}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-24">
        <Reveal>
          <div>
            <h2 className="text-[30px] md:text-[44px]" style={H2()}>
              About the federation
            </h2>
            <p className="mt-5 text-base leading-relaxed md:text-[17px]" style={{ color: "rgba(65,64,66,0.78)" }}>
              IYSF was founded in 2013 to give competitive Yogasana the same footing as any other
              judged sport: written rules, certified officials, and results that hold up to
              scrutiny. From a single international championship, the federation now oversees
              national qualifiers, continental rounds and a world final each season.
            </p>
            <p className="mt-4 text-base leading-relaxed md:text-[17px]" style={{ color: "rgba(65,64,66,0.78)" }}>
              Everything the federation does points one way — recognition of Yogasana on the
              Olympic pathway.
            </p>
            <Link
              to="/about/history"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: IYSF.magenta }}
            >
              Learn more <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={100}>
           <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { src: aboutCompetition, alt: "Athlete mid-routine at an IYSF championship" },
              { src: aboutSport, alt: "Judges scoring a competition round" },
              { src: aboutChampions, alt: "Medal ceremony at a world championship" },
              { src: aboutGovernance, alt: "Federation officials in session" },
            ].map((c) => (
              <img
                key={c.src}
                src={c.src}
                alt={c.alt}
                loading="lazy"
                width={900}
                height={700}
                 className="aspect-[3/2] h-auto w-full rounded-[12px] object-cover sm:aspect-[4/3]"
                style={{ border: `1px solid ${IYSF.blueLine}` }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MembershipCta() {
  return (
    <section style={{ background: IYSF.orange }}>
      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center md:px-8 md:py-16">
        <div>
          <h2 className="max-w-[720px] text-[26px] leading-tight md:text-[36px]" style={H2({ color: "#3A2400" })}>
            Bring Your Federation Into IYSF
          </h2>
          <p className="mt-3 max-w-[560px] text-sm md:text-base" style={{ color: "#3A2400" }}>
            Membership gives your athletes a graded route to continental and world competition,
            and your officials the certification to run it.
          </p>
        </div>
        <Link
          to="/join-us"
          className="shrink-0 rounded-[12px] px-7 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: "#414042" }}
        >
          Join us
        </Link>
      </div>
    </section>
  );
}

function WhyJoin() {
  const benefits = [
    {
      Icon: Globe2,
      title: "Global recognition",
      desc: "A path toward Olympic-linked status for your national federation.",
    },
    {
      Icon: Trophy,
      title: "Compete internationally",
      desc: "Send athletes to world and continental championships.",
    },
    {
      Icon: GraduationCap,
      title: "Access training & certification",
      desc: "IYSF Academy judge and coach certification for your federation's staff.",
    },
  ];
  const strip = [
    { src: delegation1, alt: "National delegation at an IYSF championship opening ceremony" },
    { src: delegation2, alt: "Flags of member federations inside the championship arena" },
    { src: delegation3, alt: "Federation officials at an international championship" },
    { src: event1, alt: "Championship arena during competition" },
  ];
  return (
    <section style={{ background: IYSF.blueWash }}>
      <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <h2 className="text-[30px] md:text-[44px]" style={H2()}>
            Why join IYSF
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 max-sm:mt-6 max-sm:grid-cols-2 max-sm:gap-3 md:grid-cols-3">
          {benefits.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="h-full p-4 sm:p-7" style={CARD}>
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[12px]"
                  style={{ background: "rgba(66,152,211,0.12)" }}
                >
                  <Icon size={22} color={IYSF.blue} aria-hidden="true" />
                </span>
                <h3
                  className="mt-5 text-[19px] font-bold"
                  style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(65,64,66,0.72)" }}>
                  {desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-2 gap-3 max-sm:mt-6 sm:gap-4 md:grid-cols-4">
            {strip.map((s) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                loading="lazy"
                width={720}
                height={512}
                className="aspect-[3/2] h-auto w-full rounded-[12px] object-cover sm:aspect-[4/3] md:aspect-auto md:h-36"
                style={{ border: `1px solid ${IYSF.blueLine}` }}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-medium" style={{ color: "rgba(65,64,66,0.72)" }}>
            Federations like yours are already competing under the IYSF banner.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function News() {
  const items = [
    { to: "/results", title: "World Championship delivers the largest field in IYSF history" },
    { to: "/events", title: "International judges complete the 2026 recertification cycle" },
    { to: "/events", title: "Junior division records fall at the continental qualifier" },
    { to: "/events", title: "Two new national federations sign membership agreements" },
    { to: "/events", title: "Host city shortlist announced for the next World Championship" },
  ] as const;
  return (
    <section id="news" className="bg-white">
      <div className="mx-auto max-w-[1320px] px-5 pb-20 md:px-8 md:pb-24">
        <Reveal>
          <h2 className="text-[30px] md:text-[44px]" style={H2()}>
            News
          </h2>
        </Reveal>
        <ul className="mt-6 max-w-[860px]" style={{ borderTop: `1px solid ${IYSF.blueLine}` }}>
          {items.map((n) => (
            <li key={n.title} style={{ borderBottom: `1px solid ${IYSF.blueLine}` }}>
              <Link
                to={n.to}
                className="flex items-center justify-between gap-3 py-4 text-[15px] font-bold leading-snug hover:underline md:text-[17px]"
                style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)" }}
              >
                <span className="min-w-0">{n.title}</span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0" style={{ color: IYSF.magenta }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Index() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal, background: "#fff" }}>
      <Nav />
      <main>
        <Hero />
        <Overview />
        <MissionStrip />
        <StatStrip />
        <AboutPreview />
        <WhyJoin />
        <News />
        <JoinForm />
        <MembershipCta />
      </main>
      <Footer />
    </div>
  );
}
