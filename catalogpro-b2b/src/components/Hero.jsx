import { useTranslation } from "../i18n/I18nContext";

function Hero({ onOpenQuote }) {
  const { t } = useTranslation();

  return (
    <section className="hero" id="topo">
      <div className="heroContent">
        <span className="eyebrow">{t.hero_eyebrow}</span>
        <h1>{t.hero_title}</h1>
        <p>{t.hero_desc}</p>
        <div className="heroStats">
          <span><strong>24+</strong> {t.hero_stat_products}</span>
          <span className="heroStatDivider" />
          <span><strong>6</strong> {t.hero_stat_categories}</span>
          <span className="heroStatDivider" />
          <span><strong>0</strong> {t.hero_stat_prices}</span>
        </div>
        <div className="heroActions">
          <a className="primaryButton" href="#catalogo">{t.hero_btn_catalog}</a>
          <button className="secondaryButton" type="button" onClick={onOpenQuote}>
            {t.hero_btn_quote}
          </button>
        </div>
      </div>

      <div className="heroPreview" aria-label="Prévia do sistema de catálogo">
        <div className="heroPreviewHeader">
          <span className="heroPreviewTitle">{t.hero_preview_title}</span>
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
            <span>{t.hero_preview_open}</span>
            <strong>{t.hero_preview_selected}</strong>
          </div>
          <span className="heroPreviewCta" aria-hidden="true">{t.hero_preview_send}</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
