export function Legend() {
  return (
    <aside className="legend-card" aria-label="Legenda do mapa">
      <h2>Legenda</h2>
      <ul>
        <li>
          <span className="legend-swatch legend-swatch--muito-alto" /> Muito
          alto
        </li>
        <li>
          <span className="legend-swatch legend-swatch--alto" /> Alto
        </li>
        <li>
          <span className="legend-swatch legend-swatch--medio" /> Médio
        </li>
        <li>
          <span className="legend-swatch legend-swatch--baixo" /> Baixo
        </li>
      </ul>
      <p>
        Os dados são carregados de um arquivo GeoJSON local e podem ser
        substituídos pelo mapeamento oficial dos bairros.
      </p>
    </aside>
  );
}
