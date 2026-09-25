import express from "express";
import { createBook, getAllBooks, getSingleBook, updateBook, deleteBook, getAdminDashboardStats} from "../controllers/book.controller.js";
import { isAuthenticated, isAdmin} from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multer.js";


const router = express.Router();

router.post("/create", isAuthenticated, isAdmin, upload.single("coverImage"), createBook);
router.get("/all", getAllBooks);
router.get("/:id", getSingleBook);
router.put("/update/:id", isAuthenticated, isAdmin, upload.single("coverImage"), updateBook);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteBook);
router.get("/admin/dashboard", isAuthenticated, isAdmin, getAdminDashboardStats);

export default router;