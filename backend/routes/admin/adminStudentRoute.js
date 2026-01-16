import express from 'express';
import { getAllStudents , createStudent ,deleteStudent} from '../../controllers/adminStudentController.js';
import adminAuth from '../../middlewares/adminAuth.js'
const adminStudentRouter = express.Router();
import upload from '../../middlewares/multer.js'

//Route to get all students
adminStudentRouter.get('/students',getAllStudents);

//Route to create a new student 
adminStudentRouter.post('/student/create',adminAuth,upload.single("avatar"),createStudent);
//Route to delete a student
adminStudentRouter.delete('/student/:studentId',adminAuth,deleteStudent);

export default adminStudentRouter;

