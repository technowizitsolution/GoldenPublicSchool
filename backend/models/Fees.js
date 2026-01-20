import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    mode: {
      type: String,
      enum: ["cash", "upi", "card", "bank_transfer"],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const feesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    totalFees: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["paid", "partial", "unpaid", "overdue"],
      default: "unpaid",
    },

    paymentHistory: [paymentHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
feesSchema.index({ student: 1 });
feesSchema.index({ class: 1 });
feesSchema.index({ status: 1 });

export default mongoose.model("Fees", feesSchema);