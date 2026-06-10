import { useEffect, useMemo, useState } from "react";
import AdminPage from "./admin/AdminPage";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Filters from "./components/Filters";
import QuoteDrawer from "./components/QuoteDrawer";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import { products } from "./data/products";
import { createQuote, getBrands, getCategories, getProducts } from "./services/api";

function adaptProduct(apiProduct) {
  return {
    id: apiProduct.id,
    nome: apiProduct.name,
    categoria: apiProduct.category?.name || apiProduct.categoria,
    marca: apiProduct.brand?.name || apiProduct.marca,
    sku: apiProduct.sku,
    descricaoCurta: apiProduct.shortDescription || apiProduct.descricaoCurta,
    descricaoCompleta: apiProduct.fullDescription || apiProduct.descricaoCompleta,
    imagem: apiProduct.image || apiProduct.imagem,
    unidade: apiProduct.unit || apiProduct.unidade,
    disponibilidade: apiProduct.availability || apiProduct.disponibilidade,
    especificacoes: apiProduct.specifications || apiProduct.especificacoes || []
  };
}

function PublicCatalogApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState(products);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccessMessage, setQuoteSuccessMessage] = useState("");
  const [quoteErrorMessage, setQuoteErrorMessage] = useState("");
  const [quoteFeedbackMessage, setQuoteFeedbackMessage] = useState("");

  useEffect(() => {
    if (!quoteFeedbackMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setQuoteFeedbackMessage("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [quoteFeedbackMessage]);

  useEffect(() => {
    async function loadCatalogData() {
      setIsLoadingProducts(true);
      setProductsError("");

      try {
        const [apiProducts, apiCategories, apiBrands] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands()
        ]);

        setCatalogProducts(apiProducts.map(adaptProduct));
        setCategories(apiCategories.map((category) => category.name));
        setBrands(apiBrands.map((brand) => brand.name));
      } catch (error) {
        setCatalogProducts(products);
        setCategories([...new Set(products.map((product) => product.categoria))]);
        setBrands([...new Set(products.map((product) => product.marca))]);
        setProductsError("Não foi possível conectar à API. Exibindo dados demonstrativos.");
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadCatalogData();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return catalogProducts.filter((product) => {
      const matchesSearch = [
        product.nome,
        product.categoria,
        product.marca,
        product.sku
      ].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
      const matchesCategory = selectedCategory ? product.categoria === selectedCategory : true;
      const matchesBrand = selectedBrand ? product.marca === selectedBrand : true;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [catalogProducts, searchTerm, selectedCategory, selectedBrand]);

  const totalItems = useMemo(
    () => quoteItems.reduce((total, item) => total + item.quantity, 0),
    [quoteItems]
  );

  function addToQuote(product) {
    setQuoteSuccessMessage("");
    setQuoteErrorMessage("");
    setQuoteItems((current) => {
      const existingItem = current.find((item) => item.id === product.id);

      if (existingItem) {
        setQuoteFeedbackMessage("Quantidade atualizada na cotação.");
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      setQuoteFeedbackMessage("Produto adicionado à cotação.");
      return [...current, { ...product, quantity: 1 }];
    });
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

  async function submitQuote(formData) {
    setIsSubmittingQuote(true);
    setQuoteSuccessMessage("");
    setQuoteErrorMessage("");

    const payload = {
      name: formData.nome,
      company: formData.empresa,
      phone: formData.telefone,
      email: formData.email,
      notes: formData.observacao,
      items: quoteItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      await createQuote(payload);
      setQuoteSuccessMessage("Solicitação de orçamento registrada com sucesso.");
      setQuoteItems([]);
      return true;
    } catch (error) {
      setQuoteErrorMessage(error.message || "Não foi possível registrar a cotação na API.");
      return false;
    } finally {
      setIsSubmittingQuote(false);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
  }

  function openQuoteDrawer() {
    setQuoteFeedbackMessage("");
    setIsQuoteOpen(true);
  }

  return (
    <>
      <Header quoteCount={totalItems} onOpenQuote={openQuoteDrawer} />
      <main>
        <Hero onOpenQuote={openQuoteDrawer} />

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
            <p>{isLoadingProducts ? "Carregando produtos..." : `${filteredProducts.length} produtos encontrados`}</p>
          </div>

          {productsError && (
            <div className="catalogNotice" role="status">
              {productsError}
            </div>
          )}

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

          {isLoadingProducts ? (
            <div className="loadingState">Carregando catálogo...</div>
          ) : filteredProducts.length > 0 ? (
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

      {quoteFeedbackMessage && (
        <div className="quoteFeedback" role="status" aria-live="polite">
          {quoteFeedbackMessage}
        </div>
      )}

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
        onSubmitQuote={submitQuote}
        isSubmittingQuote={isSubmittingQuote}
        quoteSuccessMessage={quoteSuccessMessage}
        quoteErrorMessage={quoteErrorMessage}
      />
    </>
  );
}

function App() {
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }

  return <PublicCatalogApp />;
}

export default App;
