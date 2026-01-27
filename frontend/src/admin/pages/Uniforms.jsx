// frontend/src/admin/pages/Uniforms.jsx
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, AlertCircle, Loader, Filter, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ClassCardShimmer,
} from '../components/ShimmerLoader';

const Uniforms = () => {
  const { token, axios } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // State management
  const [classes, setClasses] = useState([]);
  const [uniformItems, setUniformItems] = useState([]);
  const [studentUniforms, setStudentUniforms] = useState([]);
  const [classStats, setClassStats] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [uniformsLoading, setUniformsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);

  // Form states
  const [issueFormData, setIssueFormData] = useState({
    uniforms: [{ itemName: '', size: '', quantity: 1 }]
  });
  const [conditionFormData, setConditionFormData] = useState({
    itemName: '',
    condition: 'good'
  });

  // ============ API CALLS ============

  const getAllClasses = async () => {
    try {
      setClassesLoading(true);
      const response = await axios.get('/admin/classes', {
        headers: { token }
      });
      setClasses(response.data.classes || response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Failed to load classes');
      setClasses([]); 
    } finally {
      setClassesLoading(false);
    }
  };

  const getAllUniformItems = async () => {
    try {
      setItemsLoading(true);
      const response = await axios.get('/admin/uniforms/items', {
        headers: { token }
      });
      setUniformItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching uniform items:', error);
      alert('Failed to load uniform items');
    } finally {
      setItemsLoading(false);
    }
  };

  const getStudentUniformsByClass = async (classId) => {
    try {
      setUniformsLoading(true);
      const response = await axios.get(`/admin/uniforms/class/${classId}`, {
        headers: { token }
      });
      console.log('Student Uniforms Response:', response.data);
      setStudentUniforms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching student uniforms:', error);
      alert('Failed to load student uniforms');
      setStudentUniforms([]);
    } finally {
      setUniformsLoading(false);
    }
  };

  const getClassUniformStats = async (classId) => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`/admin/uniforms/stats/class/${classId}`, {
        headers: { token }
      });
      console.log('Class Stats Response:', response.data);
      setClassStats(response.data.data || null);
    } catch (error) {
      console.error('Error fetching class stats:', error);
      alert('Failed to load class statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const getAllClassesWithUniformSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/uniforms/stats/all-classes', {
        headers: { token }
      });
      console.log('All Classes Uniform Summary Response:', response.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Failed to load classes');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueUniform = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    console.log('selected Student : ', selectedStudent);

    const validUniforms = issueFormData.uniforms.filter(
      u => u.itemName && u.size && u.quantity > 0
    );

    if (validUniforms.length === 0) {
      alert('Please add at least one uniform item');
      return;
    }

    try {
      setIssueLoading(true);
      const classData = classes.find(c => c.name === selectedClass);
      const classId = classData?._id;

      if (!classId) {
        alert('Class ID not found');
        return;
      }

      const response = await axios.post(
        '/admin/uniforms/issue',
        {
          studentId: selectedStudent.student?._id,
          classId: classId,
          uniforms: validUniforms
        },
        {
          headers: { token }
        }
      );

      alert('Uniforms issued successfully');
      setShowIssueModal(false);
      setSelectedStudent(null);
      setIssueFormData({ uniforms: [{ itemName: '', size: '', quantity: 1 }] });

      if (classId) {
        getStudentUniformsByClass(classId);
        getClassUniformStats(classId);
      }
    } catch (error) {
      console.error('Error issuing uniforms:', error);
      alert(error.response?.data?.message || 'Failed to issue uniforms');
    } finally {
      setIssueLoading(false);
    }
  };

  const handleUpdateCondition = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    try {
      setIssueLoading(true);
      await axios.put(
        '/admin/uniforms/condition',
        {
          studentId: selectedStudent._id || selectedStudent.student?._id,
          itemName: conditionFormData.itemName,
          condition: conditionFormData.condition
        },
        {
          headers: { token }
        }
      );

      alert('Uniform condition updated successfully');
      setShowConditionModal(false);
      setSelectedStudent(null);
      setConditionFormData({ itemName: '', condition: 'good' });

      const classData = classes.find(c => c.name === selectedClass);
      if (classData?._id) {
        getStudentUniformsByClass(classData._id);
      }
    } catch (error) {
      console.error('Error updating condition:', error);
      alert(error.response?.data?.message || 'Failed to update condition');
    } finally {
      setIssueLoading(false);
    }
  };

  // ============ LIFECYCLE ============

  useEffect(() => {
    if (token) {
      getAllClasses();
      getAllClassesWithUniformSummary();
      getAllUniformItems();
    }
  }, [token]);

  useEffect(() => {
    if (selectedClass && classes.length > 0) {
      const classData = classes.find(c => c.name === selectedClass);
      if (classData?._id) {
        getStudentUniformsByClass(classData._id);
        getClassUniformStats(classData._id);
      }
    }
  }, [selectedClass, classes]);

  // ============ HELPER FUNCTIONS ============

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
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

  // ============ CLASS VIEW ============

  if (!selectedClass) {
    // Calculate overall statistics
    let totalStudents = 0;
    let totalIssued = 0;
    let totalPending = 0;



    // Ensure classes is an array
    if (Array.isArray(classes) && classes.length > 0) {
      classes.forEach((classItem) => {
        const classStudentCount = Number(classItem.students) || 0;
        const classIssuedCount = Number(classItem.uniformsIssued) || 0;
        const classPendingCount = Number(classItem.uniformsPending) || 0;

        totalStudents += classStudentCount;
        totalIssued += classIssuedCount;
        totalPending += classPendingCount;
      });
    }

    const issuedPercentage = totalStudents > 0 ? ((totalIssued / totalStudents) * 100).toFixed(1) : 0;

    if (classesLoading || itemsLoading || loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    return (
      <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Uniform Management</h1>
          <p className="text-xs sm:text-sm text-gray-600">Track and manage student uniforms by class</p>
        </div>

        {/* Overall Summary - Responsive */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Students</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalStudents}</p>
            <p className="text-gray-500 text-xs mt-2">Across all classes</p>
          </div>

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Uniforms Issued</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{totalIssued}</p>
            <p className="text-gray-500 text-xs mt-2">{issuedPercentage}% distributed</p>
          </div>

          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 sm:col-span-2 lg:col-span-1">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{totalPending}</p>
            <p className="text-gray-500 text-xs mt-2">Awaiting distribution</p>
          </div>
        </div>

        {/* Inventory Overview - Responsive */}
        <div className="mb-6 md:mb-8">

          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Uniform Items Inventory
            </h2>

            <button
              onClick={() => navigate("/admin/uniforms/inventory")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 
               bg-blue-600 text-white rounded-md 
               hover:bg-blue-700 transition 
               text-[11px] sm:text-xs font-medium"
            >
              Manage
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>


          {itemsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-3"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {uniformItems.map((item) => {
                const available = item.totalStock - item.issued - item.damaged;
                const issuedPercentage =
                  item.totalStock > 0
                    ? ((item.issued / item.totalStock) * 100).toFixed(1)
                    : 0;

                return (
                  <div
                    key={item._id}
                    className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          Total: {item.totalStock}
                        </p>
                      </div>
                      {available < 10 && available > 0 && (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${issuedPercentage}%` }}
                        />
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
          )}

        </div>

        {/* Classes Grid - Responsive */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Uniforms by Class</h2>

          {loading ? (
            <ClassCardShimmer />
          ) : !Array.isArray(classes) || classes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <p className="text-gray-500 text-sm sm:text-base md:text-lg">
                No classes found. Please ensure classes are created in the system.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {classes.map((classItem) => {
                const students = classItem.students || 0;
                const issued = classItem.uniformsIssued || 0;
                const issuedPercentage = students > 0 ? ((issued / students) * 100).toFixed(1) : 0;

                return (
                  <div
                    key={classItem._id}
                    onClick={() => setSelectedClass(classItem.name)}
                    className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-blue-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{classItem.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{students} Students</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{issuedPercentage}%</div>
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
                        <p className="font-bold text-green-600 text-sm sm:text-base">{issued}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs mb-1">Pending</p>
                        <p className="font-bold text-yellow-600 text-sm sm:text-base">{(students - issued) || 0}</p>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition text-xs sm:text-sm">
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ STUDENT UNIFORMS VIEW ============

  const currentClass = classes.find(c => c.name === selectedClass);
  const filteredData = studentUniforms.filter(student => {
    const studentName = `${student.student?.firstName || ''} ${student.student?.lastName || ''}`.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
      (student.student?.studentId || '').includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  console.log(" Students in Selected Class : ", studentUniforms);

  const classUniformsIssued = studentUniforms.filter(s => s.status === 'issued').length;
  const classUniformsPending = studentUniforms.filter(s => s.status === 'pending').length;
  //const classUniformsPartial = studentUniforms.filter(s => s.status === 'partial').length;

  if (uniformsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ============ STUDENT DETAILS MODAL ============
  const StudentUniformModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

          {/* Modal Header */}
          <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-start sm:items-center gap-3 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {student.student?.firstName} {student.student?.lastName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">ID: {student.student?.studentId}</p>
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

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Uniform Status:</span>
              <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                {getStatusLabel(student.status)}
              </span>
            </div>

            {/* Uniform Items */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Issued Uniforms</h3>
              {student.uniforms && student.uniforms.length > 0 ? (
                <div className="space-y-3">
                  {student.uniforms.map((uniform, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{uniform.itemName}</p>
                          <p className="text-xs text-gray-600">Size: {uniform.size}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(uniform.condition)}`}>
                          {uniform.condition}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-semibold">{uniform.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Issue Date</p>
                          <p className="font-semibold">{new Date(uniform.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No uniforms issued yet</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSelectedStudent(student);
                  setShowIssueModal(true);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
              >
                {student.status === 'pending' ? 'Issue Uniforms' : 'Issue More'}
              </button>
              {student.uniforms && student.uniforms.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowConditionModal(true);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition text-sm"
                >
                  Update Condition
                </button>
              )}
            </div>
          </div>
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
            setClassStats(null);
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-3 md:mb-4 font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Classes
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Class {selectedClass} - Uniform Distribution
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">{studentUniforms.length} students in this class</p>
      </div>

      {/* Summary Cards - Responsive */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Students</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{classStats?.totalStudents || studentUniforms.length}</p>
          <p className="text-gray-500 text-xs mt-2">In this class</p>
        </div>

        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Issued</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{classUniformsIssued}</p>
          <p className="text-gray-500 text-xs mt-2">
            {studentUniforms.length > 0
              ? ((classUniformsIssued / studentUniforms.length) * 100).toFixed(1)
              : 0}% complete
          </p>
        </div>



        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Pending</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{classUniformsPending}</p>
          <p className="text-gray-500 text-xs mt-2">Awaiting distribution</p>
        </div>
      </div>

      {/* Search and Filter - Responsive */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 sm:top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
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
            {['all', 'issued', 'pending', 'partial'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition text-xs sm:text-sm ${filterStatus === status
                  ? 'bg-blue-600 text-white'
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
            {['all', 'issued', 'pending', 'partial'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setShowFilters(false);
                }}
                className={`px-3 py-2 rounded-lg font-medium transition text-xs ${filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Student Uniforms - Mobile Card View + Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 p-3">
          {filteredData.length > 0 ? (
            filteredData.map((student) => (
              <div key={student._id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {student.student?.firstName} {student.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{student.student?.studentId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusLabel(student.status)}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uniforms:</span>
                    <span className="font-semibold">{student.uniforms?.length || 0} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold">
                      {student.uniforms?.[0]?.issueDate
                        ? new Date(student.uniforms[0].issueDate).toLocaleDateString()
                        : '—'}
                    </span>
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

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Student ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Uniforms Count</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((student) => (
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-gray-900">
                      {student.student?.firstName} {student.student?.lastName}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">
                      {student.student?.studentId}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">
                      {student.uniforms?.length || 0} items
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600">
                      {student.uniforms?.[0]?.issueDate
                        ? new Date(student.uniforms[0].issueDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowIssueModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 font-medium transition"
                      >
                        Issue
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 md:mt-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredData.length}</span> of{' '}
          <span className="font-semibold">{studentUniforms.length}</span> students
        </p>
      </div>

      {/* Student Details Modal */}
      <StudentUniformModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* ============ ISSUE UNIFORM MODAL ============ */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Issue Uniforms</h2>
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  setSelectedStudent(null);
                  setIssueFormData({ uniforms: [{ itemName: '', size: '', quantity: 1 }] });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleIssueUniform} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {/* Student Info */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Student:</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedStudent?.student?.firstName} {selectedStudent?.student?.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">ID: {selectedStudent?.student?.studentId}</p>
              </div>

              {/* Uniform Items */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Add Uniforms</h3>
                <div className="space-y-3 sm:space-y-4">
                  {issueFormData.uniforms.map((uniform, index) => (
                    <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Item Name */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Uniform Item
                          </label>
                          <select
                            value={uniform.itemName}
                            onChange={(e) => {
                              const newUniforms = [...issueFormData.uniforms];
                              newUniforms[index].itemName = e.target.value;
                              setIssueFormData({ uniforms: newUniforms });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Select Item</option>
                            {uniformItems.map(item => (
                              <option key={item._id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Size */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Size
                          </label>
                          <select
                            value={uniform.size}
                            onChange={(e) => {
                              const newUniforms = [...issueFormData.uniforms];
                              newUniforms[index].size = e.target.value;
                              setIssueFormData({ uniforms: newUniforms });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Select Size</option>
                            {uniform.itemName && uniformItems
                              .find(item => item.name === uniform.itemName)
                              ?.sizes.map((sizeObj, idx) => (
                                <option key={idx} value={sizeObj.size}>
                                  {sizeObj.size} ({sizeObj.stock} available)
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={uniform.quantity}
                            onChange={(e) => {
                              const newUniforms = [...issueFormData.uniforms];
                              newUniforms[index].quantity = parseInt(e.target.value) || 1;
                              setIssueFormData({ uniforms: newUniforms });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      {issueFormData.uniforms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newUniforms = issueFormData.uniforms.filter((_, i) => i !== index);
                            setIssueFormData({ uniforms: newUniforms });
                          }}
                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                        >
                          Remove This Item
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add More Button */}
                <button
                  type="button"
                  onClick={() => {
                    const newUniforms = [
                      ...issueFormData.uniforms,
                      { itemName: '', size: '', quantity: 1 }
                    ];
                    setIssueFormData({ uniforms: newUniforms });
                  }}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  + Add Another Item
                </button>
              </div>
            </form>

            {/* Submit and Cancel */}
            <div className="flex gap-3 justify-end p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowIssueModal(false);
                  setSelectedStudent(null);
                  setIssueFormData({ uniforms: [{ itemName: '', size: '', quantity: 1 }] });
                }}
                className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueUniform}
                disabled={issueLoading}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 text-sm"
              >
                {issueLoading ? 'Issuing...' : 'Issue Uniforms'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ UPDATE CONDITION MODAL ============ */}
      {showConditionModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Update Condition</h2>
              <button
                onClick={() => {
                  setShowConditionModal(false);
                  setSelectedStudent(null);
                  setConditionFormData({ itemName: '', condition: 'good' });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateCondition} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Student Info */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Student:</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedStudent?.student?.firstName} {selectedStudent?.student?.lastName}
                </p>
              </div>

              {/* Uniform Item Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Select Uniform Item
                </label>
                <select
                  value={conditionFormData.itemName}
                  onChange={(e) =>
                    setConditionFormData({ ...conditionFormData, itemName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Choose Item</option>
                  {selectedStudent?.uniforms.map((uniform, idx) => (
                    <option key={idx} value={uniform.itemName}>
                      {uniform.itemName} - Size {uniform.size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={conditionFormData.condition}
                  onChange={(e) =>
                    setConditionFormData({ ...conditionFormData, condition: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="good">Good</option>
                  <option value="worn">Worn</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              {/* Submit and Cancel */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowConditionModal(false);
                    setSelectedStudent(null);
                    setConditionFormData({ itemName: '', condition: 'good' });
                  }}
                  className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issueLoading}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 text-sm"
                >
                  {issueLoading ? 'Updating...' : 'Update Condition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uniforms;