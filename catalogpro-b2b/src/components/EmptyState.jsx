import { useTranslation } from "../i18n/I18nContext";

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="emptyState">
      <strong>{t.empty_title}</strong>
      <p>{t.empty_desc}</p>
    </div>
  );
}

export default EmptyState;
