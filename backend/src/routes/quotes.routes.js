import { Router } from "express";
import {
  createQuote,
  getQuoteById,
  listQuotes,
  updateQuoteStatus
} from "../controllers/quotes.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const quotesRoutes = Router();

quotesRoutes.post("/", createQuote);
quotesRoutes.get("/", requireAuth, listQuotes);
quotesRoutes.get("/:id", requireAuth, getQuoteById);
quotesRoutes.patch("/:id/status", requireAuth, updateQuoteStatus);

export default quotesRoutes;
