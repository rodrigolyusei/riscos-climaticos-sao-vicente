import { useState } from "react";

const acoes = [
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

export function AcoesDefensoria() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setIndex((i) => Math.min(acoes.length - 1, i + 1));
  }

  return (
    <div className="acoes-wrapper">
      <p className="brand__eyebrow">Ações da Defensoria</p>
      <h2>Notícias e iniciativas</h2>

      <div className="carousel">
        <button
          className="carousel__arrow carousel__arrow--left"
          onClick={prev}
          disabled={index === 0}
          aria-label="Anterior"
        >
          &#9664;
        </button>

        <div className="carousel__viewport">
          <div
            className="carousel__track"
            style={{ transform: `translateX(-${index * (100 / acoes.length)}%)` }}
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
          disabled={index === acoes.length - 1}
          aria-label="Próximo"
        >
          &#9654;
        </button>
      </div>
    </div>
  );
}
