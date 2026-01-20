import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const ClassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { axios } = useAuth();

    useEffect(() => {
        fetchClassDetails();
    }, [id]);

    const fetchClassDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/admin/class/${id}`);
            setClassData(response.data.class || response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching class:", err);
            setError(err.response?.data?.message || "Failed to fetch class details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-md m-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Class Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Back
                    </button>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="bg-white p-6 rounded-md m-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Class Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Back
                    </button>
                </div>
                <div className="text-center text-gray-500 py-8">No class data found</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            {classData.name}
                        </h1>
                        <p className="text-gray-600">
                            Academic Year: <span className="font-semibold">{classData.academicYear}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Back
                    </button>
                </div>

                {/* Status Badge */}
                <div className="mb-8">
                    <span
                        className={`inline-block px-4 py-2 rounded-full font-semibold text-white ${classData.status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                    >
                        {classData.status === "ACTIVE" ? "✓ Active" : "⊘ Archived"}
                    </span>
                </div>

                {/* Class Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Class Details Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="text-2xl mr-3">📚</span> Class Information
                        </h2>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-600 uppercase">
                                    Class Name
                                </label>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {classData.name}
                                </p>
                            </div>
                            <div className="pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-600 uppercase">
                                    Section
                                </label>
                                <p className="text-lg font-semibold text-gray-700 mt-1">
                                    {classData.section || "N/A"}
                                </p>
                            </div>
                            <div className="pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-600 uppercase">
                                    Student Capacity
                                </label>
                                <p className="text-lg font-semibold text-gray-700 mt-1">
                                    {classData.capacity} Students
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 uppercase">
                                    Academic Year
                                </label>
                                <p className="text-lg font-semibold text-gray-700 mt-1">
                                    {classData.academicYear}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Class Teacher Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="text-2xl mr-3">👨‍🏫</span> Class Teacher
                        </h2>
                        {classData.classTeacher ? (
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-purple-200">
                                    <label className="text-sm font-semibold text-gray-600 uppercase">
                                        Name
                                    </label>
                                    <p className="text-xl font-bold text-gray-800 mt-1">
                                        {classData.classTeacher.firstName} {classData.classTeacher.lastName}
                                    </p>
                                </div>
                                <div className="pb-4 border-b border-purple-200">
                                    <label className="text-sm font-semibold text-gray-600 uppercase">
                                        Email
                                    </label>
                                    <p className="text-gray-700 mt-1 break-all">
                                        {classData.classTeacher.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 uppercase">
                                        Contact
                                    </label>
                                    <p className="text-gray-700 mt-1">
                                        {classData.classTeacher.phone || "N/A"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No teacher assigned</p>
                        )}
                    </div>
                </div>

                {/* Fees Information */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-green-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                        <span className="text-3xl mr-3">💰</span> Fees Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Tuition Fee */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase">
                                Tuition Fee
                            </label>
                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                {classData.fees.currency === "INR" ? "₹" : classData.fees.currency}{" "}
                                {classData.fees.tuition.toLocaleString()}
                            </p>
                        </div>

                        {/* Admission Fee */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase">
                                Admission Fee
                            </label>
                            <p className="text-2xl font-bold text-green-600 mt-2">
                                {classData.fees.currency === "INR" ? "₹" : classData.fees.currency}{" "}
                                {classData.fees.admission.toLocaleString()}
                            </p>
                        </div>

                        {/* Exam Fee */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase">
                                Exam Fee
                            </label>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">
                                {classData.fees.currency === "INR" ? "₹" : classData.fees.currency}{" "}
                                {classData.fees.exam.toLocaleString()}
                            </p>
                        </div>

                        {/* Transport Fee */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase">
                                Transport Fee
                            </label>
                            <p className="text-2xl font-bold text-orange-600 mt-2">
                                {classData.fees.currency === "INR" ? "₹" : classData.fees.currency}{" "}
                                {classData.fees.transport.toLocaleString()}
                            </p>
                        </div>

                        {/* Total Fee */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase">
                                Total Fee
                            </label>
                            <p className="text-2xl font-bold text-purple-600 mt-2">
                                {classData.fees.currency === "INR" ? "₹" : classData.fees.currency}{" "}
                                {(
                                    classData.fees.tuition +
                                    classData.fees.admission +
                                    classData.fees.exam +
                                    classData.fees.transport
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <label className="text-sm font-semibold text-gray-600">Currency</label>
                        <p className="text-lg font-semibold text-gray-700 mt-2">
                            {classData.fees.currency}
                        </p>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-xl shadow p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                        Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-gray-500">Created</label>
                            <p className="text-gray-700 mt-1">
                                {new Date(classData.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Last Updated</label>
                            <p className="text-gray-700 mt-1">
                                {new Date(classData.updatedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;