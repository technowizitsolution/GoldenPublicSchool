import express from 'express';
import { getAllStudents , createStudent ,deleteStudent,getStudentById,getAllFeesRecords,getFeesByStudentId,recordPayment} from '../../controllers/adminStudentController.js';
import adminAuth from '../../middlewares/adminAuth.js'
const adminStudentRouter = express.Router();
import upload from '../../middlewares/multer.js'

// Route to get all students
adminStudentRouter.get('/students',getAllStudents);

// SPECIFIC ROUTES BEFORE PARAMETERIZED ROUTES
adminStudentRouter.post('/student/create',adminAuth,upload.single("avatar"),createStudent);
adminStudentRouter.post('/student/payment',adminAuth,recordPayment);
adminStudentRouter.get('/student/feesRecords',adminAuth,getAllFeesRecords);
adminStudentRouter.get('/feesRecords/:studentId',adminAuth,getFeesByStudentId);

// PARAMETERIZED ROUTES LAST
adminStudentRouter.delete('/student/:studentId',adminAuth,deleteStudent);
adminStudentRouter.get('/student/:studentId',adminAuth, getStudentById);

export default adminStudentRouter;