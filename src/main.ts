import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./assets/css/style.css";

const mapEl = document.getElementById("map");
if (!mapEl) {
  console.error("Map element with id 'map' not found.");
  throw new Error("Map element not found");
}

const map: L.Map = L.map(mapEl as HTMLElement, {
  zoomControl: true,
  preferCanvas: true,
  minZoom: 2,
  maxZoom: 20,
}).setView([-23.9636, -46.3914] as L.LatLngExpression, 13);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
}).addTo(map);

const statusPill = document.getElementById(
  "status-pill",
) as HTMLDivElement | null;
const searchForm = document.getElementById(
  "search-form",
) as HTMLFormElement | null;
const searchInput = document.getElementById(
  "search-input",
) as HTMLInputElement | null;

type Props = {
  bairro?: string;
  nome?: string;
  name?: string;
  risco?: string;
  classificacao?: string;
  nivel?: string;
  observacao?: string;
  descricao?: string;
  impacto?: string;
  id?: string | number;
  gid?: string | number;
  codigo?: string | number;
  [key: string]: any;
};

const riskPalette: Record<string, string> = {
  muito_alto: "#8a1538",
  alto: "#d94841",
  medio: "#f29f05",
  baixo: "#2f9e44",
  default: "#4dd0e1",
};

let geojsonLayer: L.GeoJSON | null = null;
type IndexItem = {
  feature: GeoJSON.Feature;
  label: string;
  searchText: string;
  id: string;
};
let featuresIndex: IndexItem[] = [];

function normalizeText(value: unknown): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getRiskValue(properties: Props): string {
  return normalizeText(
    properties?.risco ||
      properties?.classificacao ||
      properties?.nivel ||
      properties?.risk ||
      properties?.categoria,
  );
}

function getStrokeColor(properties: Props) {
  const risk = getRiskValue(properties);
  if (risk.includes("muito") && risk.includes("alto"))
    return riskPalette.muito_alto;
  if (risk.includes("alto")) return riskPalette.alto;
  if (risk.includes("medio")) return riskPalette.medio;
  if (risk.includes("baixo")) return riskPalette.baixo;
  return riskPalette.default;
}

function buildPopupContent(properties: Props): string {
  const bairro =
    properties?.bairro ||
    properties?.nome ||
    properties?.name ||
    "Área sem nome";
  const risco =
    properties?.risco ||
    properties?.classificacao ||
    properties?.nivel ||
    "Não informado";
  const observacao =
    properties?.observacao ||
    properties?.descricao ||
    properties?.impacto ||
    "Sem observações adicionais.";

  return `
    <article>
      <h3 class="popup-title">${bairro}</h3>
      <p class="popup-row"><strong>Risco:</strong> ${risco}</p>
      <p class="popup-row"><strong>Detalhe:</strong> ${observacao}</p>
    </article>
  `;
}

function fitToData(layer: L.GeoJSON) {
  const bounds = layer.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.12));
  }
}

function updateStatus(message: string) {
  if (statusPill) statusPill.textContent = message;
}

function highlightFeature(layer: L.Path): void {
  (layer as any).setStyle({
    weight: 4,
    fillOpacity: 0.8,
    opacity: 1,
  });
  (layer as any).bringToFront();
}

function resetHighlight(layer: L.Path): void {
  if (geojsonLayer) geojsonLayer.resetStyle(layer as any);
}

function styleFeature(feature?: GeoJSON.Feature): L.PathOptions {
  const color = getStrokeColor((feature?.properties as Props) || {});
  return {
    color,
    weight: 2,
    opacity: 1,
    fillColor: color,
    fillOpacity: 0.45,
    lineJoin: "round",
  } as L.PathOptions;
}

function getFeatureId(feature: GeoJSON.Feature): string {
  const props = (feature.properties || {}) as Props;
  const baseId =
    feature.id ??
    props.id ??
    props.gid ??
    props.codigo ??
    props.bairro ??
    props.nome ??
    props.name;
  return String(baseId ?? normalizeText(JSON.stringify(props || {})));
}

function onEachFeature(feature: GeoJSON.Feature, layer: L.Layer): void {
  const properties = (feature.properties || {}) as Props;
  (layer as any)._featureId = getFeatureId(feature);
  (layer as any).bindPopup(buildPopupContent(properties), { maxWidth: 280 });
  (layer as any).on({
    mouseover: () => highlightFeature(layer as any),
    mouseout: () => resetHighlight(layer as any),
    click: () =>
      updateStatus(
        `Selecionado: ${properties.bairro || properties.nome || properties.name || "área do mapa"}`,
      ),
  });
}

function indexFeatures(features: GeoJSON.Feature[]): void {
  featuresIndex = features
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
}

function searchFeature(term: string): void {
  const query = normalizeText(term);
  if (!query) {
    updateStatus("Digite um bairro para localizar no mapa.");
    return;
  }

  const match = featuresIndex.find(
    (item) => item.label.includes(query) || item.searchText.includes(query),
  );
  if (!match) {
    updateStatus(`Nenhum resultado para "${term}".`);
    return;
  }

  const targetLayer = geojsonLayer
    ?.getLayers()
    .find((layer: any) => (layer as any)._featureId === match.id);

  if (targetLayer) {
    targetLayer.openPopup();
    if (typeof (targetLayer as any).getBounds === "function") {
      (map as any).fitBounds((targetLayer as any).getBounds().pad(0.2));
    } else if (typeof (targetLayer as any).getLatLng === "function") {
      const latlng = (targetLayer as any).getLatLng();
      map.setView(latlng, Math.max(map.getZoom(), 15));
    }

    updateStatus(
      `Resultado encontrado: ${(match.feature.properties as Props)?.bairro || (match.feature.properties as Props)?.nome || (match.feature.properties as Props)?.name}`,
    );
  }
}

async function loadGeoJson(): Promise<void> {
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

    if (geojsonLayer) {
      geojsonLayer.removeFrom(map);
    }

    geojsonLayer = L.geoJSON(geojson as any, {
      style: styleFeature,
      onEachFeature,
    }).addTo(map);

    indexFeatures(features as GeoJSON.Feature[]);

    if (features.length > 0) {
      fitToData(geojsonLayer);
      updateStatus(`Mapa carregado com ${features.length} área(s) de risco.`);
    } else {
      updateStatus("GeoJSON carregado, mas sem feições para exibir.");
    }
  } catch (error) {
    console.error(error);
    updateStatus("Não foi possível carregar o GeoJSON local.");
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (searchInput) searchFeature(searchInput.value);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
      updateStatus("Digite um bairro para localizar no mapa.");
    }
  });
}

loadGeoJson();
