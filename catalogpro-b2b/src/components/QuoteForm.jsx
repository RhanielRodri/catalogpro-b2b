import { useState } from "react";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { useTranslation } from "../i18n/I18nContext";

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
  const { t } = useTranslation();
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
        nextErrors[field] = t.form_required;
      }
    });

    if (quoteItems.length === 0) {
      nextErrors.items = t.form_items_required;
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
      <h3>{t.form_title}</h3>

      {quoteSuccessMessage && <p className="formSuccess">{quoteSuccessMessage}</p>}
      {quoteErrorMessage && <p className="formError">{quoteErrorMessage}</p>}
      {errors.items && <p className="formError">{errors.items}</p>}

      <div className="quoteFormRow">
        <label>
          {t.form_name}
          <input name="nome" value={formData.nome} onChange={handleChange} placeholder={t.form_name_placeholder} />
          {errors.nome && <span>{errors.nome}</span>}
        </label>
        <label>
          {t.form_company}
          <input name="empresa" value={formData.empresa} onChange={handleChange} placeholder={t.form_company_placeholder} />
          {errors.empresa && <span>{errors.empresa}</span>}
        </label>
      </div>

      <div className="quoteFormRow">
        <label>
          {t.form_phone}
          <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder={t.form_phone_placeholder} />
          {errors.telefone && <span>{errors.telefone}</span>}
        </label>
        <label>
          {t.form_email}
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t.form_email_placeholder} />
          {errors.email && <span>{errors.email}</span>}
        </label>
      </div>

      <label>
        {t.form_notes}
        <textarea name="observacao" rows="3" value={formData.observacao} onChange={handleChange} placeholder={t.form_notes_placeholder} />
      </label>

      <button className="primaryButton fullWidth" type="submit" disabled={isSubmittingQuote}>
        {isSubmittingQuote ? t.form_submitting : t.form_submit}
      </button>
    </form>
  );
}

export default QuoteForm;
