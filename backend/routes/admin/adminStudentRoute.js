import express from 'express';
import { getAllStudents , getStudentsByClassName , createStudent ,deleteStudent,getStudentById,getAllFeesRecords,getFeesByStudentId,recordPayment,getAllAnnouncements,createAnnouncement,deleteAnnouncement} from '../../controllers/adminStudentController.js';
import adminAuth from '../../middlewares/adminAuth.js'
const adminStudentRouter = express.Router();
import upload from '../../middlewares/multer.js'

// Route to get all students
adminStudentRouter.get('/students',getAllStudents);

//Route to get students by class name
adminStudentRouter.get('/students/by-class/:className',adminAuth,getStudentsByClassName);


// SPECIFIC ROUTES BEFORE PARAMETERIZED ROUTES
adminStudentRouter.post('/student/create',adminAuth,upload.single("avatar"),createStudent);
adminStudentRouter.post('/student/payment',adminAuth,recordPayment);
adminStudentRouter.get('/student/feesRecords',adminAuth,getAllFeesRecords);
adminStudentRouter.get('/feesRecords/:studentId',adminAuth,getFeesByStudentId);

// PARAMETERIZED ROUTES LAST
adminStudentRouter.delete('/student/:studentId',adminAuth,deleteStudent);
adminStudentRouter.get('/student/:studentId',adminAuth, getStudentById);

//Announcement Routes 
adminStudentRouter.get('/announcements',adminAuth,getAllAnnouncements);
adminStudentRouter.post('/announcement/create',adminAuth,createAnnouncement);
adminStudentRouter.delete('/announcement/:announcementId',adminAuth,deleteAnnouncement);

export default adminStudentRouter;