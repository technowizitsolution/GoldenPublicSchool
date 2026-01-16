import React, { useState } from "react";

const FeesChart = () => {
  const [period, setPeriod] = useState("Last 8 Quarter");

  const data = [
    { quarter: "Q1: 2023", totalFee: 50, collectedFee: 42 },
    { quarter: "Q1: 2023", totalFee: 55, collectedFee: 48 },
    { quarter: "Q1: 2023", totalFee: 60, collectedFee: 46 },
    { quarter: "Q1: 2023", totalFee: 58, collectedFee: 50 },
    { quarter: "Q1: 2023", totalFee: 56, collectedFee: 45 },
    { quarter: "Q1: 2023", totalFee: 52, collectedFee: 40 },
    { quarter: "Q1: 2023", totalFee: 48, collectedFee: 37 },
    { quarter: "Q1: 2023", totalFee: 54, collectedFee: 42 },
    { quarter: "Q1: 2023", totalFee: 60, collectedFee: 48 },
  ];

  const maxValue = 60;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Fees Collection</h2>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 9a2 2 0 104 0H5zm6 0a2 2 0 104 0h-4zm5-1a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-gray-600 border-none bg-transparent cursor-pointer focus:outline-none"
          >
            <option>Last 8 Quarter</option>
            <option>Last 6 Month</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Total Fee</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">Collected Fee</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-flex-end gap-6 h-80">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-right text-xs text-gray-500 pb-6 w-10">
          <span>60L</span>
          <span>50L</span>
          <span>40L</span>
          <span>30L</span>
          <span>20L</span>
          <span>10L</span>
          <span>0</span>
        </div>

        {/* Bars container */}
        <div className="flex-1 flex items-flex-end justify-around gap-4 pb-6 border-b border-gray-200">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              {/* Bars */}
              <div className="w-full flex items-flex-end justify-center gap-1 h-64">
                {/* Total Fee Bar */}
                <div className="w-1/2 flex items-flex-end">
                  <div
                    className="w-full bg-gray-300 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(item.totalFee / maxValue) * 100}%` }}
                  ></div>
                </div>
                {/* Collected Fee Bar */}
                <div className="w-1/2 flex items-flex-end">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(item.collectedFee / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* X-axis label */}
              <span className="text-xs text-gray-600 text-center whitespace-nowrap">
                {item.quarter}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeesChart;