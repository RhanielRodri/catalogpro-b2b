import { Router } from "express";
import { getProductById, listProducts } from "../controllers/products.controller.js";

const productsRoutes = Router();

productsRoutes.get("/", listProducts);
productsRoutes.get("/:id", getProductById);

export default productsRoutes;
