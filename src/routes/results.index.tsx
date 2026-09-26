import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";
import { Nav, Footer, IYSF } from "../components/site-chrome";

export const Route = createFileRoute("/results/")({
  head: () => ({
    meta: [
      { title: "Championship Results — Coming Soon | IYSF" },
      {
        name: "description",
        content:
          "Full standings and medal results from IYSF championships are being prepared for publication.",
      },
      { property: "og:title", content: "Championship Results — IYSF" },
      {
        property: "og:description",
        content: "Standings and medal results from IYSF championships are coming soon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsComingSoon,
});

const EDITIONS = [
  ["2025", "Cyberjaya"],
  ["2022", "Bengaluru"],
  ["2021", "Online"],
  ["2018", "Beijing"],
  ["2016", "Pordenone"],
  ["2014", "London"],
  ["2003–2013", "Ghosh Cup"],
];

function ResultsComingSoon() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: IYSF.charcoal, background: "#fff" }}>
      <Nav />
      <main>
        <section style={{ background: IYSF.blueWash }}>
          <div className="mx-auto max-w-[1100px] px-5 py-20 md:px-8 md:py-28">
            <div
              className="rounded-[20px] border-2 bg-white p-8 md:p-12"
              style={{ borderColor: IYSF.blue, boxShadow: "0 24px 60px -32px rgba(66,152,211,0.55)" }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
                style={{ background: IYSF.magenta }}
              >
                <Trophy size={13} aria-hidden="true" /> Coming soon
              </span>
              <h1
                className="mt-5 text-[38px] leading-[1.03] tracking-[-0.02em] md:text-[60px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}
              >
                Championship Results
              </h1>
              <p className="mt-5 max-w-[640px] text-base leading-relaxed md:text-[17px]">
                Full standings and medal results from IYSF championships are being prepared for
                publication here. In the meantime, browse past championship editions on the calendar.
              </p>
              <Link
                to="/events"
                className="mt-8 inline-flex items-center gap-2 rounded-[12px] px-6 py-3 text-base font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: IYSF.blue }}
              >
                Browse the calendar <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12">
              <h2
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: IYSF.blue }}
              >
                Past championship editions
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {EDITIONS.map(([year, place]) => (
                  <li
                    key={year}
                    className="rounded-[12px] border bg-white px-4 py-3"
                    style={{ borderColor: IYSF.blueLine }}
                  >
                    <div className="text-sm" style={{ fontFamily: "var(--font-mono)", color: IYSF.magenta }}>
                      {year}
                    </div>
                    <div className="mt-0.5 font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {place}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
