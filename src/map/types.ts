import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

export type Nivel = "Baixo" | "Médio" | "Alto";

export interface InundacaoProperties {
  bairro: string;
  nivel: Nivel;
  fonte: string;
}

export type InundacaoGeometry = Polygon | MultiPolygon;
export type InundacaoFeature = Feature<InundacaoGeometry, InundacaoProperties>;
export type InundacaoCollection = FeatureCollection<
  InundacaoGeometry,
  InundacaoProperties
>;

export type LimiteFeature = Feature<InundacaoGeometry, { name?: string }>;

export interface DeslizamentoProperties {
  Name?: string;
  descriptio?: string | null;
}

export type DeslizamentoCollection = FeatureCollection<
  Point,
  DeslizamentoProperties
>;

export interface BairroProperties {
  name: string;
  source?: string | null;
  origin_id?: string | null;
  generated_from?: "original_point" | "polygon_centroid" | string;
}

export type BairroFeature = Feature<Point, BairroProperties>;
export type BairroCollection = FeatureCollection<Point, BairroProperties>;

export interface GeoDataState {
  bairros: BairroCollection | null;
  limite: LimiteFeature | null;
  deslizamentos: DeslizamentoCollection | null;
  inundacoes: InundacaoCollection | null;
  loading: boolean;
  error: string | null;
}
