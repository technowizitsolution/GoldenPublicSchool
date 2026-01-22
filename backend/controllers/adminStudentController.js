import Student from '../models/Student.js';
import { v2 as cloudinary } from "cloudinary";
import Fees from '../models/Fees.js';
import Class from '../models/Class.js';
import StudentUniform from '../models/StudentUniform.js';

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ isDeleted: false }).populate(
            "class",
            "name section capacity fees"
        );
        res.status(200).json({ message: 'Students fetched successfully', students });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create a new student
export const createStudent = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { email, class: classId } = req.body;

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

        console.log("profileImage : ", profileImage);

        // Prepare student data
        const studentData = {
            ...req.body,
            photo: profileImage,
        };

        // Create student
        const newStudent = await Student.create(studentData);

        // Create fees record for the student if class is assigned
        if (classId) {
            const classData = await Class.findById(classId);

            if (classData) {
                const totalFees = classData.fees.tuition + classData.fees.admission +
                    classData.fees.exam + classData.fees.transport;

                await Fees.create({
                    student: newStudent._id,
                    class: classId,
                    totalFees: totalFees,
                    paidAmount: 0,
                    dueDate: new Date('2026-12-31'), // Set your due date
                    status: 'unpaid',
                    paymentHistory: []
                });

                console.log(`Fees record created for student: ${newStudent._id}`);
            }
        }

        //Initialize student uniform record
        await StudentUniform.create({
            student: newStudent._id,
            class: classId,
            status: "pending",
            totalUniformsIssued: 0,
            notes: "Uniform not issued yet",
            isActive: true
        });
        

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

    // Get a single student by ID
    export const getStudentById = async (req, res) => {
        try {
            const { studentId } = req.params;
            const student = await Student.findById(studentId).populate(
                "class",
                "name section capacity fees"
            );

            if (!student || student.isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }

            res.status(200).json({
                success: true,
                student,
            });
        } catch (error) {
            console.error("Error fetching student:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    //Record a payment for a student
    export const recordPayment = async (req, res) => {
        try {
            const { studentId, amount, date, mode = 'cash', note = '' } = req.body;

            // Validate input
            if (!studentId || !amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input: studentId and amount are required'
                });
            }

            // Find fees record
            const feesRecord = await Fees.findOne({ student: studentId })
                .populate('student', 'firstName lastName studentId')
                .populate('class', 'name');

            if (!feesRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Fees record not found for this student'
                });
            }

            // Check if payment exceeds remaining balance
            const remaining = feesRecord.totalFees - feesRecord.paidAmount;
            if (amount > remaining) {
                return res.status(400).json({
                    success: false,
                    message: `Payment exceeds remaining balance of Rs. ${remaining}`
                });
            }

            // Generate unique transaction ID
            const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Add to payment history
            feesRecord.paymentHistory.push({
                amount: parseFloat(amount),
                paymentDate: new Date(date),
                mode: mode,
                transactionId: transactionId,
                note: note,
            });

            // Update paid amount
            feesRecord.paidAmount += parseFloat(amount);

            // Update status based on payment
            if (feesRecord.paidAmount >= feesRecord.totalFees) {
                feesRecord.status = 'paid';
            } else if (feesRecord.paidAmount > 0) {
                feesRecord.status = 'partial';
            } else if (new Date() > new Date(feesRecord.dueDate)) {
                feesRecord.status = 'overdue';
            } else {
                feesRecord.status = 'unpaid';
            }

            // Save to database
            await feesRecord.save();

            res.status(200).json({
                success: true,
                message: 'Payment recorded successfully',
                data: {
                    feesId: feesRecord._id,
                    studentId: feesRecord.student._id,
                    studentName: `${feesRecord.student.firstName} ${feesRecord.student.lastName}`,
                    totalFees: feesRecord.totalFees,
                    paidAmount: feesRecord.paidAmount,
                    remaining: feesRecord.totalFees - feesRecord.paidAmount,
                    status: feesRecord.status,
                    transactionId: transactionId,
                    paymentHistory: feesRecord.paymentHistory,
                }
            });

        } catch (error) {
            console.error('Payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Error recording payment: ' + error.message
            });
        }
    }


    //get all fees records
    export const getAllFeesRecords = async (req, res) => {
        try {
            const fees = await Fees.find()
                .populate('student', 'firstName lastName studentId email phone')
                .populate('class', 'name');

            res.status(200).json({
                success: true,
                fees: fees
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching fees: ' + error.message
            });
        }
    }


    //Get fees by student ID
    export const getFeesByStudentId = async (req, res) => {
        try {
            const fees = await Fees.findOne({ student: req.params.studentId })
                .populate('student', 'firstName lastName studentId email phone')
                .populate('class', 'name');

            if (!fees) {
                return res.status(404).json({
                    success: false,
                    message: 'Fees record not found'
                });
            }

            res.status(200).json({
                success: true,
                data: fees
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching fees: ' + error.message
            });
        }
    }


