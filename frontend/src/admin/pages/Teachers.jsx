import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useAuth } from "../../context/authContext/AuthContext";
import {useAdmin} from "../../context/adminContext/AdminContext";
import { 
  TableRowShimmer, 
  MobileCardShimmer, 
  ListHeaderShimmer 
} from "../components/Shimmer";
import { X, Filter, Plus } from "lucide-react";

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Employee ID",
    accessor: "employeeId",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  { header: "Actions", accessor: "action" },
];

const TeacherListPage = () => {
  const {teachers , teachersLoading , fetchTeachers} = useAdmin();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { token, axios } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    dob: "",
    address: "",
    employeeId: "",
    qualification: "",
    experienceYears: "",
    joiningDate: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.name || !formData.email || !formData.password) {
        alert("Please fill in all required fields");
        return;
      }

      setFormSubmitting(true);
      const response = await axios.post("/admin/teacher/create", formData, { headers: { token } });

      if (response.status === 201) {
        alert("Teacher created successfully!");

        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          gender: "Male",
          dob: "",
          address: "",
          employeeId: "",
          qualification: "",
          experienceYears: "",
          joiningDate: "",
        });

        setIsModalOpen(false);
        await fetchTeachers();
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      const errorMessage = error.response?.data?.message || "Error creating teacher";
      alert(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/teacher/${teacherId}`, { headers: { token } });
      if (response.status === 200) {
        alert("Teacher deleted successfully");
        await getAllTeachers();
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete teacher";
      alert(errorMessage);
    }
  };

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-xs sm:text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 md:p-4">
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-xs text-gray-500 truncate">{item.email}</p>
        </div>
      </td>

      <td className="hidden md:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.employeeId}</td>
      <td className="hidden lg:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.phone}</td>
      <td className="hidden lg:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.address}</td>

      <td className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to={`/admin/teacher/${item._id}`}>
            <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] hover:bg-blue-200 cursor-pointer transition">
              <img src="/view.png" alt="View" className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteTeacher(item._id)}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] hover:bg-purple-300 cursor-pointer transition"
          >
            <img src="/delete.png" alt="Delete" className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg m-2 sm:m-3 md:m-4">
      {/* TOP */}
      {teachersLoading ? (
        <ListHeaderShimmer />
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">All Teachers</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#CFCEFF] hover:bg-purple-300 transition"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-100" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      {teachersLoading ? (
        <MobileCardShimmer cards={4} />
      ) : (
        <div className="md:hidden p-2 sm:p-3 space-y-3">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{teacher.name}</h3>
                    <p className="text-xs text-gray-600 break-all">{teacher.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{teacher.employeeId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{teacher.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Link to={`/admin/teacher/${teacher._id}`} className="flex-1">
                    <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium py-2 rounded transition">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteTeacher(teacher._id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8 text-sm">No teachers found</p>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      {teachersLoading ? (
        <TableRowShimmer rows={5} columns={5} />
      ) : (
        <div className="hidden md:block">
          <Table columns={columns} renderRow={renderRow} data={teachers} />
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Create a new teacher</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Authentication Information */}
              <div>
                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                  Authentication Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                  Personal Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Teacher-Specific Information */}
              <div>
                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                  Teacher Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., B.A., M.Sc."
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                  {formSubmitting ? 'Creating...' : 'Create Teacher'}
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

export default TeacherListPage;