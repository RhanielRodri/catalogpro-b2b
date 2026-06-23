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
import { createQuote, getProducts } from "./services/api";

const CACHE_KEY = "catalogpro_v1";
const CACHE_TTL = 5 * 60 * 1000;

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch { return null; }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

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

  async function loadCatalog(silent = false) {
    if (!silent) {
      setIsLoadingProducts(true);
      setProductsError("");
    }
    try {
      const apiProducts = await getProducts();
      const adapted = apiProducts.map(adaptProduct);
      const cats = [...new Set(apiProducts.map((p) => p.category?.name).filter(Boolean))].sort();
      const brs = [...new Set(apiProducts.map((p) => p.brand?.name).filter(Boolean))].sort();
      setCatalogProducts(adapted);
      setCategories(cats);
      setBrands(brs);
      writeCache({ products: adapted, categories: cats, brands: brs });
      if (!silent) setProductsError("");
    } catch {
      if (!silent) {
        setCatalogProducts(products);
        setCategories([...new Set(products.map((p) => p.categoria))]);
        setBrands([...new Set(products.map((p) => p.marca))]);
        setProductsError("Não foi possível carregar os produtos.");
      }
    } finally {
      if (!silent) setIsLoadingProducts(false);
    }
  }

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setCatalogProducts(cached.products);
      setCategories(cached.categories);
      setBrands(cached.brands);
      setIsLoadingProducts(false);
      loadCatalog(true);
    } else {
      loadCatalog(false);
    }
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
            <span className="benefitIcon" aria-hidden="true">🔄</span>
            <div>
              <strong>Compra recorrente</strong>
              <p>Pedidos por volume e reposição mensal com histórico organizado.</p>
            </div>
          </div>
          <div>
            <span className="benefitIcon" aria-hidden="true">🔒</span>
            <div>
              <strong>Fluxo B2B confidencial</strong>
              <p>Cotação sem preço público exposto no catálogo.</p>
            </div>
          </div>
          <div>
            <span className="benefitIcon" aria-hidden="true">🗂️</span>
            <div>
              <strong>Catálogo organizado</strong>
              <p>Produtos por categoria, marca e SKU com busca rápida.</p>
            </div>
          </div>
        </section>

        <section className="howItWorks" id="como-funciona">
          <div className="steps">
            <article className="step">
              <span className="stepNumber">01</span>
              <strong>Encontra o produto</strong>
            </article>
            <span className="stepArrow" aria-hidden="true">→</span>
            <article className="step">
              <span className="stepNumber">02</span>
              <strong>Adiciona à cotação</strong>
            </article>
            <span className="stepArrow" aria-hidden="true">→</span>
            <article className="step">
              <span className="stepNumber">03</span>
              <strong>Empresa recebe o pedido</strong>
            </article>
            <span className="stepArrow" aria-hidden="true">→</span>
            <article className="step">
              <span className="stepNumber">04</span>
              <strong>Comercial responde</strong>
            </article>
          </div>
        </section>

        <section className="catalog" id="catalogo">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Catálogo público</span>
              <h2>Produtos para operação corporativa</h2>
            </div>
            <p>{isLoadingProducts ? "Carregando catálogo comercial..." : `${filteredProducts.length} produto${filteredProducts.length !== 1 ? "s" : ""} encontrado${filteredProducts.length !== 1 ? "s" : ""}`}</p>
          </div>

          {productsError && (
            <div className="catalogNotice" role="alert">
              <span>{productsError}</span>
              <button
                className="ghostButton compact"
                type="button"
                onClick={() => loadCatalog(false)}
              >
                Tentar novamente
              </button>
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
            <div className="productGrid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="skeletonCard" key={i}>
                  <div className="skeletonImage skeleton" />
                  <div className="skeletonContent">
                    <div className="skeletonLine skeleton" style={{ width: "55%" }} />
                    <div className="skeletonLine skeleton" style={{ width: "90%", height: "18px" }} />
                    <div className="skeletonLine skeleton" style={{ width: "80%" }} />
                    <div className="skeletonLine skeleton" style={{ width: "65%" }} />
                  </div>
                </div>
              ))}
            </div>
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
