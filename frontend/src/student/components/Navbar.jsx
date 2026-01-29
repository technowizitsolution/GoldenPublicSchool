import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-3 md:p-4 gap-4">
      {/* LEFT - USER INFO */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        <img
          src="/avatar.png"
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-cover"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">Rohan</span>
          <span className="text-[10px] sm:text-xs text-gray-500">Student</span>
        </div>
      </div>

      {/* RIGHT - ICONS */}
      <div className="flex items-center gap-2 ml-2 sm:gap-3 md:gap-4 flex-shrink-0">
        

        <div className="bg-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition relative">
          <img src="/announcement.png" alt="Notifications" width={20} height={20} className="w-5 h-5 sm:w-5 sm:h-5" />
          <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs font-semibold">
            1
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;