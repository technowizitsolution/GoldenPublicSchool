import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      uppercase: true,
      trim: true,
      default: null,
    },

    academicYear: {
      type: String,
      required: true,
    },

    classTeacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teacher",
      required: true,
    },

    capacity: {
      type: Number,
      min: 1,
      max: 100,
      default: 40,
    },

    // ✅ FEES (Industry-grade)
    fees: {
      tuition: {
        type: Number,
        required: true,
      },
      admission: {
        type: Number,
        default: 0,
      },
      exam: {
        type: Number,
        default: 0,
      },
      transport: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Prevent duplicate classes per academic year
classSchema.index(
  { name: 1, academicYear: 1 },
  {
    unique: true,
    partialFilterExpression: { section: null },
  }
);

const Class = mongoose.model("Class", classSchema);
export default Class;
