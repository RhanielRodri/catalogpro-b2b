import { useEffect, useMemo, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import QuoteDetails from "./QuoteDetails";
import QuotesTable from "./QuotesTable";
import { checkAuth, getQuoteById, getQuotes, logoutAdmin, updateQuoteStatus } from "../services/api";
import "./admin.css";

function AdminPage() {
  const [authStatus, setAuthStatus] = useState("checking");
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedQuoteId = selectedQuote?.id || null;

  const orderedQuotes = useMemo(() => {
    return [...quotes].sort((current, next) => new Date(next.createdAt) - new Date(current.createdAt));
  }, [quotes]);

  useEffect(() => {
    checkAuth()
      .then(() => {
        setAuthStatus("authenticated");
        loadQuotes();
      })
      .catch(() => {
        setAuthStatus("unauthenticated");
      });
  }, []);

  async function loadQuotes() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await getQuotes();
      setQuotes(data);
      setSelectedQuote((current) => {
        if (!current) return data[0] || null;
        return data.find((quote) => quote.id === current.id) || data[0] || null;
      });
    } catch (error) {
      setErrorMessage(
        "Não foi possível conectar à API agora. Aguarde alguns segundos e clique em Recarregar."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function selectQuote(quote) {
    setIsLoadingDetails(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await getQuoteById(quote.id);
      setSelectedQuote(data);
    } catch (error) {
      setErrorMessage("Não foi possível carregar os detalhes agora. Tente recarregar em alguns segundos.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  async function handleUpdateStatus(quoteId, status) {
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedQuote = await updateQuoteStatus(quoteId, status);
      setSelectedQuote(updatedQuote);
      setQuotes((current) =>
        current.map((quote) => (quote.id === updatedQuote.id ? updatedQuote : quote))
      );
      setSuccessMessage("Status atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível atualizar o status.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      setAuthStatus("unauthenticated");
      setQuotes([]);
      setSelectedQuote(null);
    }
  }

  if (authStatus === "checking") {
    return (
      <div className="admin-login-page">
        <p className="admin-login-checking">Verificando acesso...</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <AdminLogin
        onLogin={() => {
          setAuthStatus("authenticated");
          loadQuotes();
        }}
      />
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a className="admin-brand" href="/">
          <span className="admin-brandMark">C</span>
          <span>
            <strong>CatalogPro B2B</strong>
            <small>Painel comercial</small>
          </span>
        </a>
        <div className="admin-headerActions">
          <button className="admin-secondaryButton" type="button" onClick={loadQuotes}>
            Recarregar
          </button>
          <button className="admin-ghostButton" type="button" onClick={handleLogout}>
            Sair
          </button>
          <a className="admin-primaryButton" href="/">
            Ver catálogo
          </a>
        </div>
      </header>

      <section className="admin-hero">
        <div>
          <span className="admin-eyebrow">Painel administrativo</span>
          <h1>Solicitações de orçamento</h1>
          <p>Visualize pedidos recebidos pelo catálogo B2B e acompanhe o status comercial.</p>
        </div>
      </section>

      {errorMessage && <p className="admin-error" role="alert">{errorMessage}</p>}

      {isLoading ? (
        <section className="admin-panel admin-loading">Carregando cotações...</section>
      ) : (
        <>
          <AdminDashboard quotes={quotes} />

          <div className="admin-layout">
            <QuotesTable
              quotes={orderedQuotes}
              selectedQuoteId={selectedQuoteId}
              onSelectQuote={selectQuote}
            />
            {isLoadingDetails ? (
              <aside className="admin-panel admin-details admin-loading">Carregando detalhes...</aside>
            ) : (
              <QuoteDetails
                quote={selectedQuote}
                isUpdating={isUpdating}
                successMessage={successMessage}
                errorMessage=""
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default AdminPage;
