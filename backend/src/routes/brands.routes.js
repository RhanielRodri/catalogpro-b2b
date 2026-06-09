import { Router } from "express";
import { listBrands } from "../controllers/brands.controller.js";

const brandsRoutes = Router();

brandsRoutes.get("/", listBrands);

export default brandsRoutes;
