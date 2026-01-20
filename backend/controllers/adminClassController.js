import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";

// Get all classes
export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({ status: { $ne: "DELETED" } })
            .populate("classTeacher", "firstName lastName email");
        
        res.status(200).json({
            success: true,
            message: "Classes fetched successfully",
            classes,
        });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Create a new class
export const createClass = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const {
            name,
            section,
            academicYear,
            classTeacher,
            capacity,
            fees,
            status,
        } = req.body;

        // Validate required fields
        if (!name || !academicYear || !classTeacher) {
            return res.status(400).json({
                success: false,
                message: "Name, Academic Year, and Class Teacher are required",
            });
        }

        // Validate class teacher exists
        const teacher = await Teacher.findById(classTeacher);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        // Validate fees if provided
        if (fees && fees.tuition === undefined) {
            return res.status(400).json({
                success: false,
                message: "Tuition fee is required",
            });
        }

        // Check for duplicate class
        const existingClass = await Class.findOne({
            name,
            academicYear,
            section: section || null,
        });

        if (existingClass) {
            return res.status(400).json({
                success: false,
                message: "Class with this name already exists in this academic year",
            });
        }

        // Prepare class data
        const classData = {
            name,
            section: section || null,
            academicYear,
            classTeacher,
            capacity: capacity || 40,
            fees: {
                tuition: fees?.tuition || 0,
                admission: fees?.admission || 0,
                exam: fees?.exam || 0,
                transport: fees?.transport || 0,
                currency: fees?.currency || "INR",
            },
            status: status || "ACTIVE",
        };

        // Create class
        const newClass = await Class.create(classData);

        // Populate teacher info before sending response
        await newClass.populate("classTeacher", "firstName lastName email");

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            class: newClass,
        });
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

// Delete a class
export const deleteClass = async (req, res) => {
    try {
        const { classId } = req.params;

        // Validate class ID
        if (!classId) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required",
            });
        }

        // Find and delete the class
        const deletedClass = await Class.findByIdAndDelete(classId);

        if (!deletedClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Class deleted successfully",
            class: deletedClass,
        });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get a single class by ID
export const getClassById = async (req, res) => {
    try {
        const { classId } = req.params;

        const classData = await Class.findById(classId).populate(
            "classTeacher",
            "firstName lastName email phone"
        );

        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found",
            });
        }

        res.status(200).json({
            success: true,
            class: classData,
        });
    } catch (error) {
        console.error("Error fetching class:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};