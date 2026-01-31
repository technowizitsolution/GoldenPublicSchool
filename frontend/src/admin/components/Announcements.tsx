import { useEffect, useState } from "react";
import {useAuth} from '../../context/authContext/AuthContext';
import { useAdmin } from "../../context/adminContext/AdminContext";

const Announcements = () => {
  const {token,axios} = useAuth();
  const {announcements } = useAdmin();

  const colors = ["bg-sky-50", "bg-purple-50", "bg-yellow-50"];

  return (
    <div className="bg-white p-2 xs:p-3 sm:p-4 md:p-3 lg:p-3 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
        <h1 className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">Announcements</h1>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View All</span>
      </div>
      <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-2 overflow-y-auto scrollbar-hidden flex-1">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <div 
              key={announcement._id} 
              className={`${colors[index % colors.length]} rounded-lg p-2 xs:p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow flex-shrink-0`}
            >
              <div className="flex items-start justify-between gap-1 xs:gap-2">
                <h2 className="font-medium text-xs xs:text-sm sm:text-sm md:text-base text-gray-900 flex-1 line-clamp-2">{announcement.title}</h2>
                <span className="text-xs text-gray-500 bg-white rounded px-1.5 xs:px-2 py-0.5 xs:py-1 whitespace-nowrap flex-shrink-0">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs xs:text-xs sm:text-sm text-gray-600 mt-1 xs:mt-1.5 line-clamp-2">
                {announcement.content.substring(0, 150)}...
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4 text-xs sm:text-sm">No announcements</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;