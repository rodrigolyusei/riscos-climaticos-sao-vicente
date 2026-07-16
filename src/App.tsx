import { Header } from "./components/Header";
import { Mapa } from "./pages/Mapa";
import { AcoesDefensoria } from "./pages/AcoesDefensoria";
import { LinhaDoTempo } from "./pages/LinhaDoTempo";

export function App() {
  return (
    <>
      <Header />
      <main className="scroll-container">
        <section id="mapa" className="section">
          <Mapa />
        </section>
        <section id="acoes" className="section">
          <AcoesDefensoria />
        </section>
        <section id="timeline" className="section">
          <LinhaDoTempo />
        </section>
      </main>
    </>
  );
}
