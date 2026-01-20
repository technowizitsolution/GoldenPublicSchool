import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        trim:true,
        minlength:3,
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
        type:String,
        required:true,
        minlength:6,
        select:false,
    },

    // Personal Information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone:{
        type:String,
        required:true,
        match: [/^\d{10,15}$/, "Please provide a valid phone number"],
    },
    address: {
        type:String,
        required:false,
    },
    bloodType: {
        type:String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: false,
    },
    birthday: {
        type:Date,
        required:false,
    },
    sex: {
        type:String,
        enum:["Male","Female","Other"],
        required:true,
        default:"Male",
    },
    photo: {
        type:String,
        required:false,
    },

    //Academic Information
    studentId: {
        type:String,
        required:true,
        unique:true,
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: "Class",
        required: true,
    },
    section: {
        type:String,
        required:false,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },

    // Parent/Guardian Information
    parentName: {
      type: String,
      required: false,
    },
    parentPhone: {
      type: String,
      required: false,
    },
    parentEmail: {
      type: String,
      required: false,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "graduated", "suspended"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
},{ timestamps: true });

const Student = mongoose.model('Student',StudentSchema);

export default Student;