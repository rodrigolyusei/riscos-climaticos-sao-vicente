import { FiClock } from "react-icons/fi";

const contatos = [
  {
    name: "Defesa Civil",
    number: "199",
    hours: "24h",
    description:
      "Risco iminente, desabamentos, inundações e evacuação de áreas.",
    url: null,
  },
  {
    name: "Corpo de Bombeiros",
    number: "193",
    hours: "24h",
    description: "Resgate, incêndios e salvamento em áreas alagadas.",
    url: null,
  },
  {
    name: "SAMU",
    number: "192",
    hours: "24h",
    description: "Atendimento médico de urgência.",
    url: null,
  },
  {
    name: "Polícia Militar",
    number: "190",
    hours: "24h",
    description: "Segurança pública e apoio à evacuação de áreas de risco.",
    url: null,
  },
  {
    name: "Defensoria Pública",
    number: "(13) 2102-3900",
    hours: "Seg-Sex, 9h-17h",
    description:
      "Apoio jurídico a famílias afetadas e direitos em emergências.",
    url: "https://www.defensoria.sp.def.br/web/guest/home",
  },
  {
    name: "Prefeitura de São Vicente",
    number: "(13) 3579-1300",
    hours: "Seg-Sex, 8h-17h",
    description: "Obras emergenciais e apoio habitacional pós-desastre.",
    url: "https://www.saovicente.sp.gov.br/",
  },
];

export function Contatos() {
  return (
    <div className="section-wrapper">
      <p className="eyebrow">Ajuda rápida</p>
      <h2>Contatos de Emergência</h2>

      <div className="contatos-grid">
        {contatos.map((contato) => (
          <article key={contato.name} className="contato-card">
            <h3 className="contato-card__name">{contato.name}</h3>
            <span className="contato-card__number">{contato.number}</span>
            <div className="contato-card__schedule">
              <FiClock className="contato-card__clock" />
              <span>{contato.hours}</span>
            </div>
            <p className="contato-card__desc">{contato.description}</p>
            {contato.url && (
              <a
                href={contato.url}
                className="contato-card__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Site
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
