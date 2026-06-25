import { useTranslation } from "../i18n/I18nContext";

function LangToggle() {
  const { locale, setLocale } = useTranslation();

  const active = { fontWeight: "800", color: "var(--accent, #2563eb)" };
  const inactive = { fontWeight: "600", color: "#94a3b8", cursor: "pointer" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", letterSpacing: "0.05em" }}>
      <button
        type="button"
        onClick={() => setLocale("pt")}
        style={locale === "pt" ? active : inactive}
        aria-pressed={locale === "pt"}
      >
        PT
      </button>
      <span style={{ color: "#94a3b8" }}>|</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        style={locale === "en" ? active : inactive}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}

function Header({ quoteCount, onOpenQuote }) {
  const { t } = useTranslation();

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
        <a href="#catalogo">{t.nav_catalog}</a>
        <a href="#beneficios">{t.nav_benefits}</a>
        <button className="quoteButton" type="button" onClick={onOpenQuote} aria-label={`${t.nav_quote} ${quoteCount}`}>
          {t.nav_quote}
          <span aria-hidden="true">{quoteCount}</span>
        </button>
        <LangToggle />
      </nav>
    </header>
  );
}

export default Header;
