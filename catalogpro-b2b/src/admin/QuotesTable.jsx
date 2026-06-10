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
                <td>#{quote.id}</td>
                <td>{quote.name}</td>
                <td>{quote.company}</td>
                <td>{quote.phone}</td>
                <td>{quote.email}</td>
                <td><span className={`admin-status admin-status-${quote.status}`}>{quote.status}</span></td>
                <td>{formatDate(quote.createdAt)}</td>
                <td>{quote.items?.length || 0}</td>
                <td>
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
