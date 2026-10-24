import { countryThemes } from "@/data/country-themes";
import { countryCodeByName, countryCoordinates } from "@/data/country-coordinates";
import type { EventRecord, Federation } from "@/data/iysf";
import type { MapPin } from "@/components/events-map";

export function flagForCountry(code?: string) {
  if (!code || code === "INT" || code === "NORDIC") return "🌐";
  if (!/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => char.charCodeAt(0) + 127397));
}

export function mapAccent(code?: string, fallback = "#4298D3") {
  return code ? (countryThemes[code]?.accent ?? fallback) : fallback;
}

function coords(latitude?: number, longitude?: number, countryCode?: string) {
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return [latitude as number, longitude as number] as const;
  }
  return countryCode ? countryCoordinates[countryCode] : undefined;
}

function warnUnmapped(id: string) {
  console.warn(`[map] Record ${id} has no verifiable coordinates and was not pinned.`);
}

export function eventToMapPin(event: EventRecord): MapPin | null {
  if (event.countryCode === "INT") return null;
  const point = event.countryCode === "NORDIC"
    ? countryCoordinates.NORDIC
    : coords(event.latitude ?? event.lat, event.longitude ?? event.lng, event.countryCode);
  if (!point) {
    warnUnmapped(event.id);
    return null;
  }
  return {
    id: event.id,
    name: event.name,
    country: [event.location, event.countryName].filter(Boolean).join(", "),
    flag: flagForCountry(event.countryCode),
    date: event.date,
    href: `/events/${event.slug}`,
    lat: point[0],
    lng: point[1],
    accent: mapAccent(event.countryCode),
    kind: event.tier,
  };
}

export function federationToMapPin(federation: Federation): MapPin | null {
  const code = countryCodeByName[federation.country];
  if (/placeholder|unknown/i.test(`${federation.country} ${federation.name}`) || federation.country === "International") {
    warnUnmapped(federation.id);
    return null;
  }
  const exact = Number.isFinite(federation.lat) && Number.isFinite(federation.lng)
    ? [federation.lat, federation.lng] as const
    : undefined;
  const point = code === "NORDIC" ? countryCoordinates.NORDIC : exact ?? (code ? countryCoordinates[code] : undefined);
  if (!point) {
    warnUnmapped(federation.id);
    return null;
  }
  return {
    id: federation.id,
    name: federation.name,
    country: federation.country,
    flag: flagForCountry(code),
    href: `/directory/${federation.slug}`,
    lat: point[0],
    lng: point[1],
    accent: mapAccent(code),
    kind: federation.status,
  };
}

export function eventCountryCode(event: EventRecord) {
  if (event.countryCode) return event.countryCode;
  const text = `${event.location} ${event.venue}`.toLowerCase();
  const match = Object.entries(countryCodeByName).find(([name]) => text.includes(name.toLowerCase()));
  return match?.[1];
}
