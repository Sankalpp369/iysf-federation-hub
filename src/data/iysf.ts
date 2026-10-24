
import eventData from "./events.json";

export type Region =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export type Tier =
  | "World Championship"
  | "Continental Qualifier"
  | "Junior Circuit"
  | "Academy Camp";

export type MembershipStatus = "Full Member" | "Provisional" | "Observer";

export type Division = "Junior" | "Adult" | "Masters";

export const REGIONS: (Region | "All")[] = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

export const DIVISIONS: Division[] = ["Junior", "Adult", "Masters"];

export const TIER_COLOR: Record<Tier, string> = {
  "World Championship": "#DE007A",
  "Continental Qualifier": "#4298D3",
  "Junior Circuit": "#FAAF40",
  "Academy Camp": "#414042",
};

export const STATUS_COLOR: Record<MembershipStatus, string> = {
  "Full Member": "#4298D3",
  Provisional: "#FAAF40",
  Observer: "#DE007A",
};

export type Federation = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: Region;
  status: MembershipStatus;
  president: string;
  joined: string;
  website: string | null;
  athletes: string;
  judges: string;
  coaches: string;
  summary: string;
  lat: number;
  lng: number;
};

export const FEDERATIONS: Federation[] = [
  {
    id: "f1",
    slug: "federation-placeholder-1",
    name: "Federation Name Placeholder 1",
    country: "Country Placeholder A",
    region: "Europe",
    status: "Full Member",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — the national governing body for competitive Yogasana in its territory, responsible for domestic selection and athlete licensing.",
    lat: 48.85,
    lng: 2.35,
  },
  {
    id: "f2",
    slug: "federation-placeholder-2",
    name: "Federation Name Placeholder 2",
    country: "Country Placeholder B",
    region: "Asia",
    status: "Full Member",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — runs national championships and nominates athletes to IYSF continental and world tiers.",
    lat: 28.61,
    lng: 77.21,
  },
  {
    id: "f3",
    slug: "federation-placeholder-3",
    name: "Federation Name Placeholder 3",
    country: "Country Placeholder C",
    region: "North America",
    status: "Provisional",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — currently in the provisional membership period while governance and safeguarding standards are ratified.",
    lat: 40.71,
    lng: -74.0,
  },
  {
    id: "f4",
    slug: "federation-placeholder-4",
    name: "Federation Name Placeholder 4",
    country: "Country Placeholder D",
    region: "Oceania",
    status: "Observer",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — observer status, attending IYSF congresses without voting rights while building a domestic competition structure.",
    lat: -33.87,
    lng: 151.21,
  },
  {
    id: "f5",
    slug: "federation-placeholder-5",
    name: "Federation Name Placeholder 5",
    country: "Country Placeholder E",
    region: "Africa",
    status: "Provisional",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — provisional member developing judge certification capacity with the IYSF Academy.",
    lat: -1.29,
    lng: 36.82,
  },
  {
    id: "f6",
    slug: "federation-placeholder-6",
    name: "Federation Name Placeholder 6",
    country: "Country Placeholder F",
    region: "South America",
    status: "Full Member",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — full member with voting rights at the IYSF congress and a continental qualifier hosting record.",
    lat: -23.55,
    lng: -46.63,
  },
  {
    id: "f7",
    slug: "federation-placeholder-7",
    name: "Federation Name Placeholder 7",
    country: "Country Placeholder G",
    region: "Asia",
    status: "Observer",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — observer federation attending IYSF technical seminars ahead of a full application.",
    lat: 35.68,
    lng: 139.69,
  },
  {
    id: "f8",
    slug: "federation-placeholder-8",
    name: "Federation Name Placeholder 8",
    country: "Country Placeholder H",
    region: "Europe",
    status: "Provisional",
    president: "President name placeholder",
    joined: "————",
    website: null,
    athletes: "——",
    judges: "——",
    coaches: "——",
    summary:
      "Placeholder profile copy — provisional member hosting junior circuit rounds while completing ratification.",
    lat: 52.52,
    lng: 13.4,
  },
];

export type ScheduleItem = { day: string; label: string; detail: string };

export type Standing = {
  rank: number;
  athlete: string;
  federationId: string;
  score: string;
};

export type EventRecord = {
  id: string;
  slug: string;
  name: string;
  tier: Tier;
  region: Region;
  status: "upcoming" | "past";
  date: string;
  dateISO: string;
  startDate?: string;
  endDate?: string;
  endDateISO?: string;
  approx?: boolean;
  type?: "Competition";
  edition?: string;
  countryCode?: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  year: string;
  venue: string;
  location: string;
  lat: number;
  lng: number;
  hostFederationId: string | null;
  divisions: Division[];
  summary?: string;
  schedule?: ScheduleItem[];
  results?: Partial<Record<Division, Standing[]>>;
};

type ChampionshipSource = {
  id: number;
  slug: string;
  name: string;
  edition: string;
  type: "Competition";
  startDate: string;
  endDate: string;
  approx: boolean;
  countryCode: string;
  countryName: string;
  year: number;
  location: string;
  latitude: number;
  longitude: number;
};

const championshipSource = eventData.find(
  (record) => (record as { edition?: string }).edition === "17th",
) as ChampionshipSource | undefined;

if (!championshipSource) {
  throw new Error("The 17th World Yogasana Championship record is missing from events.json.");
}

function formatEventDate(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${(endDate || startDate)}T00:00:00Z`);
  const month = new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(start);
  const endMonth = new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(end);
  if (month === endMonth && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }
  const fmt = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return !endDate || startDate === endDate ? fmt.format(start) : `${fmt.format(start)} – ${fmt.format(end)}`;
}

export const WORLD_CHAMPIONSHIP_2026: EventRecord = {
  id: String(championshipSource.id),
  slug: championshipSource.slug,
  name: championshipSource.name,
  edition: championshipSource.edition,
  type: championshipSource.type,
  approx: championshipSource.approx,
  tier: "World Championship",
  region: "Europe",
  status: "upcoming",
  date: formatEventDate(championshipSource.startDate, championshipSource.endDate),
  dateISO: championshipSource.startDate,
  startDate: championshipSource.startDate,
  endDate: championshipSource.endDate,
  endDateISO: championshipSource.endDate,
  countryCode: championshipSource.countryCode,
  countryName: championshipSource.countryName,
  year: String(championshipSource.year),
  venue: championshipSource.location,
  location: championshipSource.location,
  latitude: championshipSource.latitude,
  longitude: championshipSource.longitude,
  lat: championshipSource.latitude,
  lng: championshipSource.longitude,
  hostFederationId: null,
  divisions: ["Junior", "Adult", "Masters"],
};

const UPCOMING_EVENTS: EventRecord[] = [WORLD_CHAMPIONSHIP_2026];
const PAST_EVENTS: EventRecord[] = [
  {
    id: "p2025",
    slug: "world-championship-2025-cyberjaya",
    name: "IYSF World Championship 2025 — Cyberjaya",
    tier: "World Championship",
    region: "Asia",
    status: "past",
    date: "2025",
    dateISO: "2025-01-01",
    countryCode: "MY",
    year: "2025",
    venue: "",
    location: "Cyberjaya, Malaysia",
    lat: 2.92,
    lng: 101.65,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2022",
    slug: "world-championship-2022-bengaluru",
    name: "IYSF World Championship 2022 — Bengaluru",
    tier: "World Championship",
    region: "Asia",
    status: "past",
    date: "2022",
    dateISO: "2022-01-01",
    countryCode: "IN",
    year: "2022",
    venue: "",
    location: "Bengaluru, India",
    lat: 12.97,
    lng: 77.59,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2021",
    slug: "world-championship-2021-online",
    name: "IYSF World Championship 2021 — Online Edition",
    tier: "World Championship",
    region: "Europe",
    status: "past",
    date: "2021",
    dateISO: "2021-01-01",
    countryCode: "INT",
    year: "2021",
    venue: "Remote — video submission",
    location: "Online edition, during COVID-19",
    lat: 46.52,
    lng: 6.63,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2018",
    slug: "world-championship-2018-beijing",
    name: "IYSF World Championship 2018 — Beijing",
    tier: "World Championship",
    region: "Asia",
    status: "past",
    date: "2018",
    dateISO: "2018-01-01",
    countryCode: "CN",
    year: "2018",
    venue: "",
    location: "Beijing, China",
    lat: 39.9,
    lng: 116.4,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2016",
    slug: "world-championship-2016-pordenone",
    name: "IYSF World Championship 2016 — Pordenone",
    tier: "World Championship",
    region: "Europe",
    status: "past",
    date: "2016",
    dateISO: "2016-01-01",
    countryCode: "IT",
    year: "2016",
    venue: "",
    location: "Pordenone, Italy",
    lat: 45.96,
    lng: 12.66,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2014",
    slug: "world-championship-2014-london",
    name: "IYSF World Championship 2014 — London",
    tier: "World Championship",
    region: "Europe",
    status: "past",
    date: "2014",
    dateISO: "2014-01-01",
    countryCode: "GB",
    year: "2014",
    venue: "",
    location: "London, United Kingdom",
    lat: 51.51,
    lng: -0.13,
    hostFederationId: null,
    divisions: ["Junior", "Adult", "Masters"],
  },
  {
    id: "p2003",
    slug: "ghosh-cup-2003-2013",
    name: "Annual Ghosh Cup — 2003 to 2013",
    tier: "World Championship",
    region: "North America",
    status: "past",
    date: "2003–2013",
    dateISO: "2003-01-01",
    endDateISO: "2013-12-31",
    countryCode: "US",
    year: "2003–2013",
    venue: "Los Angeles, USA",
    location: "Los Angeles, United States",
    lat: 34.05,
    lng: -118.24,
    hostFederationId: null,
    divisions: ["Adult"],
  },
];

export const EVENTS: EventRecord[] = [...UPCOMING_EVENTS, ...PAST_EVENTS];

export const upcomingEvents = () => EVENTS.filter((e) => e.status === "upcoming");
export const pastEvents = () =>
  EVENTS.filter((e) => e.status === "past").sort((a, b) =>
    b.dateISO.localeCompare(a.dateISO)
  );

export const getEvent = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const getEventById = (id: string) => EVENTS.find((e) => e.id === id);
export const getFederation = (slug: string) =>
  FEDERATIONS.find((f) => f.slug === slug);
export const getFederationById = (id: string | null) =>
  id ? FEDERATIONS.find((f) => f.id === id) : undefined;

export function eventsForFederation(federationId: string) {
  const hosted = EVENTS.filter((e) => e.hostFederationId === federationId);
  const competed = EVENTS.filter(
    (e) =>
      e.hostFederationId !== federationId &&
      e.results &&
      Object.values(e.results).some((rows) =>
        (rows ?? []).some((r) => r.federationId === federationId)
      )
  );
  return { hosted, competed };
}

export function federationsInEvent(event: EventRecord): Federation[] {
  const ids = new Set<string>();
  if (event.hostFederationId) ids.add(event.hostFederationId);
  Object.values(event.results ?? {}).forEach((rows) =>
    (rows ?? []).forEach((r) => ids.add(r.federationId))
  );
  return [...ids]
    .map((id) => getFederationById(id))
    .filter((f): f is Federation => Boolean(f));
}

export function relatedEvents(event: EventRecord, limit = 3) {
  return EVENTS.filter(
    (e) =>
      e.id !== event.id && (e.region === event.region || e.tier === event.tier)
  ).slice(0, limit);
}

export const eventsWithResults = () => pastEvents().filter((e) => e.results);
