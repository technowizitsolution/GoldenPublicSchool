import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true
    },

    section: {
      type: String,
      uppercase: true,
      trim: true,
      default: null // VERY IMPORTANT
    },

    academicYear: {
      type: String,
      required: true // "2025-2026"
    },

    
    classTeacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teacher",
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100, 
      default: 40
    },


    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

//Prevent duplicate classes
classSchema.index(
  { name: 1, academicYear: 1 },
  {
    unique: true,
    partialFilterExpression: { section: null }
  }
);


const Class =  mongoose.model("Class", classSchema);

export default Class;
