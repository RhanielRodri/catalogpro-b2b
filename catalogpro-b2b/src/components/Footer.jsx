function Footer() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <span className="footerMark" aria-hidden="true">S</span>
        <div>
          <strong>SupraCorp</strong>
          <small>Catálogo B2B Demonstrativo</small>
        </div>
      </div>

      <nav className="footerLinks" aria-label="Links do rodapé">
        <a href="#catalogo">Catálogo</a>
        <a href="#beneficios">Benefícios</a>
        <a href="#como-funciona">Como funciona</a>
      </nav>

      <p className="footerCopy">© 2025 SupraCorp · Portfólio CatalogPro B2B</p>
    </footer>
  );
}

export default Footer;
