import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const TeacherProfile = () => {
  const { token,axios } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/teacher/${id}`, {
        headers: { token },
      });

      setTeacher(response.data.teacher);
      setError(null);
    } catch (err) {
      console.error("Error fetching teacher:", err);
      setError(err.response?.data?.message || "Failed to fetch teacher details");
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
          <h1 className="text-2xl font-bold">Teacher Profile</h1>
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

  if (!teacher) {
    return (
      <div className="bg-white p-6 rounded-md m-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Teacher Profile</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <div className="text-center text-gray-500">No teacher found</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md m-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Teacher Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex items-start gap-6 pb-8 border-b border-gray-200">
        <img
          src="/avatar.png"
          alt={teacher.name}
          className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{teacher.name}</h2>
          <p className="text-gray-600 mb-4">{teacher.email}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-semibold">
                {teacher.employeeId || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{teacher.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-8 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Personal Information
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Gender</p>
            <p className="font-semibold text-lg">
              {teacher.gender || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
            <p className="font-semibold text-lg">
              {teacher.dob
                ? new Date(teacher.dob).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
            <p className="text-sm text-gray-600 mb-1">Address</p>
            <p className="font-semibold text-lg">
              {teacher.address || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="mt-8 mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Professional Information
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Qualification</p>
            <p className="font-semibold text-lg text-blue-600">
              {teacher.qualification || "N/A"}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Experience (Years)</p>
            <p className="font-semibold text-lg text-blue-600">
              {teacher.experienceYears}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Joining Date</p>
            <p className="font-semibold text-lg text-blue-600">
              {teacher.joiningDate
                ? new Date(teacher.joiningDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Account Information
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-semibold text-lg break-all">
              {teacher.email}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p
              className={`font-semibold text-lg ${
                teacher.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {teacher.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
