import { useEffect, useState } from "react";

import type {
  BairroCollection,
  DeslizamentoCollection,
  GeoDataState,
  LimiteFeature,
  InundacaoCollection,
} from "../map/types";

const BASE = import.meta.env.BASE_URL;

async function loadJson<T>(filename: string): Promise<T> {
  const response = await fetch(`${BASE}data/${filename}`);
  if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

export function useGeoData() {
  const [state, setState] = useState<GeoDataState>({
    bairros: null,
    limite: null,
    deslizamentos: null,
    inundacoes: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadJson<BairroCollection>("bairros.geojson"),
      loadJson<LimiteFeature>("limite-sao-vicente.geojson"),
      loadJson<DeslizamentoCollection>("riscos-deslizamento.geojson"),
      loadJson<InundacaoCollection>("riscos-inundacao.geojson"),
    ])
      .then(([bairros, limite, deslizamentos, inundacoes]) => {
        if (!cancelled) {
          setState({
            bairros,
            limite,
            deslizamentos,
            inundacoes,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
