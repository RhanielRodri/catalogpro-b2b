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
      <aside className={`quoteDrawer ${isOpen ? "isOpen" : ""}`} aria-hidden={!isOpen} aria-label="Cotação">
        <div className="drawerHeader">
          <div>
            <span className="eyebrow">Lista de cotação</span>
            <h2>{totalItems} {totalItems === 1 ? "item" : "itens"} selecionados</h2>
          </div>
          <button className="iconButton" type="button" onClick={onClose} aria-label="Fechar cotação">
            ×
          </button>
        </div>

        <div className="quoteItems">
          {quoteItems.length === 0 ? (
            <div className="quoteEmpty">
              <strong>Cotação vazia</strong>
              <p>Adicione produtos do catálogo para montar a solicitação de orçamento.</p>
            </div>
          ) : (
            quoteItems.map((item) => (
              <article className="quoteItem" key={item.id}>
                <div className="quoteItemInfo">
                  <strong>{item.nome}</strong>
                  <span>{item.categoria} · {item.unidade} · <span className="skuValue">{item.sku}</span></span>
                </div>
                <div className="quoteItemActions">
                  <div className="quantityControls">
                    <button type="button" onClick={() => onDecrease(item.id)} aria-label={`Diminuir quantidade de ${item.nome}`}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onIncrease(item.id)} aria-label={`Aumentar quantidade de ${item.nome}`}>
                      +
                    </button>
                  </div>
                  <button className="removeButton" type="button" onClick={() => onRemove(item.id)}>
                    Remover
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {quoteItems.length > 0 && (
          <div className="quoteSummary">
            <span>{quoteItems.length} {quoteItems.length === 1 ? "produto" : "produtos"}</span>
            <strong>{totalItems} {totalItems === 1 ? "unidade" : "unidades"} no total</strong>
          </div>
        )}

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
