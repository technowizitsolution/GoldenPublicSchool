import { useEffect, useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { useAdmin } from "../../context/adminContext/AdminContext";

const CountChart = () => {
  const { students, fetchStudents } = useAdmin();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const chartData = useMemo(() => {
    if (!students || students.length === 0) {
      return [
        { name: "Total", count: 0, fill: "white" },
        { name: "Boys", count: 0, fill: "#C3EBFA" },
        { name: "Girls", count: 0, fill: "#FAE27C" },
      ];
    }

    const totalStudents = students.length;
    const boyCount = students.filter(s => s.sex === "Male").length;
    const girlCount = students.filter(s => s.sex === "Female").length;

    return [
      { name: "Total", count: totalStudents, fill: "white" },
      { name: "Boys", count: boyCount, fill: "#C3EBFA" },
      { name: "Girls", count: girlCount, fill: "#FAE27C" },
    ];
  }, [students]);

  const stats = useMemo(() => {
    if (!students || students.length === 0) {
      return {
        total: 0,
        boys: 0,
        girls: 0,
        boysPercentage: "0",
        girlsPercentage: "0",
      };
    }

    const total = students.length;
    const boys = students.filter(s => s.sex === "Male").length;
    const girls = students.filter(s => s.sex === "Female").length;

    return {
      total,
      boys,
      girls,
      boysPercentage: ((boys / total) * 100).toFixed(1),
      girlsPercentage: ((girls / total) * 100).toFixed(1),
    };
  }, [students]);

  // Responsive chart parameters
  const getChartConfig = () => {
    if (typeof window === "undefined") return { barSize: 16, innerRadius: "20%", outerRadius: "70%" };
    
    const width = window.innerWidth;
    
    if (width < 360) {
      return { barSize: 12, innerRadius: "15%", outerRadius: "65%", fontSize: 8 };
    } else if (width < 480) {
      return { barSize: 14, innerRadius: "18%", outerRadius: "68%", fontSize: 9 };
    } else if (width < 640) {
      return { barSize: 16, innerRadius: "20%", outerRadius: "70%", fontSize: 10 };
    } else if (width < 768) {
      return { barSize: 18, innerRadius: "22%", outerRadius: "72%", fontSize: 10 };
    } else if (width < 1024) {
      return { barSize: 20, innerRadius: "24%", outerRadius: "74%", fontSize: 11 };
    } else {
      return { barSize: 24, innerRadius: "26%", outerRadius: "76%", fontSize: 12 };
    }
  };

  const chartConfig = getChartConfig();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 xs:p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 w-full h-full flex flex-col">
      {/* TITLE */}
      <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5">
        <div className="min-w-0 flex-1">
          <h1 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
            Students
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 truncate">Gender Distribution</p>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="relative flex-1 flex items-center justify-center min-h-32 xs:min-h-40 sm:min-h-48 md:min-h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={chartConfig.innerRadius}
            outerRadius={chartConfig.outerRadius}
            barSize={chartConfig.barSize}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background
              dataKey="count"
              cornerRadius={4}
              label={{ position: "insideStart", fill: "#fff", fontSize: chartConfig.fontSize }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER ICON */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-full p-0.5 xs:p-1 sm:p-1.5 md:p-2 lg:p-2.5 xl:p-3 shadow-lg">
            <span className="inline-block text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl">
              👨‍👩‍👧‍👦
            </span>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="mt-1.5 xs:mt-2 sm:mt-3 md:mt-4 lg:mt-5 pt-1.5 xs:pt-2 sm:pt-3 md:pt-4 lg:pt-5 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {/* Total */}
          <div className="text-center min-w-0">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600 mt-0.5 truncate">Total</p>
          </div>

          {/* Boys */}
          <div className="text-center min-w-0">
            <div className="flex items-center justify-center gap-0.5 mb-0.5 xs:mb-1 flex-wrap">
              <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full flex-shrink-0" />
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-bold text-blue-600 truncate">
                {stats.boys}
              </p>
            </div>
            <p className="text-xs text-gray-600 truncate">Boys</p>
            <p className="text-xs font-semibold text-blue-600">{stats.boysPercentage}%</p>
          </div>

          {/* Girls */}
          <div className="text-center min-w-0">
            <div className="flex items-center justify-center gap-0.5 mb-0.5 xs:mb-1 flex-wrap">
              <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full flex-shrink-0" />
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-bold text-yellow-600 truncate">
                {stats.girls}
              </p>
            </div>
            <p className="text-xs text-gray-600 truncate">Girls</p>
            <p className="text-xs font-semibold text-yellow-600">{stats.girlsPercentage}%</p>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="mt-1.5 xs:mt-2 sm:mt-3 md:mt-4 flex gap-0.5 h-1 xs:h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div
          className="bg-blue-400 transition-all duration-300 rounded-full"
          style={{ width: `${stats.boysPercentage}%` }}
        />
        <div
          className="bg-yellow-400 transition-all duration-300 rounded-full"
          style={{ width: `${stats.girlsPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default CountChart;