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

function QuotesTable({ quotes, selectedQuoteId, onSelectQuote }) {
  if (quotes.length === 0) {
    return (
      <section className="admin-panel admin-empty">
        <strong>Nenhuma cotação registrada</strong>
        <p>As solicitações enviadas pelo catálogo público aparecerão aqui.</p>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-panelHeader">
        <div>
          <span className="admin-eyebrow">Solicitações</span>
          <h2>Cotações recebidas</h2>
        </div>
      </div>

      <div className="admin-tableWrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Data</th>
              <th>Itens</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr className={quote.id === selectedQuoteId ? "is-selected" : ""} key={quote.id}>
                <td data-label="ID">#{quote.id}</td>
                <td data-label="Nome">{quote.name}</td>
                <td data-label="Empresa">{quote.company}</td>
                <td data-label="Telefone">{quote.phone}</td>
                <td data-label="E-mail">{quote.email}</td>
                <td data-label="Status">
                  <span className={`admin-status admin-status-${quote.status}`}>
                    {statusLabels[quote.status] ?? quote.status}
                  </span>
                </td>
                <td data-label="Data">{formatDate(quote.createdAt)}</td>
                <td data-label="Itens">{quote.items?.length ?? 0}</td>
                <td data-label="Ação">
                  <button className="admin-secondaryButton" type="button" onClick={() => onSelectQuote(quote)}>
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default QuotesTable;
