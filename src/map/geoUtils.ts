import type { Feature, Position } from "geojson";
import type { PathOptions } from "leaflet";
import { getColor } from "./config";
import type {
  DeslizamentoCollection,
  InundacaoCollection,
  InundacaoProperties,
  Nivel,
  Risk,
} from "./types";

const BAIRRO_RISK_RADIUS_METERS = 200;
export const DESLIZAMENTO_AREA_RADIUS_METERS = 70;

const NIVEL: Record<Nivel, number> = {
  Baixo: 1,
  Médio: 2,
  Alto: 3,
};

const PIN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`;
const SHIELD_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>`;
const CIRCLE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
const WARNING_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;

const NIVEL_ICON: Record<Nivel, string> = {
  Baixo: SHIELD_ICON,
  Médio: CIRCLE_ICON,
  Alto: WARNING_ICON,
};

const NIVEL_CLASS: Record<Nivel, string> = {
  Baixo: "baixo",
  Médio: "medio",
  Alto: "alto",
};

const RISK_LABEL: Record<string, string> = {
  Inundação: "inundação",
  Deslizamento: "deslizamentos",
};

const RISK_CLASS: Record<string, string> = {
  Inundação: "inundacao",
  Deslizamento: "deslizamento",
};

const RISK_TIPS: Record<string, string[]> = {
  Inundação: [
    "Acompanhe os alertas da Defesa Civil.",
    "Evite atravessar ruas ou áreas alagadas.",
    "Procure um local seguro e desligue a energia, se possível.",
  ],
  Deslizamento: [
    "Acompanhe os alertas da Defesa Civil.",
    "Fique atento a rachaduras no solo, muros e paredes.",
    "Ao perceber sinais de risco, deixe o local imediatamente.",
  ],
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

export function polygonWithinRadius(
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

export function findNearbyRisks(
  coordinates: Position,
  inundacoes: InundacaoCollection,
  deslizamentos: DeslizamentoCollection,
) {
  const nearbyRisks: Risk[] = [];

  inundacoes.features
    .filter((inundacao) =>
      inundacao.geometry.type === "Polygon"
        ? polygonWithinRadius(
            coordinates,
            inundacao.geometry.coordinates,
            BAIRRO_RISK_RADIUS_METERS,
          )
        : inundacao.geometry.coordinates.some((polygon) =>
            polygonWithinRadius(
              coordinates,
              polygon,
              BAIRRO_RISK_RADIUS_METERS,
            ),
          ),
    )
    .forEach((inundacao) => {
      nearbyRisks.push({
        tipo: "Inundação",
        nivel: inundacao.properties.nivel,
      });
    });

  const hasNearbyDeslizamento = deslizamentos.features.some((deslizamento) => {
    const point = deslizamento.geometry?.coordinates;
    return Boolean(
      point &&
      point.length >= 2 &&
      distanceMeters(coordinates, point) <=
        BAIRRO_RISK_RADIUS_METERS + DESLIZAMENTO_AREA_RADIUS_METERS,
    );
  });

  if (hasNearbyDeslizamento) {
    nearbyRisks.push({
      tipo: "Deslizamento",
      nivel: "Alto",
    });
  }

  return nearbyRisks;
}

export function neighborhoodRiskPopupHtml(
  name: string,
  nearbyRisks: Risk[],
): string {
  const highestRiskByType = new Map<string, Risk>();
  nearbyRisks.forEach((risk) => {
    const current = highestRiskByType.get(risk.tipo);
    if (!current || NIVEL[risk.nivel] > NIVEL[current.nivel]) {
      highestRiskByType.set(risk.tipo, risk);
    }
  });
  const risks = Array.from(highestRiskByType.values());

  const riskItems = risks.length
    ? risks
        .map(
          (risk) =>
            `<li class="popup-risk__item popup-risk__item--${NIVEL_CLASS[risk.nivel]}">${NIVEL_ICON[risk.nivel]}<span>${risk.nivel} risco de ${RISK_LABEL[risk.tipo]}</span></li>`,
        )
        .join("")
    : `<li class="popup-risk__item popup-risk__item--none">${SHIELD_ICON}<span>Sem risco identificado</span></li>`;

  const guide = risks.length
    ? `<h4 class="popup-guide__title">Saiba como agir</h4><div class="popup-guide">${risks
        .map((risk) => {
          const tips = RISK_TIPS[risk.tipo]
            .map((tip) => `<li>${tip}</li>`)
            .join("");
          return `<div class="popup-guide__section"><span class="popup-guide__label popup-guide__label--${RISK_CLASS[risk.tipo]}">${risk.tipo}</span><ul class="popup-guide__tips">${tips}</ul></div>`;
        })
        .join("")}</div>`
    : "";

  return `<div class="popup-card"><h3 class="popup-card__title">${PIN_ICON}<span>${name}</span></h3><ul class="popup-card__risks">${riskItems}</ul>${guide}</div>`;
}
