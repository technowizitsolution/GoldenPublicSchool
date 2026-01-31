import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, X, Filter } from 'lucide-react';
import { useAuth } from '../../context/authContext/AuthContext';
import {
  ClassCardShimmer,
  SummaryCardsShimmer,
  StudentTableShimmer,
  StudentCardsShimmer
} from '../components/ShimmerLoader';
import { useAdmin } from '../../context/adminContext/AdminContext';

const Fees = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [selectedClassData, setSelectedClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { token, axios } = useAuth();
  
  const { classes , students ,classesLoading , studentsLoading, feesData , feesLoading , getFeesData} = useAdmin();


  function filteredClassStudents(classId) {
    const classStudents = students?.filter((student) => {
      return student?.class?._id === classId || student?.class === classId;
    });
    setSelectedClassData(classStudents);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const calculateFeeStatus = (paid, totalFees, dueDate) => {
    if (paid >= totalFees) return 'paid';
    if (new Date() > new Date(dueDate)) return 'overdue';
    return 'pending';
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await axios.post(`/admin/student/payment`, {
        studentId: selectedStudent._id,
        amount: parseFloat(paymentAmount),
        date: new Date().toISOString(),
        mode: 'cash',
      }, { headers: { token } });

      if (response.status === 200 && response.data.success) {
        alert(`Payment of Rs. ${paymentAmount} recorded successfully!\nTransaction ID: ${response.data.data.transactionId}`);
        setPaymentAmount('');
        await getFeesData();
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      alert('Error recording payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setPaymentLoading(false);
    }
  };

  // CLASS VIEW
  if (!selectedClass) {
    let overallCollected = 0;
    let overallTotal = 0;

    classes.forEach((classItem) => {
      const classStudents = students.filter(s => s.class?._id === classItem._id || s.class === classItem._id);
      const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
      const classTotal = perStudentFee * classStudents.length;

      let classCollected = 0;
      classStudents.forEach(student => {
        const studentFees = feesData[student._id];
        if (studentFees) {
          classCollected += studentFees.paidAmount || 0;
        }
      });

      overallTotal += classTotal;
      overallCollected += classCollected;
    });

    return (
      <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Fees Management</h1>
          <p className="text-xs sm:text-sm text-gray-600">Select a class to view student fees</p>
        </div>

        {/* Overall Summary - Responsive Cards */}
        {classesLoading || studentsLoading || feesLoading ? (
          <SummaryCardsShimmer />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Classes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{classes.length}</p>
              <p className="text-gray-500 text-xs mt-2">In school</p>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Collected</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">Rs. {overallCollected.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-2">Overall fees collected</p>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 sm:col-span-2 lg:col-span-1">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">Rs. {(overallTotal - overallCollected).toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
            </div>
          </div>
        )}

        {/* Classes Grid - Fully Responsive */}
        {classesLoading || studentsLoading || feesLoading ? (
          <ClassCardShimmer />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {classes.map((classItem) => {
              const classStudents = students.filter(s => s.class?._id === classItem._id || s.class === classItem._id);
              const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
              const total = perStudentFee * classStudents.length;

              let collected = 0;
              classStudents.forEach(student => {
                const studentFees = feesData[student._id];
                if (studentFees) {
                  collected += studentFees.paidAmount || 0;
                }
              });

              const pending = total - collected;
              const percentage = total > 0 ? ((collected / total) * 100).toFixed(1) : 0;

              return (
                <div
                  key={classItem._id}
                  onClick={() => {
                    setSelectedClass(classItem._id);
                    filteredClassStudents(classItem._id);
                  }}
                  className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-blue-500"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Class {classItem.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Academic Year: {classItem.academicYear}
                      </p>
                    </div>

                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${classItem.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {classItem.status}
                    </span>
                  </div>

                  {/* FEES SUMMARY */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-gray-600">Collected</span>
                      <span className="font-semibold text-green-600">
                        ₹{collected.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold text-red-600">
                        ₹{pending.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-xs text-right text-gray-500 mt-1">
                      {percentage}% collected
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-3">
                    <div>
                      👨‍🎓 {classStudents.length}/{classItem.capacity}
                    </div>
                    <div>
                      💰 ₹{perStudentFee.toLocaleString()} / student
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition">
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // STUDENT FEES VIEW
  const classItem = classes.find(c => c._id === selectedClass);

  const enrichedStudentData = selectedClassData.map(student => {
    const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
    const studentFees = feesData[student._id] || {};

    const paid = studentFees.paidAmount || 0;
    const remaining = studentFees.remaining || (perStudentFee - paid);
    const status = studentFees.status || calculateFeeStatus(paid, perStudentFee, studentFees.dueDate || '2026-12-31');

    return {
      ...student,
      totalFees: perStudentFee,
      paid: paid,
      remaining: remaining,
      status: status,
      dueDate: studentFees.dueDate || '2026-12-31',
      feesRecordId: studentFees._id,
      paymentHistory: studentFees.paymentHistory || []
    };
  });

  const filteredData = enrichedStudentData.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalFees = enrichedStudentData.reduce((sum, s) => sum + s.totalFees, 0);
  const totalPaid = enrichedStudentData.reduce((sum, s) => sum + s.paid, 0);
  const totalPending = totalFees - totalPaid;

  // MODAL COMPONENT
  const StudentFeesModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

          {/* Modal Header */}
          <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-start sm:items-center gap-3 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">ID: {student.studentId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">

            {/* Student Info */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{student.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{student.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Class</p>
                  <p className="font-medium text-gray-900">{classItem?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className={`font-medium ${student.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {student.status.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Fees Breakdown */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Fees Breakdown</h3>
              <div className="space-y-2 text-xs sm:text-sm border-b border-gray-200 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuition Fee</span>
                  <span className="font-medium">Rs. {classItem?.fees.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admission Fee</span>
                  <span className="font-medium">Rs. {classItem?.fees.admission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam Fee</span>
                  <span className="font-medium">Rs. {classItem?.fees.exam.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Fee</span>
                  <span className="font-medium">Rs. {classItem?.fees.transport.toLocaleString()}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fees</span>
                  <span className="font-semibold text-gray-900">Rs. {student.totalFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Already Paid</span>
                  <span className="font-semibold text-green-600">Rs. {student.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-red-50 p-2 rounded">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span className="font-semibold text-red-600">Rs. {student.remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Sticky at Bottom */}
          {student.remaining > 0 && (
            <div className="border-t border-gray-200 bg-blue-50 p-4 sm:p-6 flex-shrink-0">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Record Payment</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Payment Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={student.remaining}
                    min="0"
                    step="0.01"
                    autoFocus
                    placeholder={`Enter amount (Max: Rs. ${student.remaining.toLocaleString()})`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition text-sm"
                >
                  {paymentLoading ? 'Processing...' : 'Record Payment'}
                </button>
              </form>
            </div>
          )}

          {student.remaining === 0 && (
            <div className="border-t border-gray-200 bg-green-50 p-4 sm:p-6 flex-shrink-0">
              <p className="text-xs sm:text-sm text-green-700 font-medium">✓ All fees paid</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => {
            setSelectedClass(null);
            setSearchTerm('');
            setFilterStatus('all');
          }}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-3 md:mb-4 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Classes
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Class {classItem?.name} - Fees</h1>
        <p className="text-xs sm:text-sm text-gray-600">{selectedClassData.length} students in this class</p>
      </div>

      {/* Summary Cards - Responsive */}
      {feesLoading ? (
        <SummaryCardsShimmer />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Fees</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">Rs. {totalFees.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">From this class</p>
          </div>

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Collected</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">Rs. {totalPaid.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Amount received</p>
          </div>

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">Rs. {totalPending.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
          </div>

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Collection Rate</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(1) : 0}%</p>
            <p className="text-gray-500 text-xs mt-2">Overall collection</p>
          </div>
        </div>
      )}

      {/* Search and Filter - Responsive */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filter Button - Mobile */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Filter Buttons - Desktop */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {['all', 'paid', 'partial', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-xs sm:text-sm ${filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Buttons */}
        {showFilters && (
          <div className="md:hidden flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-200">
            {['all', 'paid', 'partial', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setShowFilters(false);
                }}
                className={`px-3 py-2 rounded-lg font-medium transition text-xs ${filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Students Table - Mobile Card View + Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Mobile Card View */}
        {feesLoading ? (
          <StudentCardsShimmer />
        ) : (
          <div className="md:hidden space-y-3 p-3">
            {filteredData.length > 0 ? (
              filteredData.map((student) => (
                <div key={student._id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-600">{student.studentId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fees:</span>
                      <span className="font-semibold">Rs. {student.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-semibold text-green-600">Rs. {student.paid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold text-red-600">Rs. {student.remaining.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="w-full mt-3 bg-blue-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 text-sm">No students found</p>
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {feesLoading ? (
          <StudentTableShimmer />
        ) : (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-700">Paid</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-semibold text-gray-700">Remaining</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((student) => (
                    <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{student.studentId}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-right text-gray-900 font-medium">Rs. {student.totalFees.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-right text-green-600 font-medium">Rs. {student.paid.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-right text-gray-900 font-medium">Rs. {student.remaining.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {getStatusLabel(student.status)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">{new Date(student.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 text-sm">
                      No students found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 md:mt-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{enrichedStudentData.length}</span> students
        </p>
      </div>

      {/* Student Fees Modal */}
      <StudentFeesModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

export default Fees;