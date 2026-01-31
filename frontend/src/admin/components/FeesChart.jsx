import React, { useMemo } from "react";
import { useAdmin } from "../../context/adminContext/AdminContext";

const FeesChart = () => {
  const { feesData } = useAdmin();

  const stats = useMemo(() => {
    if (!feesData || Object.keys(feesData).length === 0) {
      return {
        totalExpected: 0,
        totalCollected: 0,
        collectionRate: "0",
        pendingAmount: 0,
      };
    }

    const feesArray = Object.values(feesData);
    const totalExpected = feesArray.reduce((sum, fee) => sum + (fee.totalFees || 0), 0);
    const totalCollected = feesArray.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
    const pendingAmount = totalExpected - totalCollected;
    const rate = totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : "0";

    return {
      totalExpected,
      totalCollected,
      collectionRate: rate,
      pendingAmount,
    };
  }, [feesData]);

  return (
    <div className="bg-white rounded-lg md:rounded-lg shadow-md border border-gray-200 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Fees Overview</h2>
        <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1">Collection Summary</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 flex-1">
        {/* Total Expected */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 xs:p-3 sm:p-3 md:p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <svg className="w-7 xs:w-8 sm:w-9 md:w-10 lg:w-12 h-7 xs:h-8 sm:h-9 md:h-10 lg:h-12 text-gray-600 mb-1 xs:mb-1.5 sm:mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H8.5z" />
          </svg>
          <p className="text-xs sm:text-xs md:text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wide line-clamp-1">Expected</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
            ₹{(stats.totalExpected / 100000).toFixed(2)}L
          </p>
        </div>

        {/* Total Collected */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 xs:p-3 sm:p-3 md:p-4 border border-blue-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <svg className="w-7 xs:w-8 sm:w-9 md:w-10 lg:w-12 h-7 xs:h-8 sm:h-9 md:h-10 lg:h-12 text-blue-600 mb-1 xs:mb-1.5 sm:mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-xs sm:text-xs md:text-xs lg:text-sm font-semibold text-blue-700 uppercase tracking-wide line-clamp-1">Collected</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">
            ₹{(stats.totalCollected / 100000).toFixed(2)}L
          </p>
        </div>

        {/* Pending Amount */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-2 xs:p-3 sm:p-3 md:p-4 border border-orange-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <svg className="w-7 xs:w-8 sm:w-9 md:w-10 lg:w-12 h-7 xs:h-8 sm:h-9 md:h-10 lg:h-12 text-orange-600 mb-1 xs:mb-1.5 sm:mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs sm:text-xs md:text-xs lg:text-sm font-semibold text-orange-700 uppercase tracking-wide line-clamp-1">Pending</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-orange-600 mt-0.5 sm:mt-1">
            ₹{(stats.pendingAmount / 100000).toFixed(2)}L
          </p>
        </div>

        {/* Collection Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 xs:p-3 sm:p-3 md:p-4 border border-green-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <svg className="w-7 xs:w-8 sm:w-9 md:w-10 lg:w-12 h-7 xs:h-8 sm:h-9 md:h-10 lg:h-12 text-green-600 mb-1 xs:mb-1.5 sm:mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-2 1a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm2-4a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v1zm-2 7a1 1 0 100-2 1 1 0 000 2zm2 1a1 1 0 110-2h.01a1 1 0 110 2H16zm-4 0a1 1 0 110-2h.01a1 1 0 110 2H12zm2-8H8v4h4V7z" clipRule="evenodd" />
          </svg>
          <p className="text-xs sm:text-xs md:text-xs lg:text-sm font-semibold text-green-700 uppercase tracking-wide line-clamp-1">Rate</p>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
            {stats.collectionRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeesChart;