import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import brandsRoutes from "./routes/brands.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import quotesRoutes from "./routes/quotes.routes.js";
import prisma from "./lib/prisma.js";

const app = express();
const PORT = process.env.PORT || 3333;
const isProd = process.env.NODE_ENV === "production";

if (!process.env.ADMIN_SECRET) {
  console.warn("[AVISO] ADMIN_SECRET não configurado — o painel admin não funcionará.");
}

const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173"
];

const allowedOrigins = [
  ...(isProd ? [] : devOrigins),
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser());

app.get("/api/health", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return response.json({
      status: "ok",
      service: "CatalogPro B2B API",
      database: "ok"
    });
  } catch (error) {
    return response.status(503).json({
      status: "error",
      service: "CatalogPro B2B API",
      database: "unavailable",
      message: "Banco de dados indisponível."
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/quotes", quotesRoutes);

app.use((_request, response) => {
  return response.status(404).json({ message: "Rota não encontrada." });
});

app.use((error, _request, response, _next) => {
  if (isProd) {
    console.error(`[${new Date().toISOString()}] 500:`, error.message);
  } else {
    console.error(error);
  }
  return response.status(500).json({ message: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`CatalogPro B2B API running on port ${PORT} [${isProd ? "production" : "development"}]`);
});
