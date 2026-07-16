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
          <h1>Riscos Climáticos</h1>
        </div>
      </div>

      <nav className="site-nav" aria-label="Seções do site">
        <a href="#mapa">Mapa</a>
        <a href="#acoes">Ações da Defensoria</a>
        <a href="#timeline">Linha do tempo</a>
      </nav>
    </header>
  );
}
