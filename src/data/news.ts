export type NewsItem = { slug: string; date: string; title: string; summary: string };

export const NEWS: NewsItem[] = [
  {
    slug: "world-championship-largest-field",
    date: "2026-09-18",
    title: "World Championship delivers the largest field in IYSF history",
    summary: "Full article coming soon. Details will be published once results are verified.",
  },
  {
    slug: "judges-complete-2026-recertification",
    date: "2026-08-27",
    title: "International judges complete the 2026 recertification cycle",
    summary: "Full article coming soon. The IYSF Academy will publish the list of recertified judges.",
  },
  {
    slug: "junior-division-records-continental-qualifier",
    date: "2026-07-14",
    title: "Junior division records fall at the continental qualifier",
    summary: "Full article coming soon. Scores will be published after official review.",
  },
  {
    slug: "two-new-federations-sign-membership",
    date: "2026-06-02",
    title: "Two new national federations sign membership agreements",
    summary: "Full article coming soon. Federation names will be announced after ratification.",
  },
  {
    slug: "host-city-shortlist-next-world-championship",
    date: "2026-05-10",
    title: "Host city shortlist announced for the next World Championship",
    summary: "Full article coming soon.",
  },
];

export const formatNewsDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
