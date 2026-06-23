function ProductCard({ product, onViewDetails, onAddToQuote }) {
  const isUnderConsultation = product.disponibilidade === "Sob consulta";

  return (
    <article className="productCard">
      <div className="productImage" aria-hidden="true">
        <svg className="productImageIcon" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
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
            <dd className="marcaValue">{product.marca}</dd>
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
