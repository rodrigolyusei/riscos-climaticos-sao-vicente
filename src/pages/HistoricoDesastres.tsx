import { useEffect, useRef, useState } from "react";

const eventos = [
  {
    date: "Fevereiro / 2013",
    title: "Deslizamento no morro do Itararé",
    description:
      "Devido às chuvas, aconteceu um deslizamento de terra no Morro do Itararé. Residências foram afetadas.",
    tags: ["Itararé"],
    url: "https://g1.globo.com/sp/santos-regiao/noticia/2013/02/foi-um-arraso-diz-vitima-de-deslizamento-em-sao-vicente-sp.html",
  },
  {
    date: "Janeiro / 2015",
    title: "Chuva esperada para 20 dias cai em 10 horas",
    description:
      "Alagamento na Avenida Monteiro Lobato e em trechos do Jóquei Clube. Surgiu uma cratera na rua Pero Lopes de Souza por conta das chuvas",
    tags: ["Jóquei Clube", "Monteiro Lobato"],
    url: "https://g1.globo.com/sp/santos-regiao/noticia/2015/01/chuva-esperada-para-20-dias-cai-em-10-horas-e-provoca-estragos-no-litoral.html",
  },
  {
    date: "Novembro / 2016",
    title: "Forte chuva destelha diversas casas",
    description:
      "Chuva intensa com raios causou quedas de energia, destelhamento de residências e alagamentos.",
    tags: ["Jóquei Clube"],
    url: "https://g1.globo.com/sp/santos-regiao/noticia/2016/11/forte-chuva-atinge-regiao-e-destelha-diversas-casas-em-sao-vicente-sp.html",
  },
  {
    date: "Março / 2020",
    title: "Temporal causa alagamentos e deslizamentos",
    description:
      "24 horas de temporais, deslizamentos nos morros de Itararé, Ilha Porchat, Voturuá e Parque Prainha, 03 mortes.",
    tags: ["Itararé", "Ilha Porchat", "Voturuá", "Parque Prainha"],
    url: "https://g1.globo.com/sp/santos-regiao/noticia/2023/03/03/tragedias-por-temporal-em-guaruja-e-sao-vicente-completam-tres-anos-veja-antes-e-depois.ghtml",
  },
  {
    date: "Fevereiro / 2023",
    title: "Temporal causa estragos em São Vicente",
    description:
      "Dois dias seguidos de tempestade e ventos, 173mm acumulados de chuva em São Vicente.",
    tags: ["Jóquei Clube", "Cidade Náutica", "Parque São Vicente"],
    url: "https://g1.globo.com/sp/santos-regiao/noticia/2023/02/20/veja-o-que-se-sabe-sobre-os-estragos-causados-pelo-temporal-que-castigou-as-cidades-da-baixada-santista.ghtml",
  },
  {
    date: "Fevereiro / 2026",
    title: "Temporal causa estragos em São Vicente",
    description:
      "Alagamento na Área Continental. Mais de 89mm acumulados em 72 horas, 01º maior do estado de São Paulo.",
    tags: ["Parque Bitaru", "Vila Margarida", "Jardim Rio Branco"],
    url: "https://www.youtube.com/watch?v=TM8zwrEZlfM",
  },
];

export function HistoricoDesastres() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(eventos.length);
  const [slidePx, setSlidePx] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function measure() {
      const track = el!.querySelector<HTMLElement>(".timeline");
      const item = track?.querySelector<HTMLElement>(".timeline__item");
      if (!track || !item) return;

      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const itemW = item.offsetWidth;
      const vw = el!.clientWidth;

      setSlidePx(itemW + gap);
      setVisibleCount(Math.max(1, Math.floor((vw + gap) / (itemW + gap))));
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxIndex = Math.max(0, eventos.length - visibleCount);

  function prev() {
    setIndex((i) => Math.max(0, i - visibleCount));
  }

  function next() {
    setIndex((i) => Math.min(maxIndex, i + visibleCount));
  }

  return (
    <div className="section-wrapper">
      <p className="eyebrow">Linha do tempo</p>
      <h2>Históricos de Desastres</h2>

      <div className="carousel">
        <button
          className="carousel__arrow carousel__arrow--left"
          onClick={prev}
          disabled={index === 0}
          aria-label="Anterior"
        >
          &#9664;
        </button>

        <div className="timeline-scroll" ref={viewportRef}>
          <div
            className="timeline"
            style={{
              transform: `translateX(-${index * slidePx}px)`,
            }}
          >
            <div className="timeline__line" />

            {eventos.map((evento, i) => (
              <div
                key={evento.date}
                className={`timeline__item timeline__item--${i % 2 === 0 ? "above" : "below"}`}
              >
                <div className="timeline__dot" />
                <div className="timeline__card">
                  <div className="timeline__tags">
                    {evento.tags.map((tag) => (
                      <span key={tag} className="timeline__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="timeline__date">{evento.date}</time>
                  <h3 className="timeline__title">{evento.title}</h3>
                  <p className="timeline__desc">{evento.description}</p>
                  <a href={evento.url} className="timeline__link">
                    Ler mais
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel__arrow carousel__arrow--right"
          onClick={next}
          disabled={index >= maxIndex}
          aria-label="Próximo"
        >
          &#9654;
        </button>
      </div>
    </div>
  );
}
