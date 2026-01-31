import React from "react";

const UserCard = ({ type, count = 0, active = 0 }) => {
  let icon = "";
  let color = "";
  let label = "";
  let backgroundColor = "";

  switch (type) {
    case "student":
      icon = "👨‍🎓";
      color = "bg-blue-100 text-blue-600";
      backgroundColor = "bg-blue-50";
      label = "Students";
      break;
    case "teacher":
      icon = "👨‍🏫";
      color = "bg-purple-100 text-purple-600";
      backgroundColor = "bg-purple-50";
      label = "Teachers";
      break;
    case "parent":
      icon = "👨‍👩‍👧";
      color = "bg-pink-100 text-pink-600";
      backgroundColor = "bg-pink-50";
      label = "Parents";
      break;
    case "staff":
      icon = "👔";
      color = "bg-yellow-100 text-yellow-600";
      backgroundColor = "bg-yellow-50";
      label = "Classes";
      break;
    default:
      break;
  }

  return (
    <div className={`${backgroundColor} rounded-lg sm:rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-2 xs:p-3 sm:p-3 md:p-4 flex flex-col sm:flex-col md:flex-row items-start sm:items-start md:items-center justify-between gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex-1">
        <p className="text-xs sm:text-xs md:text-sm font-medium text-gray-600 truncate">{label}</p>
        <p className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1 md:mt-2">{count}</p>
        {active > 0 && (
          <p className="text-xs text-gray-500 mt-0.5">{active} Active</p>
        )}
      </div>
      <div className={`${color} text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl rounded-md sm:rounded-lg p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
};

export default UserCard;