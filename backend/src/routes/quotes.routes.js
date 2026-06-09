import { Router } from "express";
import {
  createQuote,
  getQuoteById,
  listQuotes,
  updateQuoteStatus
} from "../controllers/quotes.controller.js";

const quotesRoutes = Router();

quotesRoutes.post("/", createQuote);
quotesRoutes.get("/", listQuotes);
quotesRoutes.get("/:id", getQuoteById);
quotesRoutes.patch("/:id/status", updateQuoteStatus);

export default quotesRoutes;
