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
          <p className="eyebrow">Observatório de Justiça Climática</p>
          <h1>Radar Cidadão</h1>
        </div>
      </div>
      <nav className="site-nav" aria-label="Seções do site">
        <a href="#notificacoes">Notificações</a>
        <a href="#mapa">Mapa</a>
        <a href="#acoes">Ações</a>
        <a href="#timeline">Histórico</a>
        <a href="#contatos">Contatos</a>
      </nav>
    </header>
  );
}
