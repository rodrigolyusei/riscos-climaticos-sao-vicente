import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

export type Tipo = "Enchente" | "Deslizamento" | "Queimada";
export type Nivel = "Baixo" | "Médio" | "Alto" | "Muito Alto";

export interface RiskProperties {
  tipo: Tipo;
  bairro: string;
  nivel: Nivel;
  descricao: string;
  fonte: string;
  data: string;
}

export type RiskGeometry = Polygon | MultiPolygon;
export type RiskFeature = Feature<RiskGeometry, RiskProperties>;
export type RiskCollection = FeatureCollection<RiskGeometry, RiskProperties>;

export type LimiteFeature = Feature<RiskGeometry, { name?: string }>;

export interface DeslizamentoPointProperties {
  Name?: string;
  descriptio?: string | null;
  timestamp?: string | null;
  begin?: string | null;
  end?: string | null;
  altitudeMo?: number | null;
  tessellate?: number | null;
  extrude?: number | null;
  visibility?: number | null;
  drawOrder?: number | null;
  icon?: string | null;
}

export type DeslizamentoPointCollection = FeatureCollection<
  Point,
  DeslizamentoPointProperties
>;

export interface BairroCenterProperties {
  name: string;
  source?: string | null;
  origin_id?: string | null;
  generated_from?: "original_point" | "polygon_centroid" | string;
}

export type BairroCenterFeature = Feature<Point, BairroCenterProperties>;
export type BairroCenterCollection = FeatureCollection<
  Point,
  BairroCenterProperties
>;
