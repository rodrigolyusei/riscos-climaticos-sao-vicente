import type * as GeoJSON from "geojson";

export type Props = {
  bairro?: string;
  nome?: string;
  name?: string;
  risco?: string;
  classificacao?: string;
  nivel?: string;
  observacao?: string;
  descricao?: string;
  impacto?: string;
  id?: string | number;
  gid?: string | number;
  codigo?: string | number;
  [key: string]: any;
};

export type IndexItem = {
  feature: GeoJSON.Feature;
  label: string;
  searchText: string;
  id: string;
};

export const riskPalette: Record<string, string> = {
  muito_alto: "#fa003f",
  alto: "#e87722",
  medio: "#00a3e0",
  baixo: "#007a4a",
  default: "#000000",
};

export function normalizeText(value: unknown): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getRiskValue(properties: Props): string {
  return normalizeText(
    properties?.risco ||
      properties?.classificacao ||
      properties?.nivel ||
      properties?.risk ||
      properties?.categoria,
  );
}

export function getStrokeColor(properties: Props): string {
  const risk = getRiskValue(properties);
  if (risk.includes("muito") && risk.includes("alto"))
    return riskPalette.muito_alto;
  if (risk.includes("alto")) return riskPalette.alto;
  if (risk.includes("medio")) return riskPalette.medio;
  if (risk.includes("baixo")) return riskPalette.baixo;
  return riskPalette.default;
}

export function buildPopupContent(properties: Props): string {
  const bairro =
    properties?.bairro ||
    properties?.nome ||
    properties?.name ||
    "Área sem nome";
  const risco =
    properties?.risco ||
    properties?.classificacao ||
    properties?.nivel ||
    "Não informado";
  const observacao =
    properties?.observacao ||
    properties?.descricao ||
    properties?.impacto ||
    "Sem observações adicionais.";

  return `
    <article>
      <h3 class="popup-title">${bairro}</h3>
      <p class="popup-row"><strong>Risco:</strong> ${risco}</p>
      <p class="popup-row"><strong>Detalhe:</strong> ${observacao}</p>
    </article>
  `;
}

export function getFeatureId(feature: GeoJSON.Feature): string {
  const props = (feature.properties || {}) as Props;
  const baseId =
    feature.id ??
    props.id ??
    props.gid ??
    props.codigo ??
    props.bairro ??
    props.nome ??
    props.name;
  return String(baseId ?? normalizeText(JSON.stringify(props || {})));
}

export function styleFeature(feature?: GeoJSON.Feature) {
  const color = getStrokeColor((feature?.properties as Props) || {});
  return {
    color,
    weight: 2,
    opacity: 1,
    fillColor: color,
    fillOpacity: 0.45,
    lineJoin: "round" as const,
  };
}
