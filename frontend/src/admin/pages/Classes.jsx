import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  TableRowShimmer, 
  MobileCardShimmer, 
  ListHeaderShimmer 
} from "../components/Shimmer";
import { X, Filter, Plus } from "lucide-react";

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Section",
    accessor: "section",
    className: "hidden md:table-cell",
  },
  {
    header: "Academic Year",
    accessor: "academicYear",
    className: "hidden md:table-cell",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { token, axios } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    academicYear: "",
    classTeacher: "",
    capacity: 40,
    fees: {
      tuition: null,
      admission: null,
      exam: null,
      transport: null,
      currency: "INR",
    },
    status: "ACTIVE",
  });

  useEffect(() => {
    getAllClasses();
    getAllTeachers();
  }, []);

  const getAllClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/classes");
      if (response.status === 200) {
        setClasses(response.data.classes || response.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTeachers = async () => {
    try {
      const response = await axios.get("/admin/teachers");
      if (response.status === 200) {
        setTeachers(response.data.teachers || response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("fees.")) {
      const feeKey = name.split(".")[1];
      setFormData({
        ...formData,
        fees: {
          ...formData.fees,
          [feeKey]: isNaN(value) ? value : Number(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.academicYear || !formData.classTeacher) {
        alert("Please fill in all required fields");
        return;
      }

      setFormSubmitting(true);
      const response = await axios.post("/admin/class/create", formData, {
        headers: { token },
      });

      if (response.status === 201) {
        alert("Class created successfully!");
        setFormData({
          name: "",
          section: "",
          academicYear: "",
          classTeacher: "",
          capacity: 40,
          fees: {
            tuition: 0,
            admission: 0,
            exam: 0,
            transport: 0,
            currency: "INR",
          },
          status: "ACTIVE",
        });
        setIsModalOpen(false);
        await getAllClasses();
      }
    } catch (error) {
      console.error("Error creating class:", error);
      const errorMessage =
        error.response?.data?.message || "Error creating class";
      alert(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/class/${classId}`, {
        headers: { token },
      });
      if (response.status === 200) {
        alert("Class deleted successfully");
        await getAllClasses();
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete class";
      alert(errorMessage);
    }
  };

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-xs sm:text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">{item.name}</td>
      <td className="hidden md:table-cell p-3 sm:p-4">{item.section || "N/A"}</td>
      <td className="hidden md:table-cell p-3 sm:p-4">{item.academicYear}</td>
      <td className="hidden lg:table-cell p-3 sm:p-4">{item.capacity}</td>
      <td className="hidden lg:table-cell p-3 sm:p-4">
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs font-semibold ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {item.status}
        </span>
      </td>
      <td className="p-3 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to={`/admin/class/${item._id}`}>
            <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] cursor-pointer hover:bg-blue-200 transition">
              <img src="/view.png" alt="View" className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteClass(item._id)}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] cursor-pointer hover:bg-purple-300 transition"
          >
            <img src="/delete.png" alt="Delete" className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-md flex-1 m-2 sm:m-3 md:m-4 mt-0">
      {/* TOP */}
      {loading ? (
        <ListHeaderShimmer />
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">All Classes</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#CFCEFF] hover:bg-purple-300 transition"
              title="Create"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-100" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      {loading ? (
        <MobileCardShimmer cards={4} />
      ) : (
        <div className="md:hidden p-3 sm:p-4 space-y-3">
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <div key={classItem._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{classItem.name}</h3>
                    <p className="text-xs text-gray-600">{classItem.academicYear}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-semibold flex-shrink-0 ${classItem.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                      }`}
                  >
                    {classItem.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-600">Section</p>
                    <p className="font-medium text-gray-900">{classItem.section || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capacity</p>
                    <p className="font-medium text-gray-900">{classItem.capacity}</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Link to={`/admin/class/${classItem._id}`} className="flex-1">
                    <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium py-2 rounded transition">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClass(classItem._id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No classes found</p>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      {loading ? (
        <TableRowShimmer rows={5} columns={6} />
      ) : (
        <div className="hidden md:block mt-4 overflow-x-auto">
          <Table columns={columns} renderRow={renderRow} data={classes} />
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create a new class</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Class Information */}
              <div>
                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                  Class Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10-A"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2024-2025"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2 font-medium">
                      Class Teacher *
                    </label>
                    <select
                      name="classTeacher"
                      value={formData.classTeacher}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100 bg-white text-gray-800 hover:border-blue-400 transition-all appearance-none cursor-pointer font-medium"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233b82f6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundAttachment: 'scroll',
                        paddingRight: '2rem',
                      }}
                      required
                    >
                      <option value="" style={{ color: '#6b7280' }}>
                        Select a teacher
                      </option>
                      {teachers && teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <option
                            key={teacher._id}
                            value={teacher._id}
                            style={{ color: '#1f2937' }}
                          >
                            {teacher.name}
                          </option>
                        ))
                      ) : (
                        <option disabled style={{ color: '#9ca3af' }}>
                          No teachers available
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fees Information */}
              <div>
                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                  Fees Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Tuition Fee *
                    </label>
                    <input
                      type="number"
                      name="fees.tuition"
                      value={formData.fees.tuition}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Admission Fee
                    </label>
                    <input
                      type="number"
                      name="fees.admission"
                      value={formData.fees.admission}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Exam Fee
                    </label>
                    <input
                      type="number"
                      name="fees.exam"
                      value={formData.fees.exam}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Transport Fee
                    </label>
                    <input
                      type="number"
                      name="fees.transport"
                      value={formData.fees.transport}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Currency
                    </label>
                    <select
                      name="fees.currency"
                      value={formData.fees.currency}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base"
                >
                  {formSubmitting ? 'Creating...' : 'Create Class'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassListPage;