import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose, InfoCard, PhotoPlaceholder } from "../components/page-shell";
import { IYSF } from "../components/site-chrome";

export const Route = createFileRoute("/about/executive-committee")({
  head: () => ({
    meta: [
      { title: "Executive Committee — IYSF Leadership" },
      {
        name: "description",
        content:
          "The elected officers of the International Yoga Sports Federation, responsible for championship oversight and the federation's Olympic-track ambition.",
      },
      { property: "og:title", content: "Executive Committee — IYSF" },
      {
        property: "og:description",
        content: "Elected officers leading the International Yoga Sports Federation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExecutiveCommitteePage,
});

const OFFICERS = [
  {
    name: "Rajashree Choudhury",
    role: "President (USA)",
    accent: IYSF.orange,
    bio: "IYSF's founding President, Rajashree has led the federation since its establishment in 2013, with re-elections in 2020 and 2022. A five-time national yoga champion in her home country of India before relocating to the US, she has spent decades shaping competitive yoga āsana into the structured sport it is today.",
  },
  {
    name: "Mritunjay Kumar Pandey",
    role: "Secretary General (India)",
    accent: IYSF.blue,
    bio: "A lawyer with a background in banking, Mritunjay brings legal and financial expertise to the federation alongside experience in event organization and public relations.",
  },
  {
    name: "Christian Scaraglino",
    role: "Vice-President (Sweden)",
    accent: IYSF.magenta,
    bio: "A senior yoga teacher with over two decades of teaching experience across Europe and the US, Christian also serves as President of the Swedish Yoga Sports Federation and holds international (A-level) judging certification.",
  },
  {
    name: "Umang Dawn",
    role: "Vice-President (India)",
    accent: IYSF.blue,
    bio: "An eight-time national gold medalist and former captain of the Indian yoga team, Umang holds an MBA in Sports Management and has served on IYSF's Executive Committee since 2014, re-elected in 2018 and 2023.",
  },
  {
    name: "Adrian Alarcon",
    role: "Vice-President (Mexico)",
    accent: IYSF.magenta,
    bio: "President of the Mexican Yoga Sports Federation, Adrian combines a background in communications and media with certified international judging credentials, and has emceed several IYSF championship events.",
  },
];

const HONORARY = [
  ["Sebastien Bonnet", "France", "Treasurer (2016–2018), Secretary General (2018–2022)"],
  ["Ainslie Faust", "USA", "Treasurer (2018–2022)"],
  ["Iveta Kalnina", "Latvia", "Vice-President (2018–2022)"],
  ["Tereza Bonnet-Šenková", "Czech Republic", "Head of Technical Committee (2014–2022)"],
  ["Roberto Vanin", "Italy", "Vice-President (2016–2018)"],
  ["Trine Zafina Søndergaard", "Denmark", "Treasurer (2013–2016)"],
  ["Raj Bhasvar", "USA", "Secretary General (2013–2018)"],
];

function ExecutiveCommitteePage() {
  return (
    <PageShell>
      <PageHeader
        kicker="About — Executive Committee"
        title="Executive Committee"
        sub="Responsible for the federation's overall direction, from championship oversight to the ongoing pursuit of Olympic-track recognition."
      />

      <Section>
        <Prose>
          <p>
            IYSF's Executive Committee is responsible for the federation's overall direction, from
            championship oversight to the ongoing pursuit of Olympic-track recognition. Members are
            elected by the federation's membership and serve fixed terms.
          </p>
        </Prose>
        <ul className="mt-8 grid gap-5 max-sm:mt-6 max-sm:grid-cols-2 max-sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
          {OFFICERS.map((o) => (
            <li key={o.name}>
              <InfoCard title={o.name} meta={o.role} accent={o.accent} photo>
                {o.bio}
              </InfoCard>
            </li>
          ))}
        </ul>

      </Section>

      <Section heading="Honorary members" tint>
        <div
          className="overflow-x-auto rounded-[12px] border bg-white"
          style={{ borderColor: IYSF.blueLine }}
        >
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">IYSF honorary members and their past roles</caption>
            <thead>
              <tr style={{ background: IYSF.blueWash }}>
                {["", "Name", "Country", "Past role"].map((h, i) => (
                  <th
                    key={h || `col-${i}`}
                    scope="col"
                    className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: IYSF.charcoal }}
                  >
                    {h || <span className="sr-only">Portrait</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HONORARY.map(([name, country, role]) => (
                <tr key={name} style={{ borderTop: `1px solid ${IYSF.blueLine}` }}>
                  <td className="py-3.5 pl-5 pr-0">
                    <PhotoPlaceholder name={name} size="sm" />
                  </td>
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-left font-semibold"
                    style={{ color: "#414042" }}
                  >
                    {name}
                  </th>
                  <td className="px-5 py-3.5" style={{ color: IYSF.charcoal }}>
                    {country}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: IYSF.charcoal }}>
                    {role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </Section>
    </PageShell>
  );
}