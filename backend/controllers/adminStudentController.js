import Student from '../models/Student.js';

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ isDeleted: false });
        res.status(200).json({ message: 'Students fetched successfully', students });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create a new student
import Student from "../models/studentModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createStudent = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { email } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student with this email already exists",
            });
        }

        let profileImage = "";

        // Upload profile image (if provided)
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "student_profiles",
                resource_type: "image",
            });

            profileImage = result.secure_url;
        }

        // Prepare student data
        const studentData = {
            ...req.body,
            profileImage, // save image URL
        };

        //Create student
        const newStudent = await Student.create(studentData);

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: newStudent,
        });
    } catch (err) {
        console.error("Error creating student:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Delete a student
export const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        await Student.findByIdAndUpdate(studentId, { isDeleted: true });
        console.log(`Student with ID ${studentId} marked as deleted.`);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}