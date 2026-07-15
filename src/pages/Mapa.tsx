import { useCallback, useRef, useState } from "react";
import * as L from "leaflet";
import type * as GeoJSON from "geojson";
import { Map } from "../components/MapLeaflet";
import { Legend } from "../components/Legend";
import {
  type Props,
  type IndexItem,
  normalizeText,
  getFeatureId,
  buildPopupContent,
  styleFeature,
} from "../types";

function highlightFeature(layer: L.Path): void {
  (layer as any).setStyle({ weight: 4, fillOpacity: 0.8, opacity: 1 });
  (layer as any).bringToFront();
}

function resetHighlight(
  layer: L.Path,
  geojsonLayer: L.GeoJSON | null,
): void {
  geojsonLayer?.resetStyle(layer as any);
}

function onEachFeature(
  feature: GeoJSON.Feature,
  layer: L.Layer,
  _map: L.Map,
  geojsonLayer: L.GeoJSON | null,
  onStatus: (msg: string) => void,
): void {
  const properties = (feature.properties || {}) as Props;
  (layer as any)._featureId = getFeatureId(feature);
  (layer as any).bindPopup(buildPopupContent(properties), { maxWidth: 280 });
  (layer as any).on({
    mouseover: () => highlightFeature(layer as any),
    mouseout: () => resetHighlight(layer as any, geojsonLayer),
    click: () =>
      onStatus(
        `Selecionado: ${properties.bairro || properties.nome || properties.name || "área do mapa"}`,
      ),
  });
}

export function Mapa() {
  const [status, setStatus] = useState("Carregando dados do mapa...");
  const mapRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const featuresIndexRef = useRef<IndexItem[]>([]);
  const statusRef = useRef(status);
  statusRef.current = status;

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    loadGeoJson(map);
  }, []);

  async function loadGeoJson(map: L.Map): Promise<void> {
    try {
      const response = await fetch("/data/risco_deslizamento.geojson", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Falha ao carregar o GeoJSON (${response.status})`);
      }

      const geojson = await response.json();
      const features = Array.isArray(
        (geojson as GeoJSON.FeatureCollection).features,
      )
        ? (geojson as GeoJSON.FeatureCollection).features
        : [];

      if (geojsonLayerRef.current) {
        geojsonLayerRef.current.removeFrom(map);
      }

      const layer = L.geoJSON(geojson as any, {
        style: styleFeature,
        onEachFeature: (feature, layer) =>
          onEachFeature(feature, layer, map, geojsonLayerRef.current, setStatus),
      }).addTo(map);

      geojsonLayerRef.current = layer;

      featuresIndexRef.current = features
        .map((feature) => {
          const props = (feature.properties || {}) as Props;
          const id = getFeatureId(feature);
          return {
            feature,
            label: normalizeText(props?.bairro || props?.nome || props?.name),
            searchText: normalizeText(JSON.stringify(props || {})),
            id,
          } as IndexItem;
        })
        .filter((item) => item.label || item.searchText);

      if (features.length > 0) {
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.12));
        }
        setStatus(`Mapa carregado com ${features.length} área(s) de risco.`);
      } else {
        setStatus("GeoJSON carregado, mas sem feições para exibir.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível carregar o GeoJSON local.");
    }
  }

  function searchFeature(term: string): void {
    const query = normalizeText(term);
    if (!query) {
      setStatus("Digite um bairro para localizar no mapa.");
      return;
    }

    const match = featuresIndexRef.current.find(
      (item) => item.label.includes(query) || item.searchText.includes(query),
    );
    if (!match) {
      setStatus(`Nenhum resultado para "${term}".`);
      return;
    }

    const map = mapRef.current;
    if (!map) return;

    const targetLayer = geojsonLayerRef.current
      ?.getLayers()
      .find((layer: any) => (layer as any)._featureId === match.id);

    if (targetLayer) {
      targetLayer.openPopup();
      if (typeof (targetLayer as any).getBounds === "function") {
        map.fitBounds((targetLayer as any).getBounds().pad(0.2));
      } else if (typeof (targetLayer as any).getLatLng === "function") {
        const latlng = (targetLayer as any).getLatLng();
        map.setView(latlng, Math.max(map.getZoom(), 15));
      }

      setStatus(
        `Resultado encontrado: ${(match.feature.properties as Props)?.bairro || (match.feature.properties as Props)?.nome || (match.feature.properties as Props)?.name}`,
      );
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("search-input") as HTMLInputElement;
    if (input) searchFeature(input.value);
  }

  return (
    <main className="map-shell">
      <Map onMapReady={handleMapReady} />
      <Legend />
      <form className="searchbar" id="search-form" autoComplete="off" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="search-input">
          Buscar bairro
        </label>
        <input
          id="search-input"
          name="search-input"
          type="search"
          placeholder="Buscar bairro ou referência"
          aria-label="Buscar bairro ou referência"
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="status-pill" id="status-pill">
        {status}
      </div>
    </main>
  );
}
