export function Referencias() {
  return (
    <main className="page-shell">
      <article className="page-card page-grid">
        <div>
          <p className="brand__eyebrow">Fontes e bases</p>
          <h2>Documentação das referências usadas no mapa</h2>
          <p>
            Esta página pode concentrar os dados de origem, critérios de
            classificação, versões do mapeamento e links para os arquivos
            oficiais usados na construção do painel.
          </p>
        </div>

        <ul className="info-list">
          <li>
            <strong>GeoJSON local:</strong> arquivo base carregado pelo mapa em
            tempo de execução.
          </li>
          <li>
            <strong>Cartografia:</strong> base de mapa fornecida pelo Leaflet e
            pelas camadas de fundo da CARTO/OpenStreetMap.
          </li>
          <li>
            <strong>Atualização futura:</strong> espaço para inserir o vínculo
            com relatórios, planilhas e documentos oficiais.
          </li>
        </ul>
      </article>
    </main>
  );
}
