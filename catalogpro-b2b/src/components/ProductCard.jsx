function ProductCard({ product, onViewDetails, onAddToQuote }) {
  return (
    <article className="productCard">
      <div className="productImage" aria-hidden="true">{product.imagem}</div>
      <div className="productContent">
        <div className="cardMeta">
          <span>{product.categoria}</span>
          <span>{product.disponibilidade}</span>
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
            <dd>{product.sku}</dd>
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
