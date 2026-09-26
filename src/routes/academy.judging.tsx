import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/site-chrome";
import {
  TrackHeader,
  TiersGrid,
  GuidesList,
  SupportingContent,
  ClosingCta,
} from "../components/academy-shared";

export const Route = createFileRoute("/academy/judging")({
  head: () => ({
    meta: [
      { title: "Judging — IYSF Academy" },
      {
        name: "description",
        content:
          "Judging certification standards, scoring rubrics, and guides for IYSF-registered officials.",
      },
      { property: "og:title", content: "Judging — IYSF Academy" },
      {
        property: "og:description",
        content: "Judging certification standards and scoring rubrics for IYSF officials.",
      },
    ],
  }),
  component: JudgingTrack,
});

const COLOR = "#4298D3";

const TIERS = [
  {
    name: "International (A-Level)",
    desc: "Certified directly by IYSF and includes a 2-year IYSF membership ($50). Recommended for world championships and continental cups. Every national federation must have at least one A-level judge as liaison and Head Judge, and all A-level judges are listed on the IYSF website.",
  },
  {
    name: "National (B-Level)",
    desc: "Trained and certified by the national federation. Judges national championships.",
  },
  {
    name: "Local/Regional (C-Level)",
    desc: "Trained and certified by the national federation. Judges regional and local events.",
  },
];

const GUIDES = [
  { title: "Judging Standards Guide", desc: "The complete framework used across IYSF events.", pdf: "/documents/academy/judging/judging-standards-guide.pdf" },
  { title: "Scoring Rubric", desc: "Reference rubric for pose difficulty, execution, and form.", pdf: "/documents/academy/judging/scoring-rubric.pdf" },
  { title: "Officiating Protocol", desc: "Conduct and procedure at sanctioned competitions.", pdf: "/documents/academy/judging/officiating-protocol.pdf" },
  { title: "Recertification Handbook", desc: "Requirements and cycle for maintaining status.", pdf: "/documents/academy/judging/recertification-handbook.pdf" },
];

function JudgingTrack() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <TrackHeader
        track="Judging"
        color={COLOR}
        heading="Judging"
        sub="Certification standards, scoring rubrics, and officiating protocol for IYSF judges."
      />
      <TiersGrid
        tiers={TIERS}
        color={COLOR}
        note="A judge cannot officiate a competition involving a relative. Certified judges may not also serve as a coach."
      />
      <GuidesList guides={GUIDES} color={COLOR} track="Judging" />
      <SupportingContent track="Judging" color={COLOR} />
      <ClosingCta
        track="Judging"
        color={COLOR}
        primaryLabel="Download Judging Guide PDF"
        primaryHref="/documents/academy/judging/judging-standards-guide.pdf"
        relatedTo="/rules"
        relatedLabel="Judging criteria in the rulebook"
      />
      <Footer />
    </div>
  );
}