import QuoteForm from "./QuoteForm";

function QuoteDrawer({
  isOpen,
  quoteItems,
  totalItems,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onSubmitQuote,
  isSubmittingQuote,
  quoteSuccessMessage,
  quoteErrorMessage
}) {
  return (
    <>
      <div className={`drawerBackdrop ${isOpen ? "isOpen" : ""}`} onClick={onClose} />
      <aside className={`quoteDrawer ${isOpen ? "isOpen" : ""}`} aria-hidden={!isOpen}>
        <div className="drawerHeader">
          <div>
            <span className="eyebrow">Lista de cotação</span>
            <h2>{totalItems} {totalItems === 1 ? "item" : "itens"}</h2>
          </div>
          <button className="iconButton" type="button" onClick={onClose} aria-label="Fechar cotação">
            ×
          </button>
        </div>

        <div className="quoteItems">
          {quoteItems.length === 0 ? (
            <div className="quoteEmpty">
              <strong>Sua cotação está vazia</strong>
              <p>Adicione produtos do catálogo para montar a solicitação.</p>
            </div>
          ) : (
            quoteItems.map((item) => (
              <article className="quoteItem" key={item.id}>
                <div>
                  <strong>{item.nome}</strong>
                  <span>{item.sku} · {item.unidade}</span>
                </div>
                <div className="quantityControls">
                  <button type="button" onClick={() => onDecrease(item.id)} aria-label={`Diminuir ${item.nome}`}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onIncrease(item.id)} aria-label={`Aumentar ${item.nome}`}>
                    +
                  </button>
                </div>
                <button className="removeButton" type="button" onClick={() => onRemove(item.id)}>
                  Remover
                </button>
              </article>
            ))
          )}
        </div>

        <QuoteForm
          quoteItems={quoteItems}
          onSubmitQuote={onSubmitQuote}
          isSubmittingQuote={isSubmittingQuote}
          quoteSuccessMessage={quoteSuccessMessage}
          quoteErrorMessage={quoteErrorMessage}
        />
      </aside>
    </>
  );
}

export default QuoteDrawer;
