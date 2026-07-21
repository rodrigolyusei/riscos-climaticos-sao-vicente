import type { Nivel, Tipo } from "./types";

export const SV_CENTER: [number, number] = [-23.965, -46.392];
export const SV_ZOOM = 13;

export const PALETTES: Record<Tipo, Record<Nivel, string>> = {
  Enchente: {
    Baixo: "#64B5F6",
    Médio: "#1E88E5",
    Alto: "#1565C0",
    "Muito Alto": "#0D47A1",
  },
  Deslizamento: {
    Baixo: "#FFCC80",
    Médio: "#FB8C00",
    Alto: "#E65100",
    "Muito Alto": "#BF360C",
  },
  Queimada: {
    Baixo: "#EF9A9A",
    Médio: "#E53935",
    Alto: "#C62828",
    "Muito Alto": "#B71C1C",
  },
};

export function getColor(tipo: Tipo, nivel: Nivel): string {
  return PALETTES[tipo]?.[nivel] ?? "#9E9E9E";
}

export const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_OPTIONS = {
  maxZoom: 19,
  buffer: 3,
  keepBuffer: 8,
  updateWhenIdle: false,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
