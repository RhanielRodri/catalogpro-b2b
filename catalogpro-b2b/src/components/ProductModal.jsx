import { useEffect } from "react";

function ProductModal({ product, onClose, onAddToQuote }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) {
    return null;
  }

  function handleAddToQuote() {
    onAddToQuote(product);
    onClose();
  }

  return (
    <div className="modalOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="iconButton closeButton" type="button" onClick={onClose} aria-label="Fechar modal">
          ×
        </button>
        <div className="modalImage" aria-hidden="true">
          <svg className="productImageIcon" width="44" height="56" viewBox="0 0 44 56" fill="none">
            <rect x="2" y="2" width="40" height="52" rx="5" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
            <rect x="2" y="2" width="40" height="13" rx="5" fill="#e8edf3" stroke="#e2e8f0" strokeWidth="2"/>
            <path d="M10 24h24M10 32h17M10 40h20" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="modalContent">
          <span className="tag">{product.categoria}</span>
          <h2 id="product-modal-title">{product.nome}</h2>
          <p>{product.descricaoCompleta}</p>
          <dl className="modalFacts">
            <div>
              <dt>Marca</dt>
              <dd>{product.marca}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
            <div>
              <dt>Unidade</dt>
              <dd>{product.unidade}</dd>
            </div>
            <div>
              <dt>Disponibilidade</dt>
              <dd>{product.disponibilidade}</dd>
            </div>
          </dl>
          <div className="specBox">
            <strong>Especificações técnicas</strong>
            <ul>
              {product.especificacoes.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>
          <button className="primaryButton" type="button" onClick={handleAddToQuote}>
            Adicionar à cotação
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProductModal;
