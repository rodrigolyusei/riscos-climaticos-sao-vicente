import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onMapReady: (map: L.Map) => void;
}

export function Map({ onMapReady }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      preferCanvas: true,
      minZoom: 2,
      maxZoom: 20,
    }).setView([-23.9636, -46.3914] as L.LatLngExpression, 13);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(map);

    mapRef.current = map;
    onMapReady(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} id="map" aria-label="Mapa interativo de riscos climáticos" />;
}
