import React from "react";

const UserCard = ({type}) => {
  return (
    <div className="rounded-2xl bg-white shadow-xl p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>

        <img
          src="/moreDark.png"
          alt="more"
          className="w-5 h-5 object-contain cursor-pointer"
        />
      </div>

      <h1 className="text-2xl font-semibold my-4">1,234</h1>

      <h2 className="capitalize text-sm font-medium text-gray-500">
        {type}s
      </h2>
    </div>
  );
};

export default UserCard;

