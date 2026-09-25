import express from 'express';
import {getAllStudents, getSingleStudent, deleteStudent} from "../controllers/admin.controller.js"
import { isAuthenticated, isAdmin} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get("/students",isAuthenticated, isAdmin, getAllStudents);
router.get("/students/:id", isAuthenticated, isAdmin, getSingleStudent);
router.delete("/students/:id", isAuthenticated, isAdmin, deleteStudent);

export default router