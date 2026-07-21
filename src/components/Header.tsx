export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <img
          src="/img/logo-1.png"
          alt="Logo do projeto"
          className="brand__logo"
        />
        <div>
          <p className="brand__eyebrow">Observatório de Justiça Climática</p>
          <h1>Radar Cidadão</h1>
        </div>
      </div>
      <nav className="site-nav" aria-label="Seções do site">
        <a href="#mapa">Mapa</a>
        <a href="#acoes">Ações</a>
        <a href="#timeline">Conheça o histórico</a>
      </nav>
    </header>
  );
}
