import L from "leaflet";
import type { MultiPolygon, Polygon, Position } from "geojson";
import type { LimiteFeature } from "./types";

type Ring = Position[];

export function signedArea(ring: Ring): number {
  let area = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    area += ring[index][0] * ring[index + 1][1] - ring[index + 1][0] * ring[index][1];
  }
  return area / 2;
}

function ensureCounterClockwise(ring: Ring): Ring {
  return signedArea(ring) < 0 ? [...ring].reverse() : [...ring];
}

const WORLD_RING: Ring = [
  [-180, -90],
  [-180, 90],
  [180, 90],
  [180, -90],
  [-180, -90],
];

export function buildMaskGeometry(limite: LimiteFeature): Polygon | MultiPolygon {
  const maskPolygon = (outerRing: Ring): Position[][] => [WORLD_RING, ensureCounterClockwise(outerRing)];
  return limite.geometry.type === "Polygon"
    ? { type: "Polygon", coordinates: maskPolygon(limite.geometry.coordinates[0]) }
    : {
        type: "MultiPolygon",
        coordinates: limite.geometry.coordinates.map((polygon) => maskPolygon(polygon[0])),
      };
}

export function addCityClip(map: L.Map, limite: LimiteFeature): L.LatLngBounds {
  map.createPane("maskPane");
  map.getPane("maskPane")!.style.zIndex = "250";
  const cityBounds = L.geoJSON(limite).getBounds();

  L.geoJSON(buildMaskGeometry(limite), {
    style: { fillColor: "#0b1220", fillOpacity: 0.4, fill: true, stroke: false, interactive: false },
    pane: "maskPane",
  }).addTo(map);
  L.geoJSON(limite, {
    style: { color: "#0f4c5c", weight: 2.5, opacity: 0.9, fill: false, dashArray: "5 4", interactive: false },
  }).addTo(map);

  return cityBounds;
}
