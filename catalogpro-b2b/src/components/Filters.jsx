import { useTranslation } from "../i18n/I18nContext";

function Filters({
  searchTerm,
  selectedCategory,
  selectedBrand,
  categories,
  brands,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onClear
}) {
  const { t } = useTranslation();
  const hasActiveFilters = searchTerm || selectedCategory || selectedBrand;

  return (
    <section className="filters" aria-label="Filtros do catálogo">
      <label>
        {t.filter_search_label}
        <input
          type="search"
          placeholder={t.filter_search_placeholder}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        {t.filter_category_label}
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">{t.filter_category_all}</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        {t.filter_brand_label}
        <select
          value={selectedBrand}
          onChange={(event) => onBrandChange(event.target.value)}
        >
          <option value="">{t.filter_brand_all}</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </label>

      <button
        className={hasActiveFilters ? "primaryButton compact" : "ghostButton compact"}
        type="button"
        onClick={onClear}
      >
        {t.filter_clear}
      </button>
    </section>
  );
}

export default Filters;
