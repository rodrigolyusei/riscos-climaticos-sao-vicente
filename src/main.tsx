import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Header } from "./components/Header";
import { AcoesDefesaCivil } from "./pages/AcoesDefesaCivil";
import { HistoricoDesastres } from "./pages/HistoricoDesastres";
import { MapaRiscos } from "./pages/MapaRiscos";
import { Notificacoes } from "./pages/Notificacoes";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="main">
      <div id="notificacoes" className="notificacoes">
        <Notificacoes />
      </div>
      <div id="mapa" className="section">
        <MapaRiscos />
      </div>
      <div id="acoes" className="section">
        <AcoesDefesaCivil />
      </div>
      <div id="timeline" className="section">
        <HistoricoDesastres />
      </div>
    </main>
  </StrictMode>,
);
