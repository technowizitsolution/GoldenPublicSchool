import { useState, useEffect } from "react"
import { useAuth } from '../../context/AuthContext';

const SUniforms = () => {
  const [studentUniforms, setStudentUniforms] = useState([]);
  const [uniformItems, setUniformItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('issued');
  const { token, axios } = useAuth();

  const getStudentUniforms = async () => {
    try {
      const response = await axios.get('/student/studentUniforms', { headers: { token } });
      if (response.data.success) {
        setStudentUniforms(response.data.studentUniforms[0].uniforms);
      }
    } catch (err) {
      console.error("Error fetching student uniforms:", err);
      setError(err.response?.data?.message || "Error fetching uniforms");
    }
  };

  const getUniformItems = async () => {
    try {
      const response = await axios.get('/student/uniformItems', { headers: { token } });
      if (response.data.success) {
        setUniformItems(response.data.uniformItems);
      }
    } catch (err) {
      console.error("Error fetching uniform items:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getStudentUniforms(), getUniformItems()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50';
      case 'damaged':
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-3 sm:p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">Loading uniforms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Uniforms</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">Track your issued school uniforms and conditions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Uniforms Issued</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              {studentUniforms.length}
            </h3>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Uniform Types Available</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {uniformItems.length}
            </h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('issued')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition ${activeTab === 'issued'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              👕 My Uniforms ({studentUniforms.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition ${activeTab === 'available'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              📦 Available Items ({uniformItems.length})
            </button>
          </div>

          {/* ISSUED UNIFORMS TAB */}
          {activeTab === 'issued' && (
            <div className="p-3 sm:p-6">
              {studentUniforms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {studentUniforms.map((uniform, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-md sm:hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">
                          {uniform.itemName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                          {uniform.condition.charAt(0).toUpperCase() + uniform.condition.slice(1)} condition
                        </p>
                      </div>

                      {/* Body */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
                        {/* Size & Quantity */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Size</p>
                            <p className="bg-gray-100 text-gray-900 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold inline-block">
                              {uniform.size}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Quantity</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">{uniform.quantity}</p>
                          </div>
                        </div>

                        {/* Condition Badge & Date */}
                        <div className="pt-2 sm:pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Issued Date</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">
                              {formatDate(uniform.issueDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-0.5 sm:mb-1">Condition</p>
                            <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold capitalize ${getConditionColor(uniform.condition)}`}>
                              {uniform.condition}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">👕</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">No Uniforms Issued</h3>
                  <p className="text-xs sm:text-sm text-gray-600">You haven't received any uniforms yet.</p>
                </div>
              )}
            </div>
          )}

          {/* AVAILABLE ITEMS TAB */}
          {activeTab === 'available' && (
            <div className="p-3 sm:p-6">
              {uniformItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {uniformItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-md sm:hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                          {item.description || "School uniform item"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📦</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">No Items Available</h3>
                  <p className="text-xs sm:text-sm text-gray-600">No uniform items are currently available.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SUniforms;