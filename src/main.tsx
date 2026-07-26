import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Header } from "./components/Header";
import { AcoesDefesaCivil } from "./pages/AcoesDefensoria";
import { LinhaDoTempo } from "./pages/LinhaDoTempo";
import { Mapa } from "./pages/Mapa";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="scroll-container">
      <section id="mapa" className="section">
        <Mapa />
      </section>
      <section id="acoes" className="section">
        <AcoesDefesaCivil />
      </section>
      <section id="timeline" className="section">
        <LinhaDoTempo />
      </section>
    </main>
  </StrictMode>,
);
