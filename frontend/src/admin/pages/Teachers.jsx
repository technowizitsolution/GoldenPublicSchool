import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { useAuth } from "../../context/AuthContext";


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
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {token , axios} = useAuth();
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

  useEffect(() => {
    getAllTeachers();
  }, []);

  const getAllTeachers = async () => {
    try {
      const response = await axios.get("/admin/teachers");
      if (response.status === 200) {
        console.log("Fetched teachers:", response.data);
        setTeachers(response.data.teachers || response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers");
    }
  };

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
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        alert("Please fill in all required fields");
        return;
      }

      const response = await axios.post("/admin/teacher/create", formData,{headers:{token}});

      if (response.status === 201) {
        alert("Teacher created successfully!");
        console.log("Teacher created:", response.data);

        // Reset form
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
        getAllTeachers();
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      const errorMessage =
        error.response?.data?.message || "Error creating teacher";
      alert(errorMessage);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/teacher/${teacherId}`,{headers:{token}});
      if (response.status === 200) {
        alert("Teacher deleted successfully");
        getAllTeachers();
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete teacher";
      alert(errorMessage);
    }
  };

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.employeeId}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link to={`/admin/teacher/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] cursor-pointer transition">
              <img src="/view.png" alt="View" className="w-4 h-4" />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteTeacher(item._id)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] cursor-pointer transition "
          >
            <img src="/delete.png" alt="Delete" className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md m-4">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>

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
        <Table columns={columns} renderRow={renderRow} data={teachers} />
      </div>

      {/* PAGINATION */}
      <Pagination />

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-none">
          <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create a new teacher</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Authentication Information */}
              <div>
                <label className="text-sm text-gray-600 font-semibold block mb-4">
                  Authentication Information
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <label className="text-sm text-gray-600 font-semibold block mb-4">
                  Personal Information
                </label>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Teacher-Specific Information */}
              <div>
                <label className="text-sm text-gray-600 font-semibold block mb-4">
                  Teacher Information
                </label>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., B.A., M.Sc."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Create Teacher
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherListPage;