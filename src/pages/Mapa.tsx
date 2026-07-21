import { type FormEvent, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeoData } from "../hooks/useGeoData";
import { addCityClip } from "../map/cityClip";
import { getColor, SV_CENTER, SV_ZOOM, TILE_OPTIONS, TILE_URL } from "../map/config";
import {
  distanceMeters,
  neighborhoodRiskPopupHtml,
  risksNearNeighborhood,
  styleFor,
} from "../map/geoUtils";
import type { RiskFeature } from "../map/types";

const BAIRRO_RISK_RADIUS_METERS = 200;
const DESLIZAMENTO_AREA_RADIUS_METERS = 70;

const bairroMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function Mapa() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const neighborhoodMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const { riscos, limite, deslizamentos, bairroCenters, loading, error } = useGeoData();

  useEffect(() => {
    if (!limite || !riscos || !deslizamentos || !bairroCenters || !containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: SV_CENTER,
      zoom: SV_ZOOM,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      inertia: true,
    });
    mapRef.current = map;
    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.attribution({ position: "bottomleft" }).addTo(map);
    L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map);

    const cityBounds = addCityClip(map, limite);
    map.setMaxBounds(cityBounds.pad(0.2));
    map.fitBounds(cityBounds, { padding: [20, 20] });

    riscos.features.forEach((feature) => {
      const layer = L.geoJSON(feature, {
        style: styleFor,
        onEachFeature: (_feature, leafletLayer) => {
          leafletLayer.on({
            mouseover: (event) =>
              (event.target as L.Path).setStyle({ weight: 3, fillOpacity: 0.65 }),
            mouseout: (event) => layer.resetStyle(event.target as L.Path),
          });
        },
      });
      map.addLayer(layer);
    });

    deslizamentos.features.forEach((feature) => {
      const coordinates = feature.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) return;
      const [lng, lat] = coordinates;
      L.circle([lat, lng], {
        radius: DESLIZAMENTO_AREA_RADIUS_METERS,
        color: getColor("Deslizamento", "Alto"),
        weight: 2,
        opacity: 0.95,
        fillColor: getColor("Deslizamento", "Alto"),
        fillOpacity: 0.55,
        interactive: false,
      }).addTo(map);
    });

    bairroCenters.features.forEach((feature) => {
      const coordinates = feature.geometry?.coordinates;
      const name = feature.properties?.name?.trim();
      if (!coordinates || coordinates.length < 2 || !name) return;

      const nearbyRisks: RiskFeature[] = risksNearNeighborhood(feature, riscos, BAIRRO_RISK_RADIUS_METERS);
      const hasNearbyDeslizamento = deslizamentos.features.some((deslizamento) => {
        const point = deslizamento.geometry?.coordinates;
        return Boolean(
          point &&
            point.length >= 2 &&
            distanceMeters(coordinates, point) <=
              BAIRRO_RISK_RADIUS_METERS + DESLIZAMENTO_AREA_RADIUS_METERS,
        );
      });

      if (hasNearbyDeslizamento) {
        nearbyRisks.push({
          type: "Feature",
          properties: { tipo: "Deslizamento", bairro: name, nivel: "Alto", descricao: "", fonte: "deslizamento.geojson", data: "" },
          geometry: { type: "Polygon", coordinates: [] },
        });
      }

      const [lng, lat] = coordinates;
      const marker = L.marker([lat, lng], { icon: bairroMarkerIcon })
        .bindPopup(neighborhoodRiskPopupHtml(feature, nearbyRisks))
        .addTo(map);
      neighborhoodMarkersRef.current.set(name.toLocaleLowerCase("pt-BR"), marker);
    });

    return () => {
      neighborhoodMarkersRef.current.clear();
      searchMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [bairroCenters, deslizamentos, limite, riscos]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    const map = mapRef.current;
    if (!query || !map) return;

    setSearchError(null);
    const localMarker = neighborhoodMarkersRef.current.get(query.toLocaleLowerCase("pt-BR"));
    if (localMarker) {
      map.setView(localMarker.getLatLng(), Math.max(map.getZoom(), 15), { animate: true });
      localMarker.openPopup();
      return;
    }

    setSearching(true);
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", `${query}, São Vicente, São Paulo, Brasil`);
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("limit", "1");
      url.searchParams.set("countrycodes", "br");
      const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Busca falhou: HTTP ${response.status}`);

      const results = (await response.json()) as Array<{ lat: string; lon: string }>;
      if (!results.length) {
        setSearchError("Nenhum resultado encontrado.");
        return;
      }

      const lat = Number(results[0].lat);
      const lng = Number(results[0].lon);
      map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true });
      searchMarkerRef.current?.remove();
      searchMarkerRef.current = L.marker([lat, lng]).addTo(map);
      searchMarkerRef.current.bindPopup(`<div class="popup-risco popup-risco--point"><h3 class="popup-bairro">${query}</h3></div>`).openPopup();
    } catch (searchFailure) {
      setSearchError(searchFailure instanceof Error ? searchFailure.message : "Busca indisponível.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="map-panel" aria-label="Mapa de riscos">
      <div className="map-toolbar">
        <form className="map-search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="map-search-input">Buscar bairro ou rua</label>
          <input id="map-search-input" type="text" placeholder="Buscar bairro ou rua..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
          <button type="submit" className="map-search__button" aria-label="Buscar no mapa" disabled={searching}>⌕</button>
        </form>
        {searchError && <p className="map-search__error">{searchError}</p>}
      </div>

      <div className="map-wrap">
        <div ref={containerRef} className="map" />
        <aside className="map-legend-card" aria-label="Níveis de enchente">
          <ul className="map-legend-list">
            {(["Baixo", "Médio", "Alto", "Muito Alto"] as const).map((nivel) => (
              <li className="map-legend-list__item" key={nivel}>
                <span className="map-legend-list__swatch" style={{ backgroundColor: getColor("Enchente", nivel) }} />
                {nivel === "Muito Alto" ? "Muito alto" : nivel}
              </li>
            ))}
          </ul>
        </aside>
        {loading && <div className="map-status">Carregando dados…</div>}
        {error && <div className="map-status map-status--err">Erro: {error}</div>}
      </div>
    </div>
  );
}
