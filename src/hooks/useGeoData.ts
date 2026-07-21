import { useEffect, useState } from "react";
import {
  loadBairroCenters,
  loadDeslizamentos,
  loadLimite,
  loadRiscos,
} from "../data/loadGeoJSON";
import type {
  BairroCenterCollection,
  DeslizamentoPointCollection,
  LimiteFeature,
  RiskCollection,
} from "../map/types";

interface GeoDataState {
  riscos: RiskCollection | null;
  limite: LimiteFeature | null;
  deslizamentos: DeslizamentoPointCollection | null;
  bairroCenters: BairroCenterCollection | null;
  loading: boolean;
  error: string | null;
}

export function useGeoData(): GeoDataState {
  const [state, setState] = useState<GeoDataState>({
    riscos: null,
    limite: null,
    deslizamentos: null,
    bairroCenters: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadRiscos(), loadLimite(), loadDeslizamentos(), loadBairroCenters()])
      .then(([riscos, limite, deslizamentos, bairroCenters]) => {
        if (!cancelled) {
          setState({
            riscos,
            limite,
            deslizamentos,
            bairroCenters,
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
