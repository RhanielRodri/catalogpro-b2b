const statuses = [
  { key: "NEW", label: "Novas" },
  { key: "IN_REVIEW", label: "Em análise" },
  { key: "ANSWERED", label: "Respondidas" },
  { key: "CLOSED", label: "Fechadas" }
];

function AdminDashboard({ quotes }) {
  const totals = statuses.map((status) => ({
    ...status,
    total: quotes.filter((quote) => quote.status === status.key).length
  }));

  return (
    <section className="admin-metrics" aria-label="Resumo de cotações">
      <article className="admin-metric">
        <span>Total</span>
        <strong>{quotes.length}</strong>
      </article>

      {totals.map((status) => (
        <article className="admin-metric" key={status.key}>
          <span>{status.label}</span>
          <strong>{status.total}</strong>
        </article>
      ))}
    </section>
  );
}

export default AdminDashboard;
