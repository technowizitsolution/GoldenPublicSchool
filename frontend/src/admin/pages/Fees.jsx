import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Fees = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [Classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassData, setSelectedClassData] = useState([]);
  const [feesData, setFeesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // For modal
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { token ,axios } = useAuth();

  // Get all Students
  const getAllStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/students');
      if (response.status === 200) {
        console.log("Fetched students:", response.data);
        setStudents(response.data.students || response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all classes
  const getAllClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/classes");
      if (response.status === 200) {
        console.log("Fetched classes:", response.data);
        setClasses(response.data.classes || response.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get fees data for students
  const getFeesData = async () => {
    try {
      const response = await axios.get('/admin/student/feesRecords', { headers: { token } });
      console.log("Fetched fees data:", response.data);
      if (response.status === 200) {
        const feesMap = {};
        response.data.fees?.forEach(fee => {
          // Use student ID as key to match fees data
          feesMap[fee.student._id] = {
            _id: fee._id,
            totalFees: fee.totalFees,
            paidAmount: fee.paidAmount,  // Changed from 'paid' to 'paidAmount'
            remaining: fee.totalFees - fee.paidAmount,
            status: fee.status,  // Get status directly from backend
            dueDate: fee.dueDate,
            paymentHistory: fee.paymentHistory
          };
        });
        setFeesData(feesMap);
      }
    } catch (error) {
      console.warn("Fees data endpoint not available, using defaults:", error.message);
    }
  };

  useEffect(() => {
    getAllClasses();
    getAllStudents();
    getFeesData();
  }, []);

  // Filter students based on classId
  function filteredClassStudents(classId) {
    console.log("ClassId:", classId);
    const classStudents = students?.filter((student) => {
      return student?.class?._id === classId || student?.class === classId;
    });
    setSelectedClassData(classStudents);
    console.log("classStudents:", classStudents);
  }

  const getStatusColor = (status) => {
    switch (status) {
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

  // Calculate fee status based on payment
  const calculateFeeStatus = (paid, totalFees, dueDate) => {
    if (paid >= totalFees) return 'paid';
    if (new Date() > new Date(dueDate)) return 'overdue';
    return 'pending';
  };

  // Handle payment submission
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
        mode: 'cash', // You can make this a dropdown later
      }, { headers: { token } });

      if (response.status === 200 && response.data.success) {
        alert(`Payment of Rs. ${paymentAmount} recorded successfully!\nTransaction ID: ${response.data.data.transactionId}`);
        setPaymentAmount('');
        // Refresh fees data
        await getFeesData();
        // Close modal
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

    Classes.forEach((classItem) => {
      const classStudents = students.filter(s => s.class?._id === classItem._id || s.class === classItem._id);
      const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
      const classTotal = perStudentFee * classStudents.length;

      let classCollected = 0;
      classStudents.forEach(student => {
        const studentFees = feesData[student._id];
        if (studentFees) {
          classCollected += studentFees.paidAmount || 0;  // Changed from 'paid' to 'paidAmount'
        }
      });

      overallTotal += classTotal;
      overallCollected += classCollected;
    });

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
          <p className="text-gray-600">Select a class to view student fees</p>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Classes</p>
            <p className="text-3xl font-bold text-gray-900">{Classes.length}</p>
            <p className="text-gray-500 text-xs mt-2">In school</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Collected</p>
            <p className="text-3xl font-bold text-green-600">Rs. {overallCollected.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Overall fees collected</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-yellow-600">Rs. {(overallTotal - overallCollected).toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Classes.map((classItem) => {
            const classStudents = students.filter(s => s.class?._id === classItem._id || s.class === classItem._id);
            const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
            const total = perStudentFee * classStudents.length;

            let collected = 0;
            classStudents.forEach(student => {
              const studentFees = feesData[student._id];
              if (studentFees) {
                collected += studentFees.paidAmount || 0;  // Changed from 'paid'
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
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-blue-500"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Class {classItem.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Academic Year: {classItem.academicYear}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${classItem.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {classItem.status}
                  </span>
                </div>

                {/* FEES SUMMARY */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Collected</span>
                    <span className="font-semibold text-green-600">
                      ₹{collected.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
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
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    👨‍🎓 {classStudents.length}/{classItem.capacity}
                  </div>
                  <div>
                    💰 ₹{perStudentFee.toLocaleString()} / student
                  </div>
                </div>

                {/* CTA */}
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
  const classItem = Classes.find(c => c._id === selectedClass);

  // Calculate fee for each student
  const enrichedStudentData = selectedClassData.map(student => {
    const perStudentFee = classItem.fees.tuition + classItem.fees.admission + classItem.fees.exam + classItem.fees.transport;
    const studentFees = feesData[student._id] || {};

    // Use paidAmount from backend
    const paid = studentFees.paidAmount || 0;
    const remaining = studentFees.remaining || (perStudentFee - paid);

    // Use status from backend if available, otherwise calculate
    const status = studentFees.status || calculateFeeStatus(paid, perStudentFee, studentFees.dueDate || '2026-12-31');

    return {
      ...student,
      totalFees: perStudentFee,
      paid: paid,
      remaining: remaining,
      status: status,
      dueDate: studentFees.dueDate || '2026-12-31',
      feesRecordId: studentFees._id,  // Store fees record ID for reference
      paymentHistory: studentFees.paymentHistory || []
    };
  });

  // Filter based on search and status
  const filteredData = enrichedStudentData.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary totals
  const totalFees = enrichedStudentData.reduce((sum, s) => sum + s.totalFees, 0);
  const totalPaid = enrichedStudentData.reduce((sum, s) => sum + s.paid, 0);
  const totalPending = totalFees - totalPaid;

  // MODAL COMPONENT
  const StudentFeesModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-none flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

          {/* Modal Header */}
          <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-gray-600">ID: {student.studentId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">

            {/* Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Fees Breakdown</h3>
              <div className="space-y-2 text-sm border-b border-gray-200 pb-3 mb-3">
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
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Fees</span>
                  <span className="font-semibold text-lg text-gray-900">Rs. {student.totalFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid</span>
                  <span className="font-semibold text-green-600">Rs. {student.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm bg-red-50 p-2 rounded">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span className="font-semibold text-red-600">Rs. {student.remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-600">Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Sticky at Bottom */}
          {student.remaining > 0 && (
            <div className="border-t border-gray-200 bg-blue-50 p-6 flex-shrink-0">
              <h3 className="font-semibold text-gray-900 mb-3">Record Payment</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
                >
                  {paymentLoading ? 'Processing...' : 'Record Payment'}
                </button>
              </form>
            </div>
          )}

          {student.remaining === 0 && (
            <div className="border-t border-gray-200 bg-green-50 p-6 flex-shrink-0">
              <p className="text-sm text-green-700 font-medium">✓ All fees paid</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class {classItem?.name} - Fees Management</h1>
        <p className="text-gray-600">{selectedClassData.length} students in this class</p>
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
          <p className="text-gray-500 text-xs mt-2">Amount received</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">Rs. {totalPending.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-2">Awaiting payment</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium mb-2">Collection Rate</p>
          <p className="text-3xl font-bold text-red-600">{totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(1) : 0}%</p>
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
              placeholder="Search by student name or ID..."
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
                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === status
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
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
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.studentId}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">Rs. {student.totalFees.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">Rs. {student.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">Rs. {student.remaining.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(student.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition"
                      >
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