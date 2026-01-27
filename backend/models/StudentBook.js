// models/StudentBook.js
import mongoose from 'mongoose';

const studentBookSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please provide student ID'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    bookName: {
      type: String,
    },
    className: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'issued', 'returned', 'partial'],
      default: 'pending',
    },
    condition: {
      type: String,
      enum: ['good', 'damaged', 'lost'],
      default: 'good',
    },
    notes: {
      type: String,
    },
    fine: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const StudentBook = mongoose.model('StudentBook', studentBookSchema);

export default StudentBook;