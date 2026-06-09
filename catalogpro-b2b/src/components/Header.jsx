function Header({ quoteCount, onOpenQuote }) {
  return (
    <header className="header">
      <a className="brand" href="#topo" aria-label="SupraCorp">
        <span className="brandMark">S</span>
        <span>
          <strong>SupraCorp</strong>
          <small>CatalogPro B2B</small>
        </span>
      </a>

      <nav className="nav" aria-label="Navegação principal">
        <a href="#catalogo">Catálogo</a>
        <a href="#beneficios">Benefícios</a>
        <button className="quoteButton" type="button" onClick={onOpenQuote}>
          Cotação
          <span>{quoteCount}</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
