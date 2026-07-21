import type { Feature, Position } from "geojson";
import type { PathOptions } from "leaflet";
import { getColor } from "./config";
import type {
  BairroCenterFeature,
  Nivel,
  RiskCollection,
  RiskFeature,
  RiskProperties,
} from "./types";

const NIVEL_RANK: Record<Nivel, number> = {
  Baixo: 1,
  Médio: 2,
  Alto: 3,
  "Muito Alto": 4,
};

export function styleFor(feature: Feature | undefined): PathOptions {
  const properties = (feature?.properties ?? {}) as RiskProperties;
  const color = getColor(properties.tipo, properties.nivel);
  return {
    color,
    weight: 2,
    opacity: 0.9,
    fillColor: color,
    fillOpacity: 0.45,
  };
}

export function distanceMeters(a: Position, b: Position): number {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(b[1] - a[1]);
  const dLng = toRadians(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a[1])) * Math.cos(toRadians(b[1])) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

function projectToMeters(origin: Position, point: Position): [number, number] {
  const metersPerDegreeLatitude = 111320;
  const metersPerDegreeLongitude = 111320 * Math.cos((origin[1] * Math.PI) / 180);
  return [
    (point[0] - origin[0]) * metersPerDegreeLongitude,
    (point[1] - origin[1]) * metersPerDegreeLatitude,
  ];
}

function pointInRing(point: Position, ring: Position[]): boolean {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [x, y] = ring[index];
    const [previousX, previousY] = ring[previous];
    const intersects =
      y > point[1] !== previousY > point[1] &&
      point[0] < ((previousX - x) * (point[1] - y)) / (previousY - y) + x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointToSegmentDistanceMeters(point: Position, start: Position, end: Position): number {
  const [pointX, pointY] = projectToMeters(point, point);
  const [startX, startY] = projectToMeters(point, start);
  const [endX, endY] = projectToMeters(point, end);
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (deltaX === 0 && deltaY === 0) return Math.hypot(pointX - startX, pointY - startY);

  const ratio = Math.max(
    0,
    Math.min(1, ((pointX - startX) * deltaX + (pointY - startY) * deltaY) / (deltaX ** 2 + deltaY ** 2)),
  );
  return Math.hypot(pointX - (startX + ratio * deltaX), pointY - (startY + ratio * deltaY));
}

function polygonWithinRadius(center: Position, rings: Position[][], radiusMeters: number): boolean {
  if (!rings.length || !rings[0]) return false;
  if (pointInRing(center, rings[0])) return true;

  return rings.some((ring) =>
    ring.some((start, index) => {
      const end = ring[(index + 1) % ring.length];
      return (
        distanceMeters(center, start) <= radiusMeters ||
        pointToSegmentDistanceMeters(center, start, end) <= radiusMeters
      );
    }),
  );
}

export function risksNearNeighborhood(
  centerFeature: BairroCenterFeature,
  riscos: RiskCollection,
  radiusMeters: number,
): RiskFeature[] {
  const center = centerFeature.geometry.coordinates;
  return riscos.features.filter((feature) =>
    feature.geometry.type === "Polygon"
      ? polygonWithinRadius(center, feature.geometry.coordinates, radiusMeters)
      : feature.geometry.coordinates.some((polygon) =>
          polygonWithinRadius(center, polygon, radiusMeters),
        ),
  );
}

export function neighborhoodRiskPopupHtml(
  centerFeature: BairroCenterFeature,
  nearbyRisks: RiskFeature[],
): string {
  const name = centerFeature.properties.name;
  if (!nearbyRisks.length) {
    return `<div class="popup-risco popup-risco--point"><h3 class="popup-bairro">${name}</h3><ul class="popup-risk-list"><li class="popup-risk-list__item"><span>Sem risco identificado</span></li></ul></div>`;
  }

  const highestRiskByType = new Map<string, RiskProperties>();
  nearbyRisks.forEach((risk) => {
    const current = highestRiskByType.get(risk.properties.tipo);
    if (!current || NIVEL_RANK[risk.properties.nivel] > NIVEL_RANK[current.nivel]) {
      highestRiskByType.set(risk.properties.tipo, risk.properties);
    }
  });

  const items = Array.from(highestRiskByType.values())
    .sort((a, b) => NIVEL_RANK[b.nivel] - NIVEL_RANK[a.nivel])
    .map((risk) => {
      const color = getColor(risk.tipo, risk.nivel);
      return `<li class="popup-risk-list__item"><span class="popup-risk-list__dot" style="background:${color}"></span><span>${risk.tipo} — ${risk.nivel}</span></li>`;
    })
    .join("");

  return `<div class="popup-risco popup-risco--point"><h3 class="popup-bairro">${name}</h3><ul class="popup-risk-list">${items}</ul></div>`;
}
