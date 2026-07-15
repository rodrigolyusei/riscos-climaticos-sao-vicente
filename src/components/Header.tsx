import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <img src="/img/logo-1.png" alt="Logo do projeto" className="brand__logo" />
        <div>
          <p className="brand__eyebrow">Observatório de Justiça Climática</p>
          <h1>Riscos Climáticos de São Vicente</h1>
        </div>
      </div>

      <nav className="site-nav" aria-label="Páginas do site">
        <NavLink to="/" end>Mapa</NavLink>
        <NavLink to="/referencias">Referências</NavLink>
        <NavLink to="/definicoes">Definições</NavLink>
      </nav>
    </header>
  );
}
