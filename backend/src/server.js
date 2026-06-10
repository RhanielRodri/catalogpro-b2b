import cors from "cors";
import "dotenv/config";
import express from "express";
import brandsRoutes from "./routes/brands.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import quotesRoutes from "./routes/quotes.routes.js";

const app = express();
const PORT = process.env.PORT || 3333;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (request, response) => {
  return response.json({
    status: "ok",
    service: "CatalogPro B2B API"
  });
});

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/quotes", quotesRoutes);

app.use((request, response) => {
  return response.status(404).json({ message: "Rota não encontrada." });
});

app.use((error, request, response, next) => {
  console.error(error);
  return response.status(500).json({ message: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`CatalogPro B2B API running on port ${PORT}`);
});
