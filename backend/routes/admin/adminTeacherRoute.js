import express from 'express';
import { getAllTeachers,createTeacher,deleteTeacher,getTeacherById } from '../../controllers/adminTeacherController.js';
import adminAuth from '../../middlewares/adminAuth.js';
const adminTeacherRouter = express.Router();

//Route to get all teachers
adminTeacherRouter.get('/teachers',getAllTeachers);

//Route to create a new Teacher
adminTeacherRouter.post('/teacher/create',adminAuth,createTeacher);

//Route to delte a teacher
adminTeacherRouter.delete('/teacher/:teacherId',adminAuth,deleteTeacher);

//Route to get a single teacher
adminTeacherRouter.get('/teacher/:teacherId',adminAuth, getTeacherById);

export default adminTeacherRouter;