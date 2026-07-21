import type {
  BairroCenterCollection,
  DeslizamentoPointCollection,
  LimiteFeature,
  RiskCollection,
} from "../map/types";

const BASE = import.meta.env.BASE_URL;

async function loadJson<T>(filename: string): Promise<T> {
  const response = await fetch(`${BASE}data/${filename}`);
  if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

export async function loadRiscos(): Promise<RiskCollection> {
  const riscos = await loadJson<RiskCollection>("riscos.geojson");

  return {
    ...riscos,
    features: riscos.features.filter((feature) => {
      const props = feature.properties;
      if (!props) return false;

      return !(
        props.fonte.includes("Mock") &&
        (props.tipo === "Deslizamento" || props.tipo === "Queimada")
      );
    }),
  };
}

export function loadLimite(): Promise<LimiteFeature> {
  return loadJson("limite-sao-vicente.geojson");
}

export function loadDeslizamentos(): Promise<DeslizamentoPointCollection> {
  return loadJson("deslizamento.geojson");
}

export function loadBairroCenters(): Promise<BairroCenterCollection> {
  return loadJson("bairro-centers.geojson");
}
