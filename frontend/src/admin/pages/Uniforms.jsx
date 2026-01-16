import React, { useState } from 'react';
import { Search, ChevronLeft, AlertCircle } from 'lucide-react';

const Uniforms = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Classes data
  const classes = [
    { id: 1, name: '9-A', students: 35, uniformsIssued: 32, uniformsPending: 3 },
    { id: 2, name: '9-B', students: 32, uniformsIssued: 28, uniformsPending: 4 },
    { id: 3, name: '9-C', students: 30, uniformsIssued: 30, uniformsPending: 0 },
    { id: 4, name: '10-A', students: 38, uniformsIssued: 36, uniformsPending: 2 },
    { id: 5, name: '10-B', students: 36, uniformsIssued: 34, uniformsPending: 2 },
    { id: 6, name: '10-C', students: 34, uniformsIssued: 32, uniformsPending: 2 },
  ];

  // Uniform items inventory
  const uniformItems = [
    { id: 1, name: 'Shirt', sizes: { 'S': 45, 'M': 80, 'L': 60, 'XL': 25 }, totalStock: 210, issued: 185, damaged: 8 },
    { id: 2, name: 'Pants', sizes: { '28': 35, '30': 75, '32': 65, '34': 40 }, totalStock: 215, issued: 190, damaged: 5 },
    { id: 3, name: 'Shoes', sizes: { '6': 25, '7': 60, '8': 85, '9': 50 }, totalStock: 220, issued: 200, damaged: 3 },
    { id: 4, name: 'Belt', sizes: { 'S': 50, 'M': 100, 'L': 70 }, totalStock: 220, issued: 210, damaged: 2 },
    { id: 5, name: 'Tie', sizes: { 'One Size': 200 }, totalStock: 200, issued: 195, damaged: 1 },
    { id: 6, name: 'Socks (pair)', sizes: { 'One Size': 300 }, totalStock: 300, issued: 280, damaged: 5 },
  ];

  // Student uniforms data by class
  const studentUniformsData = {
    '9-A': [
      { id: 1, name: 'Ahmed Ali', rollNo: '01', shirt: 'S-Issued', pants: '30-Issued', shoes: '7-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 2, name: 'Sara Khan', rollNo: '02', shirt: 'M-Issued', pants: '28-Issued', shoes: '6-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 3, name: 'Hassan Shah', rollNo: '03', shirt: 'L-Pending', pants: '32-Pending', shoes: '8-Pending', status: 'pending', issueDate: null, condition: 'n/a' },
      { id: 4, name: 'Fatima Malik', rollNo: '04', shirt: 'M-Issued', pants: '28-Issued', shoes: '6-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'worn' },
    ],
    '9-B': [
      { id: 5, name: 'Ali Hassan', rollNo: '01', shirt: 'L-Issued', pants: '32-Issued', shoes: '8-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 6, name: 'Ayesha Ahmed', rollNo: '02', shirt: 'M-Issued', pants: '28-Issued', shoes: '6-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 7, name: 'Muhammad Khan', rollNo: '03', shirt: 'XL-Issued', pants: '34-Issued', shoes: '9-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 8, name: 'Zainab Ali', rollNo: '04', shirt: 'S-Pending', pants: '28-Pending', shoes: '6-Pending', status: 'pending', issueDate: null, condition: 'n/a' },
    ],
    '9-C': [
      { id: 9, name: 'Amina Khan', rollNo: '01', shirt: 'M-Issued', pants: '30-Issued', shoes: '7-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 10, name: 'Omar Ali', rollNo: '02', shirt: 'L-Issued', pants: '32-Issued', shoes: '8-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'worn' },
    ],
    '10-A': [
      { id: 11, name: 'Hira Khan', rollNo: '01', shirt: 'M-Issued', pants: '30-Issued', shoes: '7-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 12, name: 'Bilal Ahmed', rollNo: '02', shirt: 'L-Issued', pants: '32-Issued', shoes: '8-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
    ],
    '10-B': [
      { id: 13, name: 'Nadia Malik', rollNo: '01', shirt: 'M-Issued', pants: '30-Issued', shoes: '7-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
      { id: 14, name: 'Hassan Khan', rollNo: '02', shirt: 'L-Pending', pants: '32-Pending', shoes: '8-Pending', status: 'pending', issueDate: null, condition: 'n/a' },
    ],
    '10-C': [
      { id: 15, name: 'Fatima Khan', rollNo: '01', shirt: 'S-Issued', pants: '28-Issued', shoes: '6-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'worn' },
      { id: 16, name: 'Ahmed Hassan', rollNo: '02', shirt: 'M-Issued', pants: '30-Issued', shoes: '7-Issued', status: 'issued', issueDate: '2025-12-01', condition: 'good' },
    ],
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'worn':
        return 'bg-blue-100 text-blue-800';
      case 'damaged':
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
    const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
    const totalIssued = classes.reduce((sum, c) => sum + c.uniformsIssued, 0);
    const totalPending = classes.reduce((sum, c) => sum + c.uniformsPending, 0);

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Uniform Management</h1>
          <p className="text-gray-600">Track and manage student uniforms by class</p>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
            <p className="text-gray-500 text-xs mt-2">Across all classes</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Uniforms Issued</p>
            <p className="text-3xl font-bold text-green-600">{totalIssued}</p>
            <p className="text-gray-500 text-xs mt-2">{((totalIssued / totalStudents) * 100).toFixed(1)}% issued</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting distribution</p>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Uniform Items Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniformItems.map((item) => {
              const issuedPercentage = ((item.issued / item.totalStock) * 100).toFixed(1);
              const available = item.totalStock - item.issued - item.damaged;

              return (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-xs">Total: {item.totalStock}</p>
                    </div>
                    {available < 10 && available > 0 && (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${issuedPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Issued</p>
                      <p className="font-bold text-green-600">{item.issued}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available</p>
                      <p className="font-bold text-blue-600">{available}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Damaged</p>
                      <p className="font-bold text-red-600">{item.damaged}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classes Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Uniforms by Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const issuedPercentage = ((classItem.uniformsIssued / classItem.students) * 100).toFixed(1);

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
                      <div className="text-2xl font-bold text-green-600">{issuedPercentage}%</div>
                      <p className="text-gray-500 text-xs">Distributed</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${issuedPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Issued</p>
                      <p className="font-bold text-green-600">{classItem.uniformsIssued}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Pending</p>
                      <p className="font-bold text-yellow-600">{classItem.uniformsPending}</p>
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

  // STUDENT UNIFORMS VIEW
  const studentsInClass = studentUniformsData[selectedClass] || [];

  const filteredData = studentsInClass.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const classUniformsIssued = studentsInClass.filter(s => s.status === 'issued').length;
  const classUniformsPending = studentsInClass.filter(s => s.status === 'pending').length;

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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class {selectedClass} - Uniform Distribution</h1>
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
          <p className="text-gray-600 text-sm font-medium mb-2">Uniforms Issued</p>
          <p className="text-3xl font-bold text-green-600">{classUniformsIssued}</p>
          <p className="text-gray-500 text-xs mt-2">{((classUniformsIssued / studentsInClass.length) * 100).toFixed(1)}% distributed</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{classUniformsPending}</p>
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

      {/* Student Uniforms Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shirt</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pants</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Shoes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Condition</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.rollNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.shirt}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.pants}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.shoes}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {student.condition !== 'n/a' && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(student.condition)}`}>
                          {student.condition.charAt(0).toUpperCase() + student.condition.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.issueDate ? new Date(student.issueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium transition">
                        {student.status === 'pending' ? 'Issue' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
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

export default Uniforms;