import express from "express";
import {logoutUser, registerStudent, loginUser} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;