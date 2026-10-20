import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, Trophy, GraduationCap } from "lucide-react";
import { Nav, Footer, IYSF } from "../components/site-chrome";
import { JoinForm } from "../components/join-form";
import { Reveal } from "../components/history-motion";
import heroChampionship from "../assets/hero-championship.jpg";
import { listPublishedPosts } from "@/lib/cms.functions";
import { fmtDate } from "../components/news-article";
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
  loader: async () => {
    try {
      const res = (await Promise.race([
        listPublishedPosts({ data: { limit: 5, offset: 0 } }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000)),
      ])) as { posts?: any[] };
      return { news: res?.posts ?? [] };
    } catch {
      return { news: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "IYSF — International Yoga Sports Federation" },
      {
        name: "description",
        content:
          "IYSF is the global governing body for Yogasana sport: 64 member federations, world championships, judge certification, working toward wider international recognition for Yogasana as a sport.",
      },
      { property: "og:title", content: "IYSF — International Yoga Sports Federation" },
      {
        property: "og:description",
        content: "64 member federations. Is yours one of them? Join the global governing body for Yogasana sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", as: "image", href: heroChampionship },
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
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden" style={{ background: IYSF.charcoal }}>
      {/* Responsive hero image: object-cover, top-center positioning so athletes remain visible across mobile/landscape */}
      <img
        src={heroChampionship}
        width={1280}
        height={646}
        fetchPriority="high"
        decoding="async"
        alt="17th World Yogasana Championship — Marina di Camerota, Italy, December 4–6, 2026"
        className="block aspect-[1280/646] w-full bg-white object-cover object-top max-h-[50svh] sm:max-h-[60svh] md:max-h-[72svh] md:object-center"
      />
      {/* Gradient overlay for text contrast */}
      <div style={{ background: `linear-gradient(180deg, rgba(43,42,44,0) 0%, ${IYSF.charcoal} 100%)`, position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true" />
      <div style={{ background: `linear-gradient(180deg, #2b2a2c 0%, ${IYSF.charcoal} 100%)` }}>
        <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-14">
          <h1
            id="hero-title"
            className="text-3xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}
          >
            A practice, judged as a sport.
          </h1>
          <p className="mt-3 max-w-[560px] text-base font-medium text-white/90 md:text-xl">
            64 member federations. Is yours one of them?
          </p>
          {/* CTAs: stacked full-width on mobile, inline from sm up */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/"
              hash="join"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] px-5 py-3 text-base font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:w-auto sm:justify-start"
              style={{ background: IYSF.orange, color: "#3A2400" }}
            >
              Join a federation
            </Link>
            <Link
              to="/results"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] border-2 border-white px-5 py-[10px] text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              See results
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionStrip() {
  return (
    <section className="bg-white" style={{ borderBottom: `1px solid ${IYSF.blueLine}` }}>
      <div className="mx-auto max-w-[1100px] px-4 py-10 text-center sm:px-5 md:px-8 md:py-12">
        <p
          className="text-[18px] leading-snug sm:text-[22px] md:text-[26px]"
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
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-4 sm:px-5 md:grid-cols-4 md:px-8">
        {stats.map((s, i) => (
          <Reveal
            key={s}
            delay={i * 90}
            className={`flex min-h-16 min-w-0 items-center justify-center px-3 py-4 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-white sm:min-h-20 sm:py-5 sm:text-xs sm:tracking-[0.12em] md:min-h-[unset] md:py-6 md:text-sm md:tracking-[0.14em] ${
              i % 2 === 1 ? "border-l border-white/25" : ""
            } ${
              i >= 2 ? "border-t border-white/20 md:border-t-0" : ""
            } ${
              i > 0 ? "md:border-l md:border-white/25" : "md:border-l-0"
            }`}
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
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-4 py-12 sm:px-5 sm:py-16 md:grid-cols-2 md:px-8 md:py-24 lg:gap-16">
        <Reveal>
          <div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px]" style={H2()}>
              About the federation
            </h2>
            <p className="mt-4 text-base leading-relaxed md:text-[17px]" style={{ color: "rgba(65,64,66,0.78)" }}>
              IYSF was founded in 2013 to give competitive Yogasana the same footing as any other
              judged sport: written rules, certified officials, and results that hold up to
              scrutiny. From a single international championship, the federation now oversees
              national qualifiers, continental rounds and a world final each season.
            </p>
            <p className="mt-4 text-base leading-relaxed md:text-[17px]" style={{ color: "rgba(65,64,66,0.78)" }}>
              The federation is working toward wider international recognition for Yogasana
              as a sport.
            </p>
            <Link
              to="/about/history"
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold"
              style={{ color: IYSF.magenta }}
            >
              Learn more <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* 2-column image grid with consistent aspect ratio, lazy loading, and explicit dimensions */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { src: aboutCompetition, alt: "Athlete mid-routine at an IYSF championship" },
              { src: aboutSport, alt: "Judges scoring a competition round" },
              { src: aboutChampions, alt: "Medal ceremony at a world championship" },
              { src: aboutGovernance, alt: "Federation officials in session" },
            ].map((c) => (
              <figure key={c.src} className="min-w-0">
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={675}
                  className="aspect-[4/3] h-auto w-full rounded-[12px] object-cover"
                  style={{ border: `1px solid ${IYSF.blueLine}` }}
                />
                <figcaption className="mt-1.5 text-xs leading-snug" style={{ color: IYSF.charcoal }}>{c.alt}</figcaption>
              </figure>
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
      <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 px-4 py-12 text-center sm:px-5 md:flex-row md:items-center md:px-8 md:py-16 md:text-left">
        <div>
          <h2 className="max-w-[720px] text-[24px] leading-tight sm:text-[30px] md:text-[36px]" style={H2({ color: "#3A2400" })}>
            Bring Your Federation Into IYSF
          </h2>
          <p className="mt-3 max-w-[560px] text-sm md:text-base" style={{ color: "#3A2400" }}>
            Membership gives your athletes a graded route to continental and world competition,
            and your officials the certification to run it.
          </p>
        </div>
        <Link
          to="/"
          hash="join"
          className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center rounded-[12px] px-7 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:w-auto"
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
      desc: "Your national federation joins the international body governing Yogasana as a sport.",
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
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 className="text-[28px] sm:text-[36px] md:text-[44px]" style={H2()}>
            Why join IYSF
          </h2>
        </Reveal>
        {/* Single column on mobile, 3 cols from md */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-3 md:gap-6">
          {benefits.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="h-full p-5 sm:p-7" style={CARD}>
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] sm:h-12 sm:w-12"
                  style={{ background: "rgba(66,152,211,0.12)" }}
                >
                  <Icon size={22} color={IYSF.blue} aria-hidden="true" />
                </span>
                <h3
                  className="mt-4 text-base font-bold leading-tight sm:mt-5 sm:text-[19px]"
                  style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(65,64,66,0.72)" }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          {/* Horizontal snap-scroll on mobile; 2-col grid on sm; 4-col on md */}
          <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible md:grid-cols-4">
            {strip.map((s) => (
              <figure key={s.src} className="w-[78vw] max-w-[280px] shrink-0 snap-start sm:w-auto">
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={540}
                  className="aspect-[4/3] h-auto w-full rounded-[12px] object-cover"
                  style={{ border: `1px solid ${IYSF.blueLine}` }}
                />
                <figcaption className="mt-1.5 text-xs leading-snug" style={{ color: IYSF.charcoal }}>{s.alt}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-medium" style={{ color: "rgba(65,64,66,0.72)" }}>
            Delegations from member federations at past IYSF championships.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function News() {
  const { news } = Route.useLoaderData();
  return (
    <section id="news" className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-12 sm:px-5 sm:pb-16 sm:pt-12 md:px-8 md:pb-24">
        <Reveal>
          <h2 className="text-[28px] sm:text-[36px] md:text-[44px]" style={H2()}>
            News
          </h2>
        </Reveal>
        <ul className="mt-6 max-w-[860px]" style={{ borderTop: `1px solid ${IYSF.blueLine}` }}>
          {news.length === 0 && <li className="py-4 text-sm">No news published yet.</li>}
          {news.map((n) => (
            <li key={n.id} style={{ borderBottom: `1px solid ${IYSF.blueLine}` }}>
              <Link
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="flex min-h-[52px] items-center justify-between gap-3 py-4 text-[15px] font-bold leading-snug hover:underline md:text-[17px]"
                style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)" }}
              >
                <span className="min-w-0 break-words">
                  <time dateTime={n.published_at ?? undefined} className="block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: IYSF.blue, fontFamily: "var(--font-sans)" }}>
                    {fmtDate(n.published_at)}
                  </time>
                  {n.title}
                </span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0" style={{ color: IYSF.magenta }} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/news" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold hover:underline" style={{ color: IYSF.magenta }}>
          View all news <ArrowRight size={16} aria-hidden="true" />
        </Link>
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
