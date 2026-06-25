import { useTranslation } from "../i18n/I18nContext";
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
  const { t } = useTranslation();

  return (
    <>
      <div className={`drawerBackdrop ${isOpen ? "isOpen" : ""}`} onClick={onClose} />
      <aside className={`quoteDrawer ${isOpen ? "isOpen" : ""}`} aria-hidden={!isOpen} aria-label="Cotação">
        <div className="drawerHeader">
          <div>
            <span className="eyebrow">{t.quote_list}</span>
            <h2>{t.quote_items(totalItems)}</h2>
          </div>
          <button className="iconButton" type="button" onClick={onClose} aria-label={t.quote_close_aria}>
            ×
          </button>
        </div>

        <div className="quoteItems">
          {quoteItems.length === 0 ? (
            <div className="quoteEmpty">
              <strong>{t.quote_empty_title}</strong>
              <p>{t.quote_empty_desc}</p>
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
                    <button type="button" onClick={() => onDecrease(item.id)} aria-label={t.quote_decrease_aria(item.nome)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onIncrease(item.id)} aria-label={t.quote_increase_aria(item.nome)}>
                      +
                    </button>
                  </div>
                  <button className="removeButton" type="button" onClick={() => onRemove(item.id)}>
                    {t.quote_remove}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {quoteItems.length > 0 && (
          <div className="quoteSummary">
            <span>{t.quote_summary(quoteItems.length, totalItems)}</span>
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
