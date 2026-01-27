// controllers/booksController.js
import Book from '../models/Book.js';
import StudentBook from '../models/StudentBook.js';
import Student from '../models/Student.js';

// Get all books

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ className: 1, subject: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
};

// Get all classes with book statistics
export const getClassBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: '$className',
          totalBooks: { $sum: '$totalStock' },
          issuedBooks: { $sum: '$issuedCount' },
          damagedBooks: { $sum: '$damagedCount' },
          availableBooks: { $sum: '$availableStock' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class statistics',
      error: error.message,
    });
  }
};

// Add new book to inventory
export const addBook = async (req, res) => {
  try {
    const { name, subject, className, totalStock, isbn, publisher, author, edition, price, description } = req.body;

    console.log(req.body);
    // Validate required fields
    if (!name || !subject || !className || totalStock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ name, className });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book already exists for this class',
      });
    }

    console.log("adding books ....");

    // ✅ Don't set availableStock manually - let the pre-save hook handle it
    const book = await Book.create({
      name,
      subject,
      className,
      totalStock,
      issuedCount: 0,  // Explicitly set to 0
      damagedCount: 0, // Explicitly set to 0
      isbn,
      publisher,
      author,
      edition,
      price,
      description,
    });
    console.log('New book added:', book);

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book,
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding book',
      error: error.message,
    });
  }
};

// Update book inventory
export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { totalStock, issuedCount, damagedCount } = req.body;
    const availableStock = totalStock - issuedCount - damagedCount;

    console.log("Updating book:", req.body);

    const book = await Book.findByIdAndUpdate(
      bookId,
      {availableStock,...req.body},
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message,
    });
  }
};

// Issue books to student
export const issueBooks = async (req, res) => {
  try {
    const { studentId, bookIds, className } = req.body;

    // Validate input
    if (!studentId || !bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid student ID and book IDs',
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const issuedBooks = [];
    const errors = [];

    for (const bookId of bookIds) {
      try {
        const book = await Book.findById(bookId);

        if (!book) {
          errors.push(`Book with ID ${bookId} not found`);
          continue;
        }

        // Check if book is already issued to student
        const existingIssue = await StudentBook.findOne({
          studentId,
          bookId,
          status: 'issued',
        });

        if (existingIssue) {
          errors.push(`${book.name} already issued to this student`);
          continue;
        }

        // Check availability
        if (book.availableStock <= 0) {
          errors.push(`${book.name} is out of stock`);
          continue;
        }

        // Create student book record
        const studentBook = await StudentBook.create({
          studentId,
          bookId,
          bookName: book.name,
          className,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: 'issued',
        });

        // Update book inventory
        book.issuedCount += 1;
        await book.save();

        issuedBooks.push({
          bookId,
          bookName: book.name,
          issueDate: studentBook.issueDate,
          dueDate: studentBook.dueDate,
        });
      } catch (err) {
        errors.push(`Error issuing book: ${err.message}`);
      }
    }

    res.status(201).json({
      success: issuedBooks.length > 0,
      message: issuedBooks.length > 0 ? 'Books issued successfully' : 'Could not issue any books',
      issuedCount: issuedBooks.length,
      data: issuedBooks,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error issuing books',
      error: error.message,
    });
  }
};

// Get student's issued books
export const getStudentBooks = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBooks = await StudentBook.find({ studentId })
      .populate('bookId', 'name subject')
      .sort({ issueDate: -1 });
      console.log("Students books :",studentBooks);

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

// Return book
export const returnBook = async (req, res) => {
  try {
    const { studentBookId } = req.params;
    const { condition = 'good', notes = '' } = req.body;

    const studentBook = await StudentBook.findById(studentBookId);

    if (!studentBook) {
      return res.status(404).json({
        success: false,
        message: 'Book record not found',
      });
    }

    if (studentBook.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: 'Book is not currently issued',
      });
    }

    const book = await Book.findById(studentBook.bookId);

    // Update student book record
    studentBook.returnDate = new Date();
    studentBook.status = condition === 'damaged' ? 'damaged' : 'returned';
    studentBook.condition = condition;
    studentBook.notes = notes;

    // Calculate fine if overdue
    if (new Date() > studentBook.dueDate) {
      const daysOverdue = Math.floor((new Date() - studentBook.dueDate) / (1000 * 60 * 60 * 24));
      studentBook.fine = daysOverdue * 10; // 10 per day
    }

    await studentBook.save();

    // Update book inventory
    if (book) {
      book.issuedCount = Math.max(0, book.issuedCount - 1);
      if (condition === 'damaged') {
        book.damagedCount += 1;
      }
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: studentBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error returning book',
      error: error.message,
    });
  }
};

// Get class distribution status
export const getClassDistribution = async (req, res) => {
  try {
    const { className } = req.params;

    // Get all students in class
    const students = await Student.find({ className });

    // Get all issued books for class
    const issuedBooks = await StudentBook.find({
      className,
      status: 'issued',
    });

    // Count students with and without books
    const studentsWithBooks = new Set(issuedBooks.map(sb => sb.studentId.toString())).size;
    const studentsWithoutBooks = students.length - studentsWithBooks;

    res.status(200).json({
      success: true,
      data: {
        className,
        totalStudents: students.length,
        studentsWithBooks,
        studentsWithoutBooks,
        totalBooksIssued: issuedBooks.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching distribution status',
      error: error.message,
    });
  }
};

// Get overdue books
export const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await StudentBook.find({
      status: 'issued',
      dueDate: { $lt: new Date() },
    })
      .populate('studentId', 'name rollNo')
      .populate('bookId', 'name subject')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: overdueBooks.length,
      data: overdueBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue books',
      error: error.message,
    });
  }
};

// Generate book report
export const getBookReport = async (req, res) => {
  try {
    const { className, startDate, endDate } = req.query;

    let query = {};
    if (className) query.className = className;

    const report = await StudentBook.find(query)
      .populate('studentId', 'name rollNo className')
      .populate('bookId', 'name subject isbn')
      .lean();

    const summary = {
      totalIssued: report.filter(r => r.status === 'issued').length,
      totalReturned: report.filter(r => r.status === 'returned').length,
      totalDamaged: report.filter(r => r.status === 'damaged').length,
      totalLost: report.filter(r => r.status === 'lost').length,
      totalFine: report.reduce((sum, r) => sum + (r.fine || 0), 0),
    };

    res.status(200).json({
      success: true,
      summary,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message,
    });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if any books are currently issued
    const issuedCount = await StudentBook.countDocuments({
      bookId,
      status: 'issued',
    });

    if (issuedCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete book. ${issuedCount} copies are still issued.`,
      });
    }

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message,
    });
  }
};