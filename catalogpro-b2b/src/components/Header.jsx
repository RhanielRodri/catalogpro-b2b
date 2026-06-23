function Header({ quoteCount, onOpenQuote }) {
  return (
    <header className="header">
      <a className="brand" href="#topo" aria-label="SupraCorp — página inicial">
        <span className="brandMark" aria-hidden="true">S</span>
        <span>
          <strong>SupraCorp</strong>
          <small>CatalogPro B2B</small>
        </span>
      </a>

      <nav className="nav" aria-label="Navegação principal">
        <a href="#catalogo">Catálogo</a>
        <a href="#beneficios">Benefícios</a>
        <a href="#como-funciona">Como funciona</a>
        <button className="quoteButton" type="button" onClick={onOpenQuote} aria-label={`Abrir cotação com ${quoteCount} itens`}>
          Cotação
          <span aria-hidden="true">{quoteCount}</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
