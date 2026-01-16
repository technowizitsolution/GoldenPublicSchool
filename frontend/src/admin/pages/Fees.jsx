import React, { useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';

const Fees = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // All classes in school
  const classes = [
    { id: 1, name: '9-A', students: 35, totalFees: 175000, collected: 145000 },
    { id: 2, name: '9-B', students: 32, totalFees: 160000, collected: 128000 },
    { id: 3, name: '9-C', students: 30, totalFees: 150000, collected: 120000 },
    { id: 4, name: '10-A', students: 38, totalFees: 190000, collected: 152000 },
    { id: 5, name: '10-B', students: 36, totalFees: 180000, collected: 144000 },
    { id: 6, name: '10-C', students: 34, totalFees: 170000, collected: 136000 },
  ];

  // Dummy student fees data organized by class
  const allStudentsData = {
    '9-A': [
      { id: 1, name: 'Ahmed Ali', class: '9-A', rollNo: '01', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
      { id: 2, name: 'Sara Khan', class: '9-A', rollNo: '02', totalFees: 5000, paid: 2500, status: 'pending', dueDate: '2026-01-15' },
      { id: 3, name: 'Fatima Malik', class: '9-A', rollNo: '04', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
      { id: 4, name: 'Zainab Ali', class: '9-A', rollNo: '08', totalFees: 5000, paid: 2500, status: 'pending', dueDate: '2026-01-15' },
    ],
    '9-B': [
      { id: 5, name: 'Hassan Shah', class: '9-B', rollNo: '03', totalFees: 5000, paid: 0, status: 'overdue', dueDate: '2025-12-15' },
      { id: 6, name: 'Ayesha Ahmed', class: '9-B', rollNo: '06', totalFees: 5000, paid: 0, status: 'overdue', dueDate: '2025-11-15' },
    ],
    '9-C': [
      { id: 7, name: 'Ali Hassan', class: '9-C', rollNo: '05', totalFees: 5000, paid: 3750, status: 'pending', dueDate: '2026-01-15' },
      { id: 8, name: 'Muhammad Usman', class: '9-C', rollNo: '07', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
    ],
    '10-A': [
      { id: 9, name: 'Amina Khan', class: '10-A', rollNo: '01', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
      { id: 10, name: 'Omar Ali', class: '10-A', rollNo: '02', totalFees: 5000, paid: 2500, status: 'pending', dueDate: '2026-01-15' },
    ],
    '10-B': [
      { id: 11, name: 'Hira Khan', class: '10-B', rollNo: '01', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
      { id: 12, name: 'Bilal Ahmed', class: '10-B', rollNo: '02', totalFees: 5000, paid: 0, status: 'overdue', dueDate: '2025-12-15' },
    ],
    '10-C': [
      { id: 13, name: 'Nadia Malik', class: '10-C', rollNo: '01', totalFees: 5000, paid: 5000, status: 'paid', dueDate: '2026-01-15' },
      { id: 14, name: 'Hassan Khan', class: '10-C', rollNo: '02', totalFees: 5000, paid: 2500, status: 'pending', dueDate: '2026-01-15' },
    ],
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // CLASS VIEW
  if (!selectedClass) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
          <p className="text-gray-600">Select a class to view student fees</p>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Classes</p>
            <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
            <p className="text-gray-500 text-xs mt-2">In school</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Collected</p>
            <p className="text-3xl font-bold text-green-600">Rs. {classes.reduce((sum, c) => sum + c.collected, 0).toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Overall fees collected</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-yellow-600">Rs. {classes.reduce((sum, c) => sum + (c.totalFees - c.collected), 0).toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const collected = classItem.collected;
            const total = classItem.totalFees;
            const percentage = ((collected / total) * 100).toFixed(1);

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
                    <div className="text-2xl font-semibold text-blue-300">{percentage}%</div>
                    <p className="text-gray-500 text-xs">Collected</p>
                  </div>
                </div>

                <div className="mb-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-300 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Collected</p>
                    <p className="font-bold text-green-600">Rs. {(collected / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Total</p>
                    <p className="font-bold text-gray-900">Rs. {(total / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition">
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // STUDENT FEES VIEW
  const studentsInClass = allStudentsData[selectedClass] || [];

  const filteredData = studentsInClass.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const classData = classes.find(c => c.name === selectedClass);
  const totalFees = studentsInClass.reduce((sum, s) => sum + s.totalFees, 0);
  const totalPaid = studentsInClass.reduce((sum, s) => sum + s.paid, 0);
  const totalPending = totalFees - totalPaid;

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
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-4 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Classes
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class {selectedClass} - Fees Management</h1>
        <p className="text-gray-600">{studentsInClass.length} students in this class</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Fees</p>
          <p className="text-3xl font-bold text-gray-900">Rs. {totalFees.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">From this class</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Collected</p>
          <p className="text-3xl font-bold text-green-600">Rs. {totalPaid.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">{studentsInClass.filter(s => s.status === 'paid').length} students paid</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">Rs. {totalPending.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Collection Rate</p>
          <p className="text-3xl font-bold text-red-600">{((totalPaid / totalFees) * 100).toFixed(1)}%</p>
          <p className="text-gray-500 text-xs mt-2">Overall collection</p>
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
            {['all', 'paid', 'pending', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Fees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Fees</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Paid</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Remaining</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.rollNo}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">Rs. {student.totalFees.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">Rs. {student.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">Rs. {(student.totalFees - student.paid).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(student.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{studentsInClass.length}</span> students
        </p>
      </div>
    </div>
  );
};

export default Fees;