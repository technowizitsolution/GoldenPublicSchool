import express from "express";
import {
    getAllClasses,
    createClass,
    deleteClass,
    getClassById
} from "../../controllers/adminClassController.js";
import adminAuth from "../../middlewares/adminAuth.js";

const adminClassRouter = express.Router();

// Route to get all classes
adminClassRouter.get("/classes", getAllClasses);

// Route to create a new class
adminClassRouter.post("/class/create", adminAuth, createClass);

// Route to delete a class
adminClassRouter.delete("/class/:classId", adminAuth, deleteClass);

// Route to get a single class
adminClassRouter.get("/class/:classId", getClassById);

export default adminClassRouter;