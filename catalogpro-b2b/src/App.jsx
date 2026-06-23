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
          <div className="howItWorksHeader">
            <p className="howItWorksTitle">Encontre o produto certo</p>
            <p className="howItWorksSubtitle">Pesquise por categoria, marca, SKU ou especificação para montar sua cotação.</p>
          </div>
          <ol className="steps">
            <li className="step">
              <span className="stepIcon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"/>
                  <path d="M16.5 16.5l4 4"/>
                </svg>
              </span>
              <strong>Pesquise por categoria</strong>
              <p>Encontre produtos rapidamente usando filtros e busca.</p>
            </li>
            <li className="step">
              <span className="stepIcon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
                </svg>
              </span>
              <strong>Consulte especificações</strong>
              <p>Visualize detalhes, marca, SKU e informações técnicas.</p>
            </li>
            <li className="step">
              <span className="stepIcon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1"/>
                  <path d="M9 12h6M9 16h4"/>
                </svg>
              </span>
              <strong>Monte sua cotação</strong>
              <p>Adicione produtos e quantidades ao pedido.</p>
            </li>
            <li className="step">
              <span className="stepIcon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </span>
              <strong>Envie para o comercial</strong>
              <p>A solicitação chega organizada para análise da equipe.</p>
            </li>
          </ol>
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
