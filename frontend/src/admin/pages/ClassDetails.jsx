import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft } from "lucide-react";

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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-gray-600 font-semibold text-sm sm:text-base">Loading class details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg m-2 sm:m-3 md:m-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Class Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="bg-white rounded-lg m-2 sm:m-3 md:m-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Class Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
                <div className="text-center text-gray-500 py-8 text-sm sm:text-base">No class data found</div>
            </div>
        );
    }

    const totalFee = classData.fees.tuition + classData.fees.admission + classData.fees.exam + classData.fees.transport;
    const currencySymbol = classData.fees.currency === "INR" ? "₹" : classData.fees.currency;

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                            {classData.name}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                            Academic Year: <span className="font-semibold">{classData.academicYear}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition text-xs sm:text-sm font-medium flex-shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <span
                        className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-white text-xs sm:text-sm ${classData.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                    >
                        {classData.status === "ACTIVE" ? "✓ Active" : "⊘ Archived"}
                    </span>
                </div>

                {/* Class Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                    {/* Class Details Card */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-l-4 border-blue-500">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">📚</span> 
                            <span>Class Information</span>
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="pb-3 sm:pb-4 border-b border-gray-200">
                                <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                    Class Name
                                </label>
                                <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                                    {classData.name}
                                </p>
                            </div>
                            <div className="pb-3 sm:pb-4 border-b border-gray-200">
                                <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                    Section
                                </label>
                                <p className="text-base sm:text-lg font-semibold text-gray-700 mt-1">
                                    {classData.section || "N/A"}
                                </p>
                            </div>
                            <div className="pb-3 sm:pb-4 border-b border-gray-200">
                                <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                    Student Capacity
                                </label>
                                <p className="text-base sm:text-lg font-semibold text-gray-700 mt-1">
                                    {classData.capacity} Students
                                </p>
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                    Academic Year
                                </label>
                                <p className="text-base sm:text-lg font-semibold text-gray-700 mt-1">
                                    {classData.academicYear}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Class Teacher Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-l-4 border-purple-500">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">👨‍🏫</span>
                            <span>Class Teacher</span>
                        </h2>
                        {classData.classTeacher ? (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="pb-3 sm:pb-4 border-b border-purple-200">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                        Name
                                    </label>
                                    <p className="text-base sm:text-lg font-bold text-gray-800 mt-1">
                                        {classData.classTeacher.firstName} {classData.classTeacher.lastName}
                                    </p>
                                </div>
                                <div className="pb-3 sm:pb-4 border-b border-purple-200">
                                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                        Email
                                    </label>
                                    <p className="text-xs sm:text-sm text-gray-700 mt-1 break-all font-medium">
                                        {classData.classTeacher.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
                                        Contact
                                    </label>
                                    <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                                        {classData.classTeacher.phone || "N/A"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">No teacher assigned</p>
                        )}
                    </div>
                </div>

                {/* Fees Information */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border-l-4 border-green-500">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-8 flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl">💰</span>
                        <span>Fees Information</span>
                    </h2>
                    
                    {/* Fees Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                        {/* Tuition Fee */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border border-blue-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase block">
                                Tuition Fee
                            </label>
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-blue-600 mt-1 sm:mt-2">
                                {currencySymbol}{" "}
                                {classData.fees.tuition.toLocaleString()}
                            </p>
                        </div>

                        {/* Admission Fee */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border border-green-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase block">
                                Admission Fee
                            </label>
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-green-600 mt-1 sm:mt-2">
                                {currencySymbol}{" "}
                                {classData.fees.admission.toLocaleString()}
                            </p>
                        </div>

                        {/* Exam Fee */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4 md:p-6 border border-yellow-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase block">
                                Exam Fee
                            </label>
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-yellow-600 mt-1 sm:mt-2">
                                {currencySymbol}{" "}
                                {classData.fees.exam.toLocaleString()}
                            </p>
                        </div>

                        {/* Transport Fee */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 md:p-6 border border-orange-200">
                            <label className="text-xs font-semibold text-gray-600 uppercase block">
                                Transport Fee
                            </label>
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-orange-600 mt-1 sm:mt-2">
                                {currencySymbol}{" "}
                                {classData.fees.transport.toLocaleString()}
                            </p>
                        </div>

                        {/* Total Fee */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border border-purple-200 sm:col-span-2 lg:col-span-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase block">
                                Total Fee
                            </label>
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-purple-600 mt-1 sm:mt-2">
                                {currencySymbol}{" "}
                                {totalFee.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                        <label className="text-xs sm:text-sm font-semibold text-gray-600">Currency</label>
                        <p className="text-sm sm:text-lg font-semibold text-gray-700 mt-1 sm:mt-2">
                            {classData.fees.currency}
                        </p>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl shadow p-4 sm:p-6 md:p-8 border border-gray-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase mb-3 sm:mb-4">
                        Additional Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Created</label>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                                {new Date(classData.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Last Updated</label>
                            <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                                {new Date(classData.updatedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
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