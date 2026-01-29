import { useState, useEffect } from "react"
import { useAuth } from '../../context/AuthContext';

const SAnnouncements = () => {
  const { axios, token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/student/announcements', { headers: { token } });
      console.log("Announcements fetched : ", response.data.announcements);
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllAnnouncements();
  }, [])

  const colors = [
    "border-blue-500",
    "border-purple-500",
    "border-green-500",
    "border-orange-500",
    "border-pink-500",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with important school notices</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Announcements List */}
      {!loading && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div
              key={announcement._id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${colors[index % colors.length]}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {announcement.title}
                  </h3>
                </div>
                <span className="text-gray-500 text-sm ml-4">
                  {formatDate(announcement.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No announcements available</p>
          </div>
        )
      )}
    </div>
  )
}

export default SAnnouncements