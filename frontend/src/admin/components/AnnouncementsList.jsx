import React from "react";

const AnnouncementsList = ({ announcements, onDelete }) => {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No announcements yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">{announcement.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => onDelete(announcement._id)}
              className="text-red-500 hover:text-red-700 font-semibold text-sm ml-4 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsList;