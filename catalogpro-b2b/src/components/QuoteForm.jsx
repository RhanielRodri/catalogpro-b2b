import { useState } from "react";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const initialFormData = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  observacao: ""
};

function QuoteForm({
  quoteItems,
  onSubmitQuote,
  isSubmittingQuote,
  quoteSuccessMessage,
  quoteErrorMessage
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const nextErrors = {};

    ["nome", "empresa", "telefone", "email"].forEach((field) => {
      if (!formData[field].trim()) {
        nextErrors[field] = "Campo obrigatório";
      }
    });

    if (quoteItems.length === 0) {
      nextErrors.items = "Adicione pelo menos um produto à cotação";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const whatsappUrl = buildWhatsAppUrl(formData, quoteItems);
    const wasSaved = await onSubmitQuote(formData);

    if (wasSaved) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setFormData(initialFormData);
      setErrors({});
    }
  }

  return (
    <form className="quoteForm" onSubmit={handleSubmit} noValidate>
      <h3>Dados para orçamento</h3>

      {quoteSuccessMessage && <p className="formSuccess">{quoteSuccessMessage}</p>}
      {quoteErrorMessage && <p className="formError">{quoteErrorMessage}</p>}
      {errors.items && <p className="formError">{errors.items}</p>}

      <div className="quoteFormRow">
        <label>
          Nome
          <input name="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome" />
          {errors.nome && <span>{errors.nome}</span>}
        </label>
        <label>
          Empresa
          <input name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Razão social" />
          {errors.empresa && <span>{errors.empresa}</span>}
        </label>
      </div>

      <div className="quoteFormRow">
        <label>
          Telefone
          <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" />
          {errors.telefone && <span>{errors.telefone}</span>}
        </label>
        <label>
          E-mail
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@empresa.com.br" />
          {errors.email && <span>{errors.email}</span>}
        </label>
      </div>

      <label>
        Observação
        <textarea name="observacao" rows="3" value={formData.observacao} onChange={handleChange} placeholder="Prazo, forma de entrega, condições especiais..." />
      </label>

      <button className="primaryButton fullWidth" type="submit" disabled={isSubmittingQuote}>
        {isSubmittingQuote ? "Registrando cotação..." : "Registrar cotação e abrir WhatsApp"}
      </button>
    </form>
  );
}

export default QuoteForm;
