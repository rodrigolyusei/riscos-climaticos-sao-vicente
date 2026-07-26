import type { Nivel } from "./types";

export const SV_CENTER: [number, number] = [-23.965, -46.392];
export const SV_ZOOM = 13;

export const PALETTES: Record<Nivel, string> = {
  Baixo: "#64B5F6",
  Médio: "#1E88E5",
  Alto: "#1565C0",
};

export function getColor(nivel: Nivel): string {
  return PALETTES[nivel] ?? "#9E9E9E";
}

const TILE_PROVIDERS: Record<string, { url: string; attribution: string }> = {
  OpenStreetMap: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  EsriWorldTopoMap: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  },
  CartoDB: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

export const TILE_URL = TILE_PROVIDERS.EsriWorldTopoMap.url;
export const TILE_OPTIONS = {
  maxZoom: 19,
  buffer: 3,
  keepBuffer: 8,
  updateWhenIdle: false,
  attribution: TILE_PROVIDERS.EsriWorldTopoMap.attribution,
};
