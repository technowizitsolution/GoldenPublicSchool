import express from 'express';
import {
  getAllBooks,
  getClassBookStats,
  addBook,
  updateBook,
  issueBooks,
  getStudentBooks,
  returnBook,
  getClassDistribution,
  getOverdueBooks,
  getBookReport,
  deleteBook,
} from '../../controllers/booksController.js';
import adminAuth from '../../middlewares/adminAuth.js';

const adminBooksRouter = express.Router();

// All routes protected with admin auth
adminBooksRouter.use(adminAuth);

// Books management
adminBooksRouter.get('/all', getAllBooks);
adminBooksRouter.get('/stats', getClassBookStats);
adminBooksRouter.post('/add', addBook);
adminBooksRouter.put('/update/:bookId', updateBook);
adminBooksRouter.delete('/delete/:bookId', deleteBook);

// Book distribution
adminBooksRouter.post('/issue', issueBooks);
adminBooksRouter.get('/student/:studentId', getStudentBooks);
adminBooksRouter.put('/return/:studentBookId', returnBook);

// Statistics and reports
adminBooksRouter.get('/distribution/:className', getClassDistribution);
adminBooksRouter.get('/overdue', getOverdueBooks);
adminBooksRouter.get('/report/:className', getBookReport);

export default adminBooksRouter;