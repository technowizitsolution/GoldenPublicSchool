import express from 'express';
import { getAllTeachers,createTeacher,deleteTeacher } from '../../controllers/adminTeacherController.js';
import adminAuth from '../../middlewares/adminAuth.js';
const adminTeacherRouter = express.Router();

//Route to get all teachers
adminTeacherRouter.get('/teachers',getAllTeachers);

//Route to create a new Teacher
adminTeacherRouter.post('/teacher/create',adminAuth,createTeacher);

//Route to delte a teacher
adminTeacherRouter.delete('/teacher/:teacherId',adminAuth,deleteTeacher);

export default adminTeacherRouter;