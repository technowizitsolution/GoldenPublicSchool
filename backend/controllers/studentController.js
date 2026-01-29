import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';
import Fees from '../models/Fees.js';
import StudentBook from '../models/StudentBook.js';
import Book from '../models/Book.js';
import UniformItem from '../models/UniformItem.js';
import StudentUniform from '../models/StudentUniform.js';
import Announcement from '../models/Announcement.js';

//student login
export const loginStudent = async (req, res) => {

    try {

        const { email, password } = req.body;
        //checking user exist or not
        const student = await Student.findOne({ email });

        if (!student) {
            return res.json({ success: false, message: "User doesn't exist" });
        }


        if (password === student.password) {
            const token = jwt.sign(email, process.env.JWT_SECRET);
            res.json({ success: true, message: "Login successful", token });
        }
        else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    }
    catch (error) {
        console.log("Error in user login", error);
        res.json({ success: false, message: error.message })
    }

}

//get student profile
export const getStudentProfile = async (req, res) => {
    try {
        const studentEmail = req.student; // Extracted from token in middleware
        const student = await Student.findOne({ email: studentEmail }).select('-password').populate(
            "class",
            "name section capacity fees"
        );
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }
        res.json({ success: true, student });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.json({ success: false, message: "Error fetching profile" });
    }


}

// Get student fees
export const getStudentFees = async (req, res) => {
    try {
        const studentEmail = req.student; // Extracted from token in middleware
        const student = await Student.findOne({ email: studentEmail });
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }
        const fees = await Fees.find({ student: student._id });
        res.json({ success: true, fees });
    } catch (error) {
        console.error("Error fetching student fees:", error);
        res.json({ success: false, message: "Error fetching fees" });
    }
}


// Get student's issued books
export const getIssuedBooks = async (req, res) => {
    try {
        const studentEmail = req.student; // Extracted from token in middleware
        const student = await Student.findOne({ email: studentEmail });
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        const studentBooks = await StudentBook.find({ studentId: student._id })
            .populate('bookId', 'name subject')
            .sort({ issueDate: -1 });
        console.log("Students books :", studentBooks);

        if (!studentBooks || studentBooks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books issued to this student',
            });
        }

        res.status(200).json({
            success: true,
            count: studentBooks.length,
            data: studentBooks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student books',
            error: error.message,
        });
    }
};

//get books
export const getBooks = async (req, res) => {
    try {
        const studentEmail = req.student; // Extracted from token in middleware
        const student = await Student.findOne({ email: studentEmail }).select('-password').populate(
            "class",
            "name section capacity fees"
        );
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        const Books = await Book.find({ className: student.class?.name })

        console.log("books :", Books);

        if (!Books || Books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books',
            });
        }

        res.status(200).json({
            success: true,
            count: Books.length,
            data: Books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student books',
            error: error.message,
        });
    }
};

// Get student's uniform items
export const getStudentUniforms = async (req, res) => {
    try {
        const studentEmail = req.student; // Extracted from token in middleware
        const student = await Student.findOne({ email: studentEmail });
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        const studentUniforms = await StudentUniform.find({ student: student._id });
        res.json({ success: true, studentUniforms });
    }catch(error){
        console.error("Error fetching student uniforms:", error);
        res.json({ success: false, message: "Error fetching uniforms" });
    }
}

// Get available uniform items for the student's class
export const getAvailableUniformItems = async (req, res) => {
    try {       
        const uniformItems = await UniformItem.find();
        res.json({ success: true, uniformItems });
    } catch (error) {
        console.error("Error fetching uniform items:", error);
        res.json({ success: false, message: "Error fetching uniform items" });
    }
}

//get All announcement 

export const getAllAnnouncements = async (req, res) => {
    try{
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ announcements });
    }catch(error){
        console.error('Error fetching announcements:',error);
        res.status(500).json({message:'Internal server error'});
    }
}



