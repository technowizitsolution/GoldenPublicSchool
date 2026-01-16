import React, { useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';

const Books = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [studentBookState, setStudentBookState] = useState({});

  // Classes data
  const classes = [
    { id: 1, name: '9-A', students: 35, booksIssued: 32, booksPending: 3 },
    { id: 2, name: '9-B', students: 32, booksIssued: 28, booksPending: 4 },
    { id: 3, name: '9-C', students: 30, booksIssued: 30, booksPending: 0 },
    { id: 4, name: '10-A', students: 38, booksIssued: 36, booksPending: 2 },
    { id: 5, name: '10-B', students: 36, booksIssued: 34, booksPending: 2 },
    { id: 6, name: '10-C', students: 34, booksIssued: 32, booksPending: 2 },
  ];

  // Book items inventory
  const bookItems = [
    { id: 1, name: 'Mathematics', subject: 'Math', totalStock: 150, issued: 132, damaged: 3 },
    { id: 2, name: 'Science', subject: 'Science', totalStock: 150, issued: 138, damaged: 2 },
    { id: 3, name: 'English', subject: 'English', totalStock: 150, issued: 145, damaged: 1 },
    { id: 4, name: 'History', subject: 'Social Studies', totalStock: 120, issued: 95, damaged: 2 },
    { id: 5, name: 'Geography', subject: 'Social Studies', totalStock: 120, issued: 108, damaged: 1 },
    { id: 6, name: 'Physics', subject: 'Science', totalStock: 100, issued: 87, damaged: 2 },
  ];

  // Student books data by class
  const studentBooksData = {
    '9-A': [
      { id: 1, name: 'Ahmed Ali', rollNo: '01', issuedBooks: ['Mathematics', 'Science'], status: 'issued', issueDate: '2025-12-01' },
      { id: 2, name: 'Sara Khan', rollNo: '02', issuedBooks: ['English'], status: 'issued', issueDate: '2025-12-01' },
      { id: 3, name: 'Hassan Shah', rollNo: '03', issuedBooks: [], status: 'pending', issueDate: null },
      { id: 4, name: 'Fatima Malik', rollNo: '04', issuedBooks: ['Mathematics', 'English', 'Science'], status: 'issued', issueDate: '2025-12-01' },
    ],
    '9-B': [
      { id: 5, name: 'Ali Hassan', rollNo: '01', issuedBooks: ['Science', 'History'], status: 'issued', issueDate: '2025-12-01' },
      { id: 6, name: 'Ayesha Ahmed', rollNo: '02', issuedBooks: ['Mathematics', 'English'], status: 'issued', issueDate: '2025-12-01' },
      { id: 7, name: 'Muhammad Khan', rollNo: '03', issuedBooks: ['Physics', 'Geography'], status: 'issued', issueDate: '2025-12-01' },
      { id: 8, name: 'Zainab Ali', rollNo: '04', issuedBooks: [], status: 'pending', issueDate: null },
    ],
    '9-C': [
      { id: 9, name: 'Amina Khan', rollNo: '01', issuedBooks: ['Mathematics', 'Science'], status: 'issued', issueDate: '2025-12-01' },
      { id: 10, name: 'Omar Ali', rollNo: '02', issuedBooks: ['English', 'History'], status: 'issued', issueDate: '2025-12-01' },
    ],
    '10-A': [
      { id: 11, name: 'Hira Khan', rollNo: '01', issuedBooks: ['Physics', 'Chemistry'], status: 'issued', issueDate: '2025-12-01' },
      { id: 12, name: 'Bilal Ahmed', rollNo: '02', issuedBooks: ['Mathematics'], status: 'issued', issueDate: '2025-12-01' },
    ],
    '10-B': [
      { id: 13, name: 'Nadia Malik', rollNo: '01', issuedBooks: ['English', 'Geography'], status: 'issued', issueDate: '2025-12-01' },
      { id: 14, name: 'Hassan Khan', rollNo: '02', issuedBooks: [], status: 'pending', issueDate: null },
    ],
    '10-C': [
      { id: 15, name: 'Fatima Khan', rollNo: '01', issuedBooks: ['Mathematics', 'Science', 'English'], status: 'issued', issueDate: '2025-12-01' },
      { id: 16, name: 'Ahmed Hassan', rollNo: '02', issuedBooks: ['History'], status: 'issued', issueDate: '2025-12-01' },
    ],
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleBookToggle = (studentId, bookName) => {
    const key = `${studentId}-${bookName}`;
    setStudentBookState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleIssueBooks = (studentId, studentName) => {
    const selectedBooks = bookItems.filter(book => 
      studentBookState[`${studentId}-${book.name}`]
    );
    
    if (selectedBooks.length === 0) {
      alert('Please select at least one book');
      return;
    }
    
    console.log(`Issuing books to ${studentName}:`, selectedBooks.map(b => b.name));
    alert(`Books issued successfully to ${studentName}: ${selectedBooks.map(b => b.name).join(', ')}`);
    
    // Reset checkboxes for this student
    const newState = { ...studentBookState };
    bookItems.forEach(book => {
      delete newState[`${studentId}-${book.name}`];
    });
    setStudentBookState(newState);
  };

  // CLASS VIEW
  if (!selectedClass) {
    const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
    const totalIssued = classes.reduce((sum, c) => sum + c.booksIssued, 0);
    const totalPending = classes.reduce((sum, c) => sum + c.booksPending, 0);

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Books Management</h1>
          <p className="text-gray-600">Track and manage student books by class</p>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
            <p className="text-gray-500 text-xs mt-2">Across all classes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Books Issued</p>
            <p className="text-3xl font-bold text-green-600">{totalIssued}</p>
            <p className="text-gray-500 text-xs mt-2">{((totalIssued / totalStudents) * 100).toFixed(1)}% issued</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting distribution</p>
          </div>
        </div>

        {/* Classes Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Books by Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const issuedPercentage = ((classItem.booksIssued / classItem.students) * 100).toFixed(1);

              return (
                <div
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.name)}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-blue-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{classItem.name}</h3>
                      <p className="text-gray-600 text-sm">{classItem.students} Students</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{issuedPercentage}%</div>
                      <p className="text-gray-500 text-xs">Distributed</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${issuedPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Issued</p>
                      <p className="font-bold text-blue-600">{classItem.booksIssued}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Pending</p>
                      <p className="font-bold text-yellow-600">{classItem.booksPending}</p>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition">
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // STUDENT BOOKS VIEW
  const studentsInClass = studentBooksData[selectedClass] || [];

  const filteredData = studentsInClass.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const classBooksIssued = studentsInClass.filter(s => s.status === 'issued').length;
  const classBooksPending = studentsInClass.filter(s => s.status === 'pending').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setSelectedClass(null);
            setSearchTerm('');
            setFilterStatus('all');
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Classes
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class {selectedClass} - Book Distribution</h1>
        <p className="text-gray-600">{studentsInClass.length} students in this class</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">{studentsInClass.length}</p>
          <p className="text-gray-500 text-xs mt-2">In this class</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Books Issued</p>
          <p className="text-3xl font-bold text-green-600">{classBooksIssued}</p>
          <p className="text-gray-500 text-xs mt-2">{((classBooksIssued / studentsInClass.length) * 100).toFixed(1)}% distributed</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{classBooksPending}</p>
          <p className="text-gray-500 text-xs mt-2">Awaiting distribution</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'issued', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students and Books */}
      <div className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Student Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600 text-sm">Roll No: {student.rollNo}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                    {student.issuedBooks.length > 0 && (
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">{student.issuedBooks.length}</span> books issued
                      </p>
                    )}
                  </div>
                </div>

                {student.issuedBooks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Currently Issued:</p>
                    <div className="flex flex-wrap gap-2">
                      {student.issuedBooks.map((book, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {book}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Books Selection */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Issue Books</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {bookItems.map((book) => {
                    const isAlreadyIssued = student.issuedBooks.includes(book.name);
                    const isSelected = studentBookState[`${student.id}-${book.name}`];

                    return (
                      <label
                        key={book.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : isAlreadyIssued
                            ? 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => handleBookToggle(student.id, book.name)}
                          disabled={isAlreadyIssued}
                          className="w-4 h-4 cursor-pointer accent-blue-600"
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{book.name}</p>
                          <p className="text-xs text-gray-600">{book.subject}</p>
                        </div>
                        {isAlreadyIssued && (
                          <span className="text-xs text-gray-500 font-medium">Issued</span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleIssueBooks(student.id, student.name)}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Issue Selected Books
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No students found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{studentsInClass.length}</span> students
        </p>
      </div>
    </div>
  );
};

export default Books;