import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentProfile = () => {
    const {token,axios} = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const fetchStudentDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/admin/student/${id}`,{headers:{token}});
            console.log("Students",response);
            setStudent(response.data.student);
            setError(null);
        } catch (err) {
            console.error("Error fetching student:", err);
            setError(err.response?.data?.message || "Failed to fetch student details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-md m-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Student Profile</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="bg-white p-6 rounded-md m-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Student Profile</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
                <div className="text-center text-gray-500">No student found</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-md m-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Student Profile</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    Back
                </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-6 pb-8 border-b border-gray-200">
                <div>
                    <img
                        src={student.profileImage || '/avatar.png'}
                        alt={student.username}
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                        {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-gray-600 mb-4">{student.email}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-semibold">{student.username}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Student ID</p>
                            <p className="font-semibold">{student.studentId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Class</p>
                            <p className="font-semibold">{student.class.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Section</p>
                            <p className="font-semibold">{student.section || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="mt-8 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Personal Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">First Name</p>
                        <p className="font-semibold text-lg">{student.firstName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Last Name</p>
                        <p className="font-semibold text-lg">{student.lastName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-semibold text-lg">{student.phone || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Gender</p>
                        <p className="font-semibold text-lg">{student.sex}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Blood Type</p>
                        <p className="font-semibold text-lg">{student.bloodType || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                        <p className="font-semibold text-lg">
                            {student.birthday ? new Date(student.birthday).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-semibold text-lg">{student.address || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Academic Information */}
            <div className="mt-8 mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Academic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Student ID</p>
                        <p className="font-semibold text-lg text-blue-600">{student.studentId}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Class</p>
                        <p className="font-semibold text-lg text-blue-600">{student.class.name}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Section</p>
                        <p className="font-semibold text-lg text-blue-600">{student.section || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Parent/Guardian Information */}
            {(student.parentName || student.parentPhone || student.parentEmail) && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Parent Name</p>
                            <p className="font-semibold text-lg">{student.parentName || "N/A"}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Parent Phone</p>
                            <p className="font-semibold text-lg">{student.parentPhone || "N/A"}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Parent Email</p>
                            <p className="font-semibold text-lg text-sm break-all">{student.parentEmail || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Account Information</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Username</p>
                        <p className="font-semibold text-lg">{student.username}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-semibold text-lg break-all">{student.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;