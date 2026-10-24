import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cartoMapConfig } from "@/lib/map-config";

export type MapPin = {
  id: string;
  name: string;
  country: string;
  flag: string;
  date?: string;
  href?: string;
  lat: number;
  lng: number;
  accent: string;
  kind?: string;
};

type Props = {
  pins: MapPin[];
  selectedId?: string | null;
  highlightedId?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  label: string;
};

type PinCluster = { id: string; pins: MapPin[]; lat: number; lng: number };

function isValidPin(pin: MapPin) {
  return Number.isFinite(pin.lat) && Number.isFinite(pin.lng) &&
    pin.lat >= -90 && pin.lat <= 90 && pin.lng >= -180 && pin.lng <= 180;
}

function makePinIcon(pin: MapPin, count: number, highlighted: boolean) {
  const color = /^#[\da-f]{6}$/i.test(pin.accent) ? pin.accent : "#4298D3";
  const size = highlighted ? 34 : 28;
  return L.divIcon({
    className: "iysf-map-pin-icon",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border:3px solid #fff;border-radius:50% 50% 50% 0;background:${color};color:#fff;transform:rotate(-45deg);box-shadow:0 2px 8px #0005;font:700 12px var(--font-sans);"><span style="transform:rotate(45deg)">${count > 1 ? count : ""}</span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function BoundsController({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) {
      map.setView([20, 0], 2, { animate: false });
    } else if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 4, { animate: true });
    } else {
      const bounds: LatLngBoundsExpression = pins.map((pin) => [pin.lat, pin.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 6 });
    }
  }, [map, pins]);
  return null;
}

function ClusterMarkers({
  pins,
  selectedId,
  highlightedId,
  onSelect,
  onHover,
}: Omit<Props, "label">) {
  const map = useMap();
  const [revision, setRevision] = useState(0);

  useMapEvents({
    zoomend: () => setRevision((v) => v + 1),
    moveend: () => setRevision((v) => v + 1),
  });

  const clusters = useMemo(() => {
    void revision;
    const remaining = new Set(pins.map((_, i) => i));
    const result: PinCluster[] = [];
    while (remaining.size) {
      const first = remaining.values().next().value as number;
      remaining.delete(first);
      const members = [pins[first]];
      const origin = map.latLngToContainerPoint([pins[first].lat, pins[first].lng]);
      for (const index of [...remaining]) {
        const point = map.latLngToContainerPoint([pins[index].lat, pins[index].lng]);
        if (origin.distanceTo(point) < 44) {
          remaining.delete(index);
          members.push(pins[index]);
        }
      }
      result.push({
        id: members.map((pin) => pin.id).sort().join("|"),
        pins: members,
        lat: members.reduce((sum, pin) => sum + pin.lat, 0) / members.length,
        lng: members.reduce((sum, pin) => sum + pin.lng, 0) / members.length,
      });
    }
    return result;
  }, [map, pins, revision]);

  return (
    <>
      {clusters.map((cluster) => {
        const first = cluster.pins[0];
        const isSelected = cluster.pins.some((pin) => pin.id === selectedId || pin.id === highlightedId);
        return (
          <Marker
            key={cluster.id}
            position={[cluster.lat, cluster.lng]}
            icon={makePinIcon(first, cluster.pins.length, isSelected)}
            keyboard
            title={cluster.pins.length > 1 ? `${cluster.pins.length} map entries` : `${first.name}, ${first.country}`}
            alt={cluster.pins.length > 1 ? `${cluster.pins.length} clustered entries` : `${first.name}, ${first.country}`}
            eventHandlers={{
              add: (event) => {
                const element = (event.target as L.Marker).getElement();
                element?.setAttribute("role", "button");
                element?.setAttribute("aria-label", cluster.pins.length > 1 ? `${cluster.pins.length} clustered map entries` : `${first.name}, ${first.country}${first.date ? `, ${first.date}` : ""}`);
              },
              click: () => {
                if (cluster.pins.length === 1) onSelect?.(first.id);
                else {
                  const bounds: LatLngBoundsExpression = cluster.pins.map((pin) => [pin.lat, pin.lng] as [number, number]);
                  map.fitBounds(bounds, { padding: [40, 40], maxZoom: Math.min(map.getZoom() + 3, 8) });
                }
              },
              mouseover: () => onHover?.(first.id),
              mouseout: () => onHover?.(null),
            }}
          >
            <Popup>
              <div style={{ minWidth: 190, maxWidth: 280, color: "#414042", fontFamily: "var(--font-sans)" }}>
                {cluster.pins.map((pin) => (
                  <div key={pin.id} style={{ padding: "6px 0", borderBottom: "1px solid #e5e7eb" }}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(pin.id)}
                      onMouseEnter={() => onHover?.(pin.id)}
                      onMouseLeave={() => onHover?.(null)}
                      style={{ padding: 0, border: 0, background: "transparent", color: "#414042", textAlign: "left", font: "inherit", fontWeight: 700, cursor: "pointer" }}
                    >
                      {pin.name}
                    </button>
                    <div style={{ marginTop: 2, fontSize: 12 }}>
                      {pin.flag} {pin.country}{pin.date ? ` · ${pin.date}` : ""}
                    </div>
                    {pin.href && <a href={pin.href} style={{ display: "inline-block", marginTop: 3, color: "#4298D3", fontSize: 12 }}>View details</a>}
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function EventsMap(props: Props) {
  const tileUrl = cartoMapConfig.rasterTileUrl;
  const warned = useRef(false);
  const pins = useMemo(() => {
    const valid = props.pins.filter(isValidPin);
    const skipped = props.pins.filter((pin) => !isValidPin(pin));
    if (skipped.length) console.warn(`[map] Skipped records with invalid coordinates: ${skipped.map((pin) => pin.id).join(", ")}`);
    return valid;
  }, [props.pins]);

  useEffect(() => {
    if (!cartoMapConfig.rasterTileUrl && !warned.current) {
      console.warn("[map] CARTO basemap unavailable: set VITE_CARTO_API_KEY in .env.local.");
      warned.current = true;
    }
  }, []);

  if (!tileUrl) {
    return <div role="status" aria-label={props.label} className="flex h-full min-h-40 w-full items-center justify-center bg-[#FAFAFA] px-6 text-center text-sm text-[#414042]">Map unavailable. Add the CARTO map key to the local environment.</div>;
  }

  return (
    <div className="h-full w-full" role="region" aria-label={props.label}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={12}
        worldCopyJump
        scrollWheelZoom={false}
        touchZoom
        style={{ height: "100%", width: "100%", background: "#FAFAFA" }}
      >
        <TileLayer attribution={cartoMapConfig.attribution} url={tileUrl} />
        <BoundsController pins={pins} />
        <ClusterMarkers {...props} pins={pins} />
      </MapContainer>
    </div>
  );
}
