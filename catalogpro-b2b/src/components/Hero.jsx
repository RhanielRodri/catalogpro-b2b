function Hero({ onOpenQuote }) {
  return (
    <section className="hero" id="topo">
      <div className="heroContent">
        <span className="eyebrow">Plataforma B2B de catálogo e orçamento</span>
        <h1>Do catálogo ao pedido em minutos</h1>
        <p>
          Consulte produtos por categoria, compare especificações técnicas
          e solicite orçamentos com seus dados comerciais em um único fluxo.
        </p>
        <div className="heroStats">
          <span><strong>24+</strong> produtos catalogados</span>
          <span className="heroStatDivider" />
          <span><strong>6</strong> categorias B2B</span>
          <span className="heroStatDivider" />
          <span><strong>0</strong> preços expostos</span>
        </div>
        <div className="heroActions">
          <a className="primaryButton" href="#catalogo">Ver catálogo</a>
          <button className="secondaryButton" type="button" onClick={onOpenQuote}>
            Iniciar cotação
          </button>
        </div>
      </div>

      <div className="heroPreview" aria-label="Prévia do sistema de catálogo">
        <div className="heroPreviewHeader">
          <span className="heroPreviewTitle">Catálogo B2B</span>
          <span className="heroPreviewBadge">24 produtos</span>
        </div>
        <div className="heroPreviewItems">
          <div className="heroPreviewItem">
            <span className="heroPreviewIcon">📋</span>
            <div className="heroPreviewMeta">
              <strong>Resma A4 Premium 75g/m²</strong>
              <small>Papelaria · SKU OM-001</small>
            </div>
            <span className="heroPreviewAdd" aria-hidden="true">+</span>
          </div>
          <div className="heroPreviewItem heroPreviewItem--active">
            <span className="heroPreviewIcon">🦺</span>
            <div className="heroPreviewMeta">
              <strong>Capacete de Segurança CA-39674</strong>
              <small>EPIs · SKU SW-101</small>
            </div>
            <span className="heroPreviewAdd heroPreviewAdd--added" aria-hidden="true">✓</span>
          </div>
          <div className="heroPreviewItem">
            <span className="heroPreviewIcon">🧴</span>
            <div className="heroPreviewMeta">
              <strong>Álcool 70% Profissional 1L</strong>
              <small>Limpeza · SKU CC-201</small>
            </div>
            <span className="heroPreviewAdd" aria-hidden="true">+</span>
          </div>
        </div>
        <div className="heroPreviewFooter">
          <div className="heroPreviewQuote">
            <span>Cotação em aberto</span>
            <strong>1 item selecionado</strong>
          </div>
          <span className="heroPreviewCta" aria-hidden="true">Enviar pedido →</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
