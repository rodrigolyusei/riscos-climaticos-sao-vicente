import { useEffect, useRef, useState } from "react";

const acoes = [
  {
    category: "Recomendação",
    date: "16 de julho de 2026",
    title: "Reforça preparação para o El Niño com obras de contenção",
    description:
      "Município amplia ações para reduzir impactos das chuvas, fortalecer a Defesa Civil e garantir mais segurança à população.",
    url: "https://www.saovicente.sp.gov.br/informacao/sao-vicente-reforca-preparacao-para-o-el-nino-com-obras-de-drenagem-investimentos-e-plano-preventivo",
  },
  {
    category: "Visita técnica",
    date: "12 de abril de 2026",
    title: "Defensoria realiza visita técnica ao morro do Catiapoã",
    description:
      "Equipe percorreu áreas de risco após chuvas e ouviu moradores sobre encaminhamentos de contenção e realocação.",
    url: "#",
  },
  {
    category: "Audiência",
    date: "28 de março de 2026",
    title: "Audiência pública debate justiça climática em São Vicente",
    description:
      "Encontro reuniu poder público, sociedade civil e comunidades para discutir prevenção e enfrentamento dos riscos.",
    url: "#",
  },
  {
    category: "Recomendação",
    date: "05 de março de 2026",
    title: "Recomendação exige obras de drenagem em Vila Margarida",
    description:
      "Defensoria enviou recomendação à prefeitura solicitando cronograma público de drenagem e contenção de encostas.",
    url: "#",
  },
  {
    category: "Educação",
    date: "18 de fevereiro de 2026",
    title: "Campanha educativa chega a escolas municipais",
    description:
      "Ação leva conteúdos sobre riscos climáticos e direitos aos alunos e famílias das áreas mais vulneráveis.",
    url: "#",
  },
];

export function AcoesDefesaCivil() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(acoes.length);
  const [slidePx, setSlidePx] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function measure() {
      const track = el!.querySelector<HTMLElement>(".carousel__track");
      const card = track?.querySelector<HTMLElement>(".acao-card");
      if (!track || !card) return;

      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const cardW = card.offsetWidth;
      const vw = el!.clientWidth;

      setSlidePx(cardW + gap);
      setVisibleCount(Math.max(1, Math.floor((vw + gap) / (cardW + gap))));
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxIndex = Math.max(0, acoes.length - visibleCount);

  function prev() {
    setIndex((i) => Math.max(0, i - visibleCount));
  }

  function next() {
    setIndex((i) => Math.min(maxIndex, i + visibleCount));
  }

  return (
    <div className="section-wrapper">
      <p className="eyebrow">Notícias e iniciativas</p>
      <h2>Ações da Defesa Civil</h2>

      <div className="carousel">
        <button
          className="carousel__arrow carousel__arrow--left"
          onClick={prev}
          disabled={index === 0}
          aria-label="Anterior"
        >
          &#9664;
        </button>

        <div className="carousel__viewport" ref={viewportRef}>
          <div
            className="carousel__track"
            style={{
              transform: `translateX(-${index * slidePx}px)`,
            }}
          >
            {acoes.map((acao) => (
              <article key={acao.title} className="acao-card">
                <span className="acao-card__category">{acao.category}</span>
                <time className="acao-card__date">{acao.date}</time>
                <h3 className="acao-card__title">{acao.title}</h3>
                <p className="acao-card__desc">{acao.description}</p>
                <a href={acao.url} className="acao-card__link">
                  Ler mais
                </a>
              </article>
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
