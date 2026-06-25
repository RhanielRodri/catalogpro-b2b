import { useTranslation } from "../i18n/I18nContext";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footerBrand">
        <span className="footerMark" aria-hidden="true">S</span>
        <div>
          <strong>SupraCorp</strong>
          <small>{t.footer_tagline}</small>
        </div>
      </div>

      <nav className="footerLinks" aria-label="Links do rodapé">
        <a href="#catalogo">{t.nav_catalog}</a>
        <a href="#beneficios">{t.nav_benefits}</a>
        <a href="#como-funciona">{t.how_title}</a>
      </nav>

      <p className="footerCopy">{t.footer_copy}</p>
    </footer>
  );
}

export default Footer;
