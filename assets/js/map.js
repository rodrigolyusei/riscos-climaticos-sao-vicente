const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true,
}).setView([-23.9636, -46.3914], 13);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
}).addTo(map);

const statusPill = document.getElementById("status-pill");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const riskPalette = {
  muito_alto: "#8a1538",
  alto: "#d94841",
  medio: "#f29f05",
  baixo: "#2f9e44",
  default: "#4dd0e1",
};

let geojsonLayer = null;
let featuresIndex = [];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getRiskValue(properties) {
  return normalizeText(
    properties?.risco ||
      properties?.classificacao ||
      properties?.nivel ||
      properties?.risk ||
      properties?.categoria,
  );
}

function getStrokeColor(properties) {
  const risk = getRiskValue(properties);
  if (risk.includes("muito") && risk.includes("alto"))
    return riskPalette.muito_alto;
  if (risk.includes("alto")) return riskPalette.alto;
  if (risk.includes("medio")) return riskPalette.medio;
  if (risk.includes("baixo")) return riskPalette.baixo;
  return riskPalette.default;
}

function buildPopupContent(properties) {
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

function fitToData(layer) {
  const bounds = layer.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds.pad(0.12));
  }
}

function updateStatus(message) {
  statusPill.textContent = message;
}

function highlightFeature(layer) {
  layer.setStyle({
    weight: 4,
    fillOpacity: 0.8,
    opacity: 1,
  });
  layer.bringToFront();
}

function resetHighlight(layer) {
  geojsonLayer.resetStyle(layer);
}

function styleFeature(feature) {
  const color = getStrokeColor(feature.properties);
  return {
    color,
    weight: 2,
    opacity: 1,
    fillColor: color,
    fillOpacity: 0.45,
    lineJoin: "round",
  };
}

function onEachFeature(feature, layer) {
  const properties = feature.properties || {};
  layer.bindPopup(buildPopupContent(properties), { maxWidth: 280 });
  layer.on({
    mouseover: () => highlightFeature(layer),
    mouseout: () => resetHighlight(layer),
    click: () =>
      updateStatus(
        `Selecionado: ${properties.bairro || properties.nome || properties.name || "área do mapa"}`,
      ),
  });
}

function indexFeatures(features) {
  featuresIndex = features
    .map((feature) => ({
      feature,
      label: normalizeText(
        feature?.properties?.bairro ||
          feature?.properties?.nome ||
          feature?.properties?.name,
      ),
      searchText: normalizeText(JSON.stringify(feature?.properties || {})),
    }))
    .filter((item) => item.label || item.searchText);
}

function searchFeature(term) {
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
    .getLayers()
    .find((layer) => layer.feature === match.feature);
  if (targetLayer) {
    targetLayer.openPopup();
    map.fitBounds(targetLayer.getBounds().pad(0.2));
    updateStatus(
      `Resultado encontrado: ${match.feature.properties?.bairro || match.feature.properties?.nome || match.feature.properties?.name}`,
    );
  }
}

async function loadGeoJson() {
  try {
    const response = await fetch(
      "assets/data/risco_deslizamento_SV_DefesaCivil.geojson",
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(`Falha ao carregar o GeoJSON (${response.status})`);
    }

    const geojson = await response.json();
    const features = Array.isArray(geojson.features) ? geojson.features : [];

    if (geojsonLayer) {
      geojsonLayer.removeFrom(map);
    }

    geojsonLayer = L.geoJSON(geojson, {
      style: styleFeature,
      onEachFeature,
    }).addTo(map);

    indexFeatures(features);

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

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchFeature(searchInput.value);
});

searchInput.addEventListener("input", () => {
  if (!searchInput.value.trim()) {
    updateStatus("Digite um bairro para localizar no mapa.");
  }
});

loadGeoJson();
