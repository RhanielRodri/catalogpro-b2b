import { useState } from "react";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const initialFormData = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  observacao: ""
};

function QuoteForm({ quoteItems }) {
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

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    window.open(buildWhatsAppUrl(formData, quoteItems), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="quoteForm" onSubmit={handleSubmit} noValidate>
      <h3>Dados para orçamento</h3>
      {errors.items && <p className="formError">{errors.items}</p>}

      <label>
        Nome
        <input name="nome" value={formData.nome} onChange={handleChange} />
        {errors.nome && <span>{errors.nome}</span>}
      </label>

      <label>
        Empresa
        <input name="empresa" value={formData.empresa} onChange={handleChange} />
        {errors.empresa && <span>{errors.empresa}</span>}
      </label>

      <label>
        Telefone
        <input name="telefone" value={formData.telefone} onChange={handleChange} />
        {errors.telefone && <span>{errors.telefone}</span>}
      </label>

      <label>
        E-mail
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email && <span>{errors.email}</span>}
      </label>

      <label>
        Observação
        <textarea name="observacao" rows="4" value={formData.observacao} onChange={handleChange} />
      </label>

      <button className="primaryButton fullWidth" type="submit">
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}

export default QuoteForm;
