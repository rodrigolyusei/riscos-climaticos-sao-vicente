import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

export type LimiteFeature = Feature<Polygon>;

export interface BairroProperties {
  name: string;
}

export type BairroFeature = Feature<Point, BairroProperties>;
export type BairroCollection = FeatureCollection<Point, BairroProperties>;

export type Nivel = "Baixo" | "Médio" | "Alto";

export interface InundacaoProperties {
  bairro: string;
  nivel: Nivel;
}

export type InundacaoCollection = FeatureCollection<
  Polygon | MultiPolygon,
  InundacaoProperties
>;

export type DeslizamentoCollection = FeatureCollection<Point>;

export interface GeoDataState {
  bairros: BairroCollection | null;
  limite: LimiteFeature | null;
  deslizamentos: DeslizamentoCollection | null;
  inundacoes: InundacaoCollection | null;
  loading: boolean;
  error: string | null;
}

export type RiskTypes = "Deslizamento" | "Inundação";

export interface Risk {
  tipo: RiskTypes;
  nivel: Nivel;
}
