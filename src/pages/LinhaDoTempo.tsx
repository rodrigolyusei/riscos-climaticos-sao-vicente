const eventos = [
  {
    date: "Janeiro / 2020",
    title: "Enchentes atingem 6 bairros",
    description:
      "Chuvas acima da média deixaram famílias desabrigadas e comprometeram vias de acesso nas áreas de canal.",
    tags: ["Vila Margarida", "Catiapoã", "Humaitá"],
  },
  {
    date: "Março / 2022",
    title: "Chuvas intensas causam alagamentos generalizados",
    description:
      "Volume de chuva superou 180 mm em 48h e sobrecarregou o sistema de drenagem urbana.",
    tags: ["Vila Margarida", "Jockey Club", "Catiapoã"],
  },
  {
    date: "Fevereiro / 2024",
    title: "Deslizamento no Parque Prainha",
    description:
      "Movimentação de encosta atingiu residências e motivou plano emergencial de contenção.",
    tags: ["Parque Prainha"],
  },
  {
    date: "Março / 2025",
    title: "Obras de contenção entregues em áreas críticas",
    description:
      "Após recomendações da Defensoria, foram concluídas obras de drenagem e muros de arrimo em pontos prioritários.",
    tags: ["Catiapoã", "Parque Prainha"],
  },
];

export function LinhaDoTempo() {
  return (
    <div className="timeline-wrapper">
      <p className="brand__eyebrow">Linha do tempo</p>
      <h2>Marcos históricos</h2>

      <div className="timeline-scroll">
        <div className="timeline">
          <div className="timeline__line" />

          {eventos.map((evento, i) => (
            <div
              key={evento.date}
              className={`timeline__item timeline__item--${i % 2 === 0 ? "above" : "below"}`}
            >
              <div className="timeline__dot" />
              <div className="timeline__card">
                <time className="timeline__date">{evento.date}</time>
                <h3 className="timeline__title">{evento.title}</h3>
                <p className="timeline__desc">{evento.description}</p>
                <div className="timeline__tags">
                  {evento.tags.map((tag) => (
                    <span key={tag} className="timeline__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
