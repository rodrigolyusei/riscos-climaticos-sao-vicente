import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function Notificacoes() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || !email.trim()) return;
    setSubmitted(true);
  }

  function handleDismiss() {
    setSubmitted(false);
    setPhone("");
    setEmail("");
  }

  return (
    <div className="notificacoes-wrapper">
      <h2>Receba notícias do seu bairro em tempo real</h2>
      <p className="notificacoes__desc">
        Cadastre seu WhatsApp e email para receber notícias e avisos de risco
        climático.
      </p>
      <form className="notificacoes__form" onSubmit={handleSubmit}>
        <div className="notificacoes__field">
          <FaWhatsapp className="notificacoes__icon notificacoes__icon--whatsapp" />
          <label className="sr-only" htmlFor="notif-phone">
            Número de WhatsApp
          </label>
          <input
            id="notif-phone"
            type="tel"
            placeholder="Seu WhatsApp..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="notificacoes__field">
          <MdEmail className="notificacoes__icon notificacoes__icon--email" />
          <label className="sr-only" htmlFor="notif-email">
            Endereço de email
          </label>
          <input
            id="notif-email"
            type="email"
            placeholder="Seu email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="notificacoes__submit">
          Cadastrar
        </button>
      </form>

      {submitted && (
        <div className="notificacoes__modal-overlay" onClick={handleDismiss}>
          <div
            className="notificacoes__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cadastro realizado!</h3>
            <p>
              Você receberá notificações de risco climático no WhatsApp e no
              email cadastrados.
            </p>
            <button className="notificacoes__modal-btn" onClick={handleDismiss}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
