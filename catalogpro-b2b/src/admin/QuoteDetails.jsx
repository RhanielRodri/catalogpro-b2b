import { useEffect, useState } from "react";

const statusOptions = [
  { value: "NEW", label: "Nova" },
  { value: "IN_REVIEW", label: "Em análise" },
  { value: "ANSWERED", label: "Respondida" },
  { value: "CLOSED", label: "Fechada" }
];

const statusLabels = {
  NEW: "Nova",
  IN_REVIEW: "Em análise",
  ANSWERED: "Respondida",
  CLOSED: "Fechada"
};

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function QuoteDetails({
  quote,
  isUpdating,
  successMessage,
  errorMessage,
  onUpdateStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState(quote?.status || "NEW");

  useEffect(() => {
    setSelectedStatus(quote?.status || "NEW");
  }, [quote]);

  if (!quote) {
    return (
      <aside className="admin-panel admin-details admin-empty">
        <strong>Selecione uma cotação</strong>
        <p>Use a tabela para abrir os detalhes e gerenciar o status comercial.</p>
      </aside>
    );
  }

  return (
    <aside className="admin-panel admin-details">
      <div className="admin-panelHeader">
        <div>
          <span className="admin-eyebrow">#{quote.id} · {formatDate(quote.createdAt)}</span>
          <h2>{quote.company}</h2>
        </div>
        <span className={`admin-status admin-status-${quote.status}`}>
          {statusLabels[quote.status] ?? quote.status}
        </span>
      </div>

      {successMessage && <p className="admin-success" role="status">{successMessage}</p>}
      {errorMessage && <p className="admin-error" role="alert">{errorMessage}</p>}

      <dl className="admin-definitionGrid">
        <div>
          <dt>Nome do contato</dt>
          <dd>{quote.name}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{quote.phone}</dd>
        </div>
        <div className="admin-definitionFull">
          <dt>E-mail</dt>
          <dd>{quote.email}</dd>
        </div>
      </dl>

      {quote.notes && (
        <div className="admin-notes">
          <dt>Observação</dt>
          <dd>{quote.notes}</dd>
        </div>
      )}

      <section className="admin-items">
        <h3>{quote.items?.length ?? 0} {quote.items?.length === 1 ? "produto" : "produtos"} solicitados</h3>
        {quote.items?.map((item) => (
          <article className="admin-item" key={item.id}>
            <div>
              <strong>{item.product?.name}</strong>
              <span className="admin-itemMeta">{item.product?.category?.name} · <span className="skuValue">{item.product?.sku}</span> · {item.product?.unit}</span>
            </div>
            <strong className="admin-itemQty">{item.quantity}×</strong>
          </article>
        ))}
      </section>

      <form
        className="admin-statusForm"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdateStatus(quote.id, selectedStatus);
        }}
      >
        <label>
          Alterar status
          <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </label>
        <button className="admin-primaryButton" type="submit" disabled={isUpdating}>
          {isUpdating ? "Atualizando..." : "Salvar status"}
        </button>
      </form>
    </aside>
  );
}

export default QuoteDetails;
