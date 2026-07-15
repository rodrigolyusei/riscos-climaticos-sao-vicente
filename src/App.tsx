import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Mapa } from "./pages/Mapa";
import { Referencias } from "./pages/Referencias";
import { Definicoes } from "./pages/Definicoes";

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Mapa />} />
        <Route path="/referencias" element={<Referencias />} />
        <Route path="/definicoes" element={<Definicoes />} />
      </Routes>
    </>
  );
}
