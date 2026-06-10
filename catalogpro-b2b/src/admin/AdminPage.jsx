import { useEffect, useMemo, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import QuoteDetails from "./QuoteDetails";
import QuotesTable from "./QuotesTable";
import { getQuoteById, getQuotes, updateQuoteStatus } from "../services/api";
import "./admin.css";

function AdminPage() {
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

  async function loadQuotes() {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await getQuotes();
      setQuotes(data);
      setSelectedQuote((current) => {
        if (!current) {
          return data[0] || null;
        }

        return data.find((quote) => quote.id === current.id) || data[0] || null;
      });
    } catch (error) {
      setErrorMessage(error.message || "Não foi possível carregar as cotações.");
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
      setErrorMessage(error.message || "Não foi possível carregar os detalhes da cotação.");
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

  useEffect(() => {
    loadQuotes();
  }, []);

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a className="admin-brand" href="/">
          <span className="admin-brandMark">S</span>
          <span>
            <strong>SupraCorp Admin</strong>
            <small>CatalogPro B2B</small>
          </span>
        </a>
        <div className="admin-headerActions">
          <button className="admin-secondaryButton" type="button" onClick={loadQuotes}>
            Recarregar
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
