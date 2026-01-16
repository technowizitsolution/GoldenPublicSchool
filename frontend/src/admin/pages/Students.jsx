import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormModal from "../components/FormModal";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
//import TableSearch from "@/components/TableSearch";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

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
    const [students, setStudents] = useState([]);
    const {token } = useAuth();

    const [formData, setFormData] = useState({
        // Authentication
        username: "",
        email: "",
        password: "",
        // Personal Information
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        bloodType: "",
        birthday: "",
        sex: "Male",
        //photo: null,
        // Academic Information
        studentId: "",
        class: "",
        section: "",
        // Parent/Guardian Information
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

        console.log("Form submitted:", formData);

        try {
            // Validate required fields
            if (!formData.username || !formData.email || !formData.password ||
                !formData.firstName || !formData.lastName) {
                alert("Please fill in all required fields");
                return;
            }

            //Create FormData to handle file upload
            // const formDataToSend = new FormData();
            // formDataToSend.append("username", formData.username);
            // formDataToSend.append("email", formData.email);
            // formDataToSend.append("password", formData.password);
            // formDataToSend.append("firstName", formData.firstName);
            // formDataToSend.append("lastName", formData.lastName);
            // formDataToSend.append("phone", formData.phone);
            // formDataToSend.append("address", formData.address);
            // formDataToSend.append("bloodType", formData.bloodType);
            // formDataToSend.append("studentId", formData.studentId);
            // formDataToSend.append("birthday", formData.birthday);
            // formDataToSend.append("sex", formData.sex);
            // formDataToSend.append("class", formData.class);
            // formDataToSend.append("section", formData.section);
            // formDataToSend.append("parentName", formData.parentName);
            // formDataToSend.append("parentPhone", formData.parentPhone);
            // formDataToSend.append("parentEmail", formData.parentEmail);

            // Append photo if selected
            // if (formData.photo) {
            //     formDataToSend.append("photo", formData.photo);
            // }

            // Make API request
            const response = await axios.post("/admin/student/create", formData,{headers:{token}});

            if (response.status === 201) {
                alert("Student created successfully!");
                console.log("Student created:", response.data);

                // Reset form
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
                    //photo: null,
                });

                // Close modal
                setIsModalOpen(false);

                // Refresh students list
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


    useEffect(() => {
        getAllStudents();
    }, []);

    useEffect(() => {
        console.log("Students state changed:", students);
    }, [students]);

    const getAllStudents = async () => {
        try {
            const response = await axios.get('/admin/students');
            if (response.status === 200) {
                console.log("Fetched students:", response);
                setStudents(response.data.students);
            }

        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            const response = await axios.delete(`/admin/student/${studentId}`,{headers:{token}});
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

    const renderRow = (item) => (
        <tr
            key={item._id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <img
                    src={item.photo}
                    alt={item.username}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.username}</h3>
                    <p className="text-xs text-gray-500">{item.class}</p>
                </div>
            </td>

            <td className="hidden md:table-cell">{item.studentId}</td>
            <td className="hidden md:table-cell">{item.class}</td>
            <td className="hidden lg:table-cell">{item.phone}</td>
            <td className="hidden lg:table-cell">{item.address}</td>

            <td>
                <div className="flex items-center gap-2">
                    <Link to={`/list/students/${item._id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C3EBFA] cursor-pointer transition">
                            <img src="/view.png" alt="View" className="w-4 h-4" />
                        </button>
                    </Link>

                    <button
                        onClick={() => handleDeleteStudent(item._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CFCEFF] cursor-pointer transition"
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
                <h1 className="hidden md:block text-lg font-semibold">
                    All Students
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <img src="/filter.png" alt="Filter" className="w-4 h-4" />
                        </button>

                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <img src="/sort.png" alt="Sort" className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <img src="/create.png" alt="Sort" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE (IMPORTANT FIX) */}
            <div className="mt-4 overflow-x-auto">
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={students}
                />
            </div>

            {/* PAGINATION */}
            <Pagination />

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-none">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Create a new student</h2>
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
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
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

                                {/* Row 1 */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
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
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
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
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Blood Type
                                        </label>
                                        <input
                                            type="text"
                                            name="bloodType"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., A+, B-, O"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Birthday
                                        </label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            StudentId
                                        </label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Class
                                        </label>
                                        <input
                                            type="text"
                                            name="class"
                                            value={formData.class}
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

                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">Sex</label>
                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    {/*<div className="flex flex-col">

                                        <label className="flex items-center justify-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <span className="text-sm">Upload Photo</span>
                                            <input
                                                type="file"
                                                name="photo"
                                                onChange={handleChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>*/}
                                </div>
                            </div>



                            {/* Parent/Guardian Information */}
                            <div>
                                <label className="text-sm text-gray-600 font-semibold block mb-4">
                                    Parent/Guardian Information
                                </label>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Parent Name
                                        </label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Parent Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="parentPhone"
                                            value={formData.parentPhone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 block mb-2">
                                            Parent Email
                                        </label>
                                        <input
                                            type="email"
                                            name="parentEmail"
                                            value={formData.parentEmail}
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
                                Create
                            </button>
                        </form>
                    </div>
                </div>
                // <FormModal
                //     table="student"
                //     type="create"
                //     onClose={() => setIsModalOpen(false)}
                //     onSubmit={handleCreateStudent}
                // />
            )}

        </div>

    );
};

export default StudentListPage;
