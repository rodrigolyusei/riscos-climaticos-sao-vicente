import type { Feature, Position } from "geojson";
import type { PathOptions } from "leaflet";
import { getColor } from "./config";
import type {
  BairroFeature,
  Nivel,
  InundacaoCollection,
  InundacaoFeature,
  InundacaoProperties,
} from "./types";

const NIVEL: Record<Nivel, number> = {
  Baixo: 1,
  Médio: 2,
  Alto: 3,
};

export function styleFor(feature: Feature | undefined): PathOptions {
  const properties = (feature?.properties ?? {}) as InundacaoProperties;
  const color = getColor(properties.nivel);
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
    Math.cos(toRadians(a[1])) *
      Math.cos(toRadians(b[1])) *
      Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

function projectToMeters(origin: Position, point: Position): [number, number] {
  const metersPerDegreeLatitude = 111320;
  const metersPerDegreeLongitude =
    111320 * Math.cos((origin[1] * Math.PI) / 180);
  return [
    (point[0] - origin[0]) * metersPerDegreeLongitude,
    (point[1] - origin[1]) * metersPerDegreeLatitude,
  ];
}

function pointInRing(point: Position, ring: Position[]): boolean {
  let inside = false;
  for (
    let index = 0, previous = ring.length - 1;
    index < ring.length;
    previous = index++
  ) {
    const [x, y] = ring[index];
    const [previousX, previousY] = ring[previous];
    const intersects =
      y > point[1] !== previousY > point[1] &&
      point[0] < ((previousX - x) * (point[1] - y)) / (previousY - y) + x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointToSegmentDistanceMeters(
  point: Position,
  start: Position,
  end: Position,
): number {
  const [pointX, pointY] = projectToMeters(point, point);
  const [startX, startY] = projectToMeters(point, start);
  const [endX, endY] = projectToMeters(point, end);
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (deltaX === 0 && deltaY === 0)
    return Math.hypot(pointX - startX, pointY - startY);

  const ratio = Math.max(
    0,
    Math.min(
      1,
      ((pointX - startX) * deltaX + (pointY - startY) * deltaY) /
        (deltaX ** 2 + deltaY ** 2),
    ),
  );
  return Math.hypot(
    pointX - (startX + ratio * deltaX),
    pointY - (startY + ratio * deltaY),
  );
}

function polygonWithinRadius(
  center: Position,
  rings: Position[][],
  radiusMeters: number,
): boolean {
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
  centerFeature: BairroFeature,
  riscos: InundacaoCollection,
  radiusMeters: number,
): InundacaoFeature[] {
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
  centerFeature: BairroFeature,
  nearbyRisks: InundacaoFeature[],
): string {
  const name = centerFeature.properties.name;
  if (!nearbyRisks.length) {
    return `<div class="popup-risco popup-risco--point"><h3 class="popup-bairro">${name}</h3><ul class="popup-risk-list"><li class="popup-risk-list__item"><span>Sem risco identificado</span></li></ul></div>`;
  }

  const highestRisk = nearbyRisks.reduce<{
    nivel: Nivel;
    properties: InundacaoProperties;
  } | null>((best, risk) => {
    if (!best || NIVEL[risk.properties.nivel] > NIVEL[best.nivel]) {
      return { nivel: risk.properties.nivel, properties: risk.properties };
    }
    return best;
  }, null)!;

  const color = getColor(highestRisk.nivel);
  const items = `<li class="popup-risk-list__item"><span class="popup-risk-list__dot" style="background:${color}"></span><span>Risco de inundação — ${highestRisk.nivel}</span></li>`;

  return `<div class="popup-risco popup-risco--point"><h3 class="popup-bairro">${name}</h3><ul class="popup-risk-list">${items}</ul></div>`;
}
