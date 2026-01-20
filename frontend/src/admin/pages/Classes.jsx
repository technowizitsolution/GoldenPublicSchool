import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



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
  const { token,axios } = useAuth();

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
      const response = await axios.get("/admin/classes");
      if (response.status === 200) {
        console.log("Fetched classes:", response.data);
        setClasses(response.data.classes || response.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const getAllTeachers = async () => {
    try {
      const response = await axios.get("/admin/teachers",);
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
        getAllClasses();
      }
    } catch (error) {
      console.error("Error creating class:", error);
      const errorMessage =
        error.response?.data?.message || "Error creating class";
      alert(errorMessage);
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
        getAllClasses();
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
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.section || "N/A"}</td>
      <td className="hidden md:table-cell">{item.academicYear}</td>
      <td className="hidden lg:table-cell">{item.capacity}</td>
      <td className="hidden lg:table-cell">
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${item.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {item.status}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link to={`/admin/class/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] cursor-pointer transition">
              <img src="/view.png" alt="View" className="w-4 h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteClass(item._id)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] cursor-pointer transition "
          >
            <img src="/delete.png" alt="Delete" className="w-4 h-4" />
          </button>

        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src="/filter.png" alt="Filter" className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src="/sort.png" alt="Sort" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
            >
              <img src="/create.png" alt="Create" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-4 overflow-x-auto">
        <Table columns={columns} renderRow={renderRow} data={classes} />
      </div>

      {/* PAGINATION */}
      <Pagination />

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-none">
          <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create a new class</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class Information */}
              <div>
                <label className="text-sm text-gray-600 font-semibold block mb-4">
                  Class Information
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10-A"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2024-2025"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 block mb-2 font-medium">
                      Class Teacher *
                    </label>
                    <select
                      name="classTeacher"
                      value={formData.classTeacher}
                      onChange={handleChange}
          
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100 bg-white text-gray-800 hover:border-blue-400 transition-all appearance-none overflow-y-auto cursor-pointer font-medium"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233b82f6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundAttachment: 'scroll',
                        paddingRight: '2.5rem',
                        color: '#1f2937',
                      }}
                      required
                    >
                      <option value="" style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>
                        Select a teacher
                      </option>
                      {console.log("Teachers : ", teachers)};
                      {teachers && teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <option
                            key={teacher._id}
                            value={teacher._id}
                            style={{
                              color: '#1f2937',
                              backgroundColor: '#ffffff',
                              padding: '8px 4px',
                            }}
                          >
                            {teacher.name}
                          </option>
                        ))
                      ) : (
                        <option disabled style={{ color: '#9ca3af', backgroundColor: '#f3f4f6' }}>
                          No teachers available
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fees Information */}
              <div>
                <label className="text-sm text-gray-600 font-semibold block mb-4">
                  Fees Information
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Tuition Fee *
                    </label>
                    <input
                      type="number"
                      name="fees.tuition"
                      value={formData.fees.tuition}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Admission Fee
                    </label>
                    <input
                      type="number"
                      name="fees.admission"
                      value={formData.fees.admission}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Exam Fee
                    </label>
                    <input
                      type="number"
                      name="fees.exam"
                      value={formData.fees.exam}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Transport Fee
                    </label>
                    <input
                      type="number"
                      name="fees.transport"
                      value={formData.fees.transport}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-700 block mb-2">
                      Currency
                    </label>
                    <select
                      name="fees.currency"
                      value={formData.fees.currency}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Create Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassListPage;