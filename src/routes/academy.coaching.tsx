import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/site-chrome";
import {
  TrackHeader,
  TiersGrid,
  GuidesList,
  SupportingContent,
  ClosingCta,
} from "../components/academy-shared";

export const Route = createFileRoute("/academy/coaching")({
  head: () => ({
    meta: [
      { title: "Coaching — IYSF Academy" },
      {
        name: "description",
        content:
          "Coaching curriculum and certification tiers for coaches supporting IYSF athletes.",
      },
      { property: "og:title", content: "Coaching — IYSF Academy" },
      {
        property: "og:description",
        content: "Curriculum and certification tiers for IYSF coaches.",
      },
    ],
  }),
  component: CoachingTrack,
});

const COLOR = "#DE007A";

const TIERS = [
  {
    name: "International (A-Level)",
    desc: "Certified directly by IYSF. Existing World Yoga Champions qualify directly and for free; everyone else needs IYSF training plus a national federation recommendation. Includes a 2-year IYSF membership. Every federation needs an A-level Head Coach as liaison, and A-level coaches become official IYSF ambassadors who may open IYSF Yoga Sport Academies.",
  },
  {
    name: "National (B-Level)",
    desc: "Trained and certified by the national federation.",
  },
  {
    name: "Local/Regional (C-Level)",
    desc: "Trained and certified by the national federation.",
  },
];

const GUIDES = [
  { title: "Coaching Curriculum Guide", desc: "The IYSF coaching syllabus across all tiers.", pdf: "/documents/academy/coaching/coaching-curriculum-guide.pdf" },
  { title: "Session Planning Handbook", desc: "Reference structure for training programs.", pdf: "/documents/academy/coaching/session-planning-handbook.pdf" },
  { title: "Athlete Welfare Standards", desc: "Baseline duty-of-care expectations for coaches.", pdf: "/documents/academy/coaching/athlete-welfare-standards.pdf" },
  { title: "Recertification Handbook", desc: "Requirements and cycle for maintaining status.", pdf: "/documents/academy/coaching/recertification-handbook.pdf" },
];

function CoachingTrack() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <TrackHeader
        track="Coaching"
        color={COLOR}
        heading="Coaching"
        sub="Curriculum and certification tiers for coaches supporting IYSF athletes."
      />
      <TiersGrid tiers={TIERS} color={COLOR} note="Certified coaches may not also serve as a judge." />
      <GuidesList guides={GUIDES} color={COLOR} track="Coaching" />
      <SupportingContent track="Coaching" color={COLOR} />
      <ClosingCta
        track="Coaching"
        color={COLOR}
        primaryLabel="Download Coaching Guide PDF"
        primaryHref="/documents/academy/coaching/coaching-curriculum-guide.pdf"
        relatedTo="/rules"
        relatedLabel="Rules & regulations"
      />
      <Footer />
    </div>
  );
}