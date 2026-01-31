import React, { useState } from "react";

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(date);
  const firstDay = getFirstDayOfMonth(date);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const isCurrentMonth = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  const currentDay = isCurrentMonth ? today.getDate() : null;

  return (
    <div className="bg-white p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4 bg-blue-50 p-1.5 xs:p-2 sm:p-3 rounded-md">
        <button onClick={handlePrevMonth} className="text-base xs:text-lg sm:text-xl font-bold text-gray-700 hover:bg-blue-100 px-1.5 xs:px-2 rounded">&lt;</button>
        <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-900 text-center flex-1 px-1">{monthNames[date.getMonth()]} {date.getFullYear()}</h2>
        <button onClick={handleNextMonth} className="text-base xs:text-lg sm:text-xl font-bold text-gray-700 hover:bg-blue-100 px-1.5 xs:px-2 rounded">&gt;</button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-0.5 xs:gap-0.5 mb-1.5 xs:mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-bold text-xs text-gray-700">
            {day.substring(0, 1)}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center py-1 xs:py-1.5 rounded text-xs xs:text-sm font-medium aspect-square flex items-center justify-center ${
              day === currentDay
                ? "bg-blue-200 text-blue-900 font-bold"
                : day
                ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;