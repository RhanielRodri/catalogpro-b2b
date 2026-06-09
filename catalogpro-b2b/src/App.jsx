import { useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Filters from "./components/Filters";
import QuoteDrawer from "./components/QuoteDrawer";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import { products } from "./data/products";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.categoria))],
    []
  );

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.marca))],
    []
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = [
        product.nome,
        product.categoria,
        product.marca,
        product.sku
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true;
      const matchesBrand = selectedBrand ? product.marca === selectedBrand : true;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [searchTerm, selectedCategory, selectedBrand]);

  const totalItems = useMemo(
    () => quoteItems.reduce((total, item) => total + item.quantity, 0),
    [quoteItems]
  );

  function addToQuote(product) {
    setQuoteItems((current) => {
      const existingItem = current.find((item) => item.id === product.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
    setIsQuoteOpen(true);
  }

  function increaseQuantity(productId) {
    setQuoteItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setQuoteItems((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId) {
    setQuoteItems((current) => current.filter((item) => item.id !== productId));
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
  }

  return (
    <>
      <Header quoteCount={totalItems} onOpenQuote={() => setIsQuoteOpen(true)} />
      <main>
        <Hero onOpenQuote={() => setIsQuoteOpen(true)} />

        <section className="benefits" id="beneficios">
          <div>
            <span>Compra recorrente</span>
            <strong>Pedidos por volume e reposição mensal</strong>
          </div>
          <div>
            <span>Fluxo B2B</span>
            <strong>Cotação sem preço público no catálogo</strong>
          </div>
          <div>
            <span>Organização</span>
            <strong>Produtos por categoria, marca e SKU</strong>
          </div>
        </section>

        <section className="catalog" id="catalogo">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Catálogo público</span>
              <h2>Produtos para operação corporativa</h2>
            </div>
            <p>{filteredProducts.length} produtos encontrados</p>
          </div>

          <Filters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            categories={categories}
            brands={brands}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onBrandChange={setSelectedBrand}
            onClear={clearFilters}
          />

          {filteredProducts.length > 0 ? (
            <div className="productGrid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onAddToQuote={addToQuote}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={addToQuote}
      />

      <QuoteDrawer
        isOpen={isQuoteOpen}
        quoteItems={quoteItems}
        totalItems={totalItems}
        onClose={() => setIsQuoteOpen(false)}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
      />
    </>
  );
}

export default App;
