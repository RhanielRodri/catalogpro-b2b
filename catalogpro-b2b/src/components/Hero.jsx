function Hero({ onOpenQuote }) {
  return (
    <section className="hero" id="topo">
      <div className="heroContent">
        <span className="eyebrow">Suprimentos corporativos sob demanda</span>
        <h1>Catálogo B2B inteligente para suprimentos corporativos</h1>
        <p>
          Consulte produtos, compare especificações e solicite orçamentos de
          forma rápida para sua empresa.
        </p>
        <div className="heroActions">
          <a className="primaryButton" href="#catalogo">Ver catálogo</a>
          <button className="secondaryButton" type="button" onClick={onOpenQuote}>
            Abrir cotação
          </button>
        </div>
      </div>

      <div className="heroPanel" aria-label="Resumo comercial">
        <div>
          <strong>24+</strong>
          <span>itens catalogados</span>
        </div>
        <div>
          <strong>6</strong>
          <span>categorias B2B</span>
        </div>
        <div>
          <strong>0</strong>
          <span>preços expostos</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
