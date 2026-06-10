const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://catalogpro-b2b-api.onrender.com/api"
    : "http://localhost:3333/api");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || "Erro ao conectar com a API.");
  }

  return response.json();
}

export function getProducts() {
  return request("/products");
}

export function getCategories() {
  return request("/categories");
}

export function getBrands() {
  return request("/brands");
}

export function createQuote(payload) {
  return request("/quotes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getQuotes() {
  return request("/quotes");
}

export function getQuoteById(id) {
  return request(`/quotes/${id}`);
}

export function updateQuoteStatus(id, status) {
  return request(`/quotes/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
