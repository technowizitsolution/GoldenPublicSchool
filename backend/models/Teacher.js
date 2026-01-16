import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    // AUTHENTICATION
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    // PERSONAL INFO
    phone: {
      type: String
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    dob: {
      type: Date
    },

    address: {
      type: String
    },

    // TEACHER-SPECIFIC INFO
    employeeId: {
      type: String,
      unique: true,
      sparse: true // important (explained below)
    },

    qualification: {
      type: String
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    joiningDate: {
      type: Date
    },

    // STATUS & CONTROL
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Teacher =  mongoose.model("Teacher", teacherSchema);
export default Teacher;
