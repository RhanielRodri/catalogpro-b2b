const statuses = [
  { key: "NEW", label: "Novas", modifier: "new" },
  { key: "IN_REVIEW", label: "Em análise", modifier: "review" },
  { key: "ANSWERED", label: "Respondidas", modifier: "answered" },
  { key: "CLOSED", label: "Fechadas", modifier: "closed" }
];

function AdminDashboard({ quotes }) {
  const totals = statuses.map((status) => ({
    ...status,
    total: quotes.filter((quote) => quote.status === status.key).length
  }));

  return (
    <section className="admin-metrics" aria-label="Resumo de cotações">
      <article className="admin-metric admin-metric--total">
        <span>Total recebido</span>
        <strong>{quotes.length}</strong>
      </article>

      {totals.map((status) => (
        <article className={`admin-metric admin-metric--${status.modifier}`} key={status.key}>
          <span>{status.label}</span>
          <strong>{status.total}</strong>
        </article>
      ))}
    </section>
  );
}

export default AdminDashboard;
