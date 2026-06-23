import { Router } from "express";
import { checkSession, login, logout } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/check", checkSession);

export default authRoutes;
