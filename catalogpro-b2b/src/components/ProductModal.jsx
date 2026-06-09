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
        <div className="modalImage" aria-hidden="true">{product.imagem}</div>
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
