import express from "express";
import {logoutUser, registerStudent, loginUser, getMyProfile, forgotPassword, resetPassword} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", isAuthenticated, getMyProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;