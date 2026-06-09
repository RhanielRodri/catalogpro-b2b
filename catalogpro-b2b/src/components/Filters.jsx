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
  return (
    <section className="filters" aria-label="Filtros do catálogo">
      <label>
        Buscar produto
        <input
          type="search"
          placeholder="Nome, categoria, marca ou SKU"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        Categoria
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        Marca
        <select
          value={selectedBrand}
          onChange={(event) => onBrandChange(event.target.value)}
        >
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </label>

      <button className="ghostButton" type="button" onClick={onClear}>
        Limpar
      </button>
    </section>
  );
}

export default Filters;
