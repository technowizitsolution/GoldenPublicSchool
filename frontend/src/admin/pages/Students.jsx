import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { useAuth } from "../../context/authContext/AuthContext";
import { X, Filter, Plus } from "lucide-react";
import {TableRowShimmer,MobileCardShimmer} from '../components/Shimmer';
import { useAdmin } from "../../context/adminContext/AdminContext";

const columns = [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Student ID",
        accessor: "studentId",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
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
    {
        header: "Actions",
        accessor: "action",
    },
];

const StudentListPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const {students ,studentsLoading,classes} = useAdmin();
    const { token, axios } = useAuth();


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        bloodType: "",
        birthday: "",
        sex: "Male",
        photo: null,
        studentId: "",
        class: "",
        section: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
    });

    const handleChange = (e) => {
        const { name, value, type: inputType } = e.target;

        if (inputType === "file") {
            setFormData({
                ...formData,
                [name]: e.target.files[0],
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
            if (!formData.username || !formData.email || !formData.password ||
                !formData.firstName || !formData.lastName) {
                alert("Please fill in all required fields");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("bloodType", formData.bloodType);
            formDataToSend.append("studentId", formData.studentId);
            formDataToSend.append("birthday", formData.birthday);
            formDataToSend.append("sex", formData.sex);
            formDataToSend.append("class", formData.class);
            formDataToSend.append("section", formData.section);
            formDataToSend.append("parentName", formData.parentName);
            formDataToSend.append("parentPhone", formData.parentPhone);
            formDataToSend.append("parentEmail", formData.parentEmail);

            if (formData.photo) {
                formDataToSend.append("avatar", formData.photo);
            }

            const response = await axios.post("/admin/student/create", formDataToSend, { headers: { token } });

            if (response.status === 201) {
                alert("Student created successfully!");

                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    phone: "",
                    address: "",
                    bloodType: "",
                    studentId: "",
                    birthday: "",
                    sex: "Male",
                    photo: null,
                });

                setIsModalOpen(false);
                getAllStudents();
            }
        } catch (error) {
            console.error("Error creating student:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error creating student";
            alert(errorMessage);
        }
    };


    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            const response = await axios.delete(`/admin/student/${studentId}`, { headers: { token } });
            if (response.status === 200) {
                alert("Student deleted successfully");
                getAllStudents();
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete student";
            alert(errorMessage);
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter((student) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.username.toLowerCase().includes(searchLower) ||
            (student.studentId && student.studentId.toLowerCase().includes(searchLower))
        );
    });

    const renderRow = (item) => (
        <tr
            key={item._id}
            className="border-b border-gray-200 even:bg-slate-50 text-xs sm:text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 md:p-4">
                <img
                    src={item.photo ? item.photo : '/avatar.png'}
                    alt={item.username}
                    className="hidden md:block xl:block w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-xs sm:text-sm">{item.username}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.class?.name}</p>
                </div>
            </td>

            <td className="hidden md:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.studentId}</td>
            <td className="hidden md:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.class?.name}</td>
            <td className="hidden lg:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.phone}</td>
            <td className="hidden lg:table-cell p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{item.address}</td>

            <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                    <Link to={`/admin/student/${item._id}`}>
                        <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] hover:bg-blue-200 cursor-pointer transition">
                            <img src="/view.png" alt="View" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </Link>

                    <button
                        onClick={() => handleDeleteStudent(item._id)}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                    All Students
                </h1>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#CFCEFF] hover:bg-purple-300 cursor-pointer transition"
                    >
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-100" />
                    </button>

                    <button onClick={() => setIsModalOpen(true)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#CFCEFF] hover:bg-purple-300 cursor-pointer transition">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-100" />
                    </button>
                </div>
            </div>

            {/* FILTER SECTION */}
            {isFilterOpen && (
                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="text"
                            placeholder="Search by username or student ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#CFCEFF] focus:border-transparent"
                            autoFocus
                        />
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setIsFilterOpen(false);
                            }}
                            className="px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg text-xs sm:text-sm font-medium transition"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Card View */}
            {
             studentsLoading ? <MobileCardShimmer cards={4} /> 
              :(<div className="md:hidden p-2 sm:p-3 space-y-3">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                            <div className="flex gap-3 mb-3">
                                <img
                                    src={student.photo || '/avatar.png'}
                                    alt={student.username}
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm">{student.username}</h3>
                                    <p className="text-xs text-gray-600">{student.class?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div>
                                    <p className="text-gray-600">Student ID</p>
                                    <p className="font-medium text-gray-900">{student.studentId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-medium text-gray-900">{student.phone || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link to={`/admin/student/${student._id}`} className="flex-1">
                                    <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium py-2 rounded transition">
                                        View
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium py-2 rounded transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8 text-sm">
                        {searchTerm ? "No students found matching your search" : "No students found"}
                    </p>
                )}
              </div>)
            }

            {/* Desktop Table View */}
            {studentsLoading ? <TableRowShimmer rows={5} columns={6} /> :(
            <div className="hidden md:block">
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={filteredStudents}
                />
            </div>)}

            

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-3 sm:p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Create a new student</h2>
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
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
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
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
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
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
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
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Blood Type
                                        </label>
                                        <input
                                            type="text"
                                            name="bloodType"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., A+, B-"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Birthday
                                        </label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">Sex</label>
                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">Photo</label>
                                        <label className="flex items-center justify-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600 border-2 border-dashed border-blue-300 rounded-lg p-2 sm:p-3">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-xs sm:text-sm">Upload</span>
                                            <input
                                                type="file"
                                                name="photo"
                                                onChange={handleChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {formData.photo && (
                                    <div className="mt-3 sm:mt-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={URL.createObjectURL(formData.photo)}
                                                alt="Preview"
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-300"
                                            />
                                            <div className="flex flex-col gap-1 sm:gap-2">
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{formData.photo.name}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, photo: null })}
                                                    className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Academic Information */}
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                                    Academic Information
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Student ID
                                        </label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2 font-medium">
                                            Class *
                                        </label>
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select a class</option>
                                            {classes && classes.length > 0 ? (
                                                classes.map((cls) => (
                                                    <option key={cls._id} value={cls._id}>
                                                        {cls.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No Classes available</option>
                                            )}
                                        </select>
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
                                </div>
                            </div>

                            {/* Parent/Guardian Information */}
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600 font-semibold block mb-3 sm:mb-4">
                                    Parent/Guardian Information
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Parent Name
                                        </label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Parent Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="parentPhone"
                                            value={formData.parentPhone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs sm:text-sm text-gray-700 block mb-2">
                                            Parent Email
                                        </label>
                                        <input
                                            type="email"
                                            name="parentEmail"
                                            value={formData.parentEmail}
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
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base"
                                >
                                    Create Student
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

export default StudentListPage;