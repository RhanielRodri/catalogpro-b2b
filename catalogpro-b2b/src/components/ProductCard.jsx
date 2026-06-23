function ProductCard({ product, onViewDetails, onAddToQuote }) {
  const isUnderConsultation = product.disponibilidade === "Sob consulta";

  return (
    <article className="productCard">
      <div className="productImage" aria-hidden="true">
        <svg className="productImageIcon" width="28" height="36" viewBox="0 0 28 36" fill="none">
          <rect x="1" y="1" width="26" height="34" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5"/>
          <rect x="1" y="1" width="26" height="8" rx="3" fill="#e8edf3" stroke="#e2e8f0" strokeWidth="1.5"/>
          <path d="M6 16h16M6 21h11M6 26h13" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="productContent">
        <div className="cardMeta">
          <span>{product.categoria}</span>
          <span className={isUnderConsultation ? "metaConsulta" : "metaDisp"}>
            {isUnderConsultation ? "Sob consulta" : "Disponível"}
          </span>
        </div>
        <h3>{product.nome}</h3>
        <p>{product.descricaoCurta}</p>
        <dl className="productFacts">
          <div>
            <dt>Marca</dt>
            <dd>{product.marca}</dd>
          </div>
          <div>
            <dt>Unidade</dt>
            <dd>{product.unidade}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd className="skuValue">{product.sku}</dd>
          </div>
        </dl>
      </div>
      <div className="cardActions">
        <button className="secondaryButton compact" type="button" onClick={() => onViewDetails(product)}>
          Detalhes
        </button>
        <button className="primaryButton compact" type="button" onClick={() => onAddToQuote(product)}>
          + Cotação
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
