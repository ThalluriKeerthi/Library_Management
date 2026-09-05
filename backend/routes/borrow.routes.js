import express from 'express';
import { borrowBook, returnBook, getMyBorrowedBooks, getAllBorrowedBooks,
     getAllOverDueBooks, getStudentDashboard}
  from '../controllers/borrow.controller.js';

  import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

  const router = express.Router();
  
  //STUDENT
  router.post("/borrow" , isAuthenticated, borrowBook);
  router.post("/return", isAuthenticated, returnBook);
  router.get("/my-books", isAuthenticated, getMyBorrowedBooks);
  router.get("/student/dashboard", isAuthenticated, getStudentDashboard);
  //ADMIN
router.get("/admin/all", isAuthenticated, isAdmin, getAllBorrowedBooks);
router.get("/admin/overdue", isAuthenticated, isAdmin, getAllOverDueBooks);

export default router;