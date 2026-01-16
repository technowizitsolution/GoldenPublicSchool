import Announcements from "../components/Announcements";
import AttendanceChart from "../components/AttendanceChart";
import CountChart from "../components/CountChart";
import EventCalendar from "../components/EventCalendar";
import FinanceChart from "../components/FinanceChart";
import UserCard from '../components/UserCard.jsx';

const Dashboard = () => {
  return (
    // <div className="w-full min-h-screen bg-gray-50">
    //   {/* Header */}
    //   <div className="px-8 pt-6 pb-4">
    //     <div className="flex items-center gap-2 text-sm text-gray-500">
    //       <span className="text-xl font-semibold text-gray-800">
    //         Student Info
    //       </span>
    //       <span className="mx-1">|</span>
    //       <span className="text-blue-600 cursor-pointer hover:underline">
    //         Home
    //       </span>
    //       <span className="mx-1">&gt;</span>
    //       <span>Student Info</span>
    //     </div>
    //   </div>

    //   <hr className="border-gray-200" />

    //   {/* Stats Cards */}
    //   <div className="px-8 py-6">
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //       <StatCard
    //         icon="👨‍🎓"
    //         label="Total Students"
    //         value="3654"
    //         percentChange="1.2%"
    //         percentColor="bg-red-500"
    //         active="3643"
    //         inactive="11"
    //         bgColor="bg-red-100"
    //       />
    //       <StatCard
    //         icon="👨‍🏫"
    //         label="Total Teachers"
    //         value="284"
    //         percentChange="1.2%"
    //         percentColor="bg-blue-500"
    //         active="254"
    //         inactive="30"
    //         bgColor="bg-blue-100"
    //       />
    //       <StatCard
    //         icon="👥"
    //         label="Total Staff"
    //         value="162"
    //         percentChange="1.2%"
    //         percentColor="bg-yellow-500"
    //         active="161"
    //         inactive="02"
    //         bgColor="bg-yellow-100"
    //       />
    //       <StatCard
    //         icon="📚"
    //         label="Total Subjects"
    //         value="82"
    //         percentChange="1.2%"
    //         percentColor="bg-green-500"
    //         active="81"
    //         inactive="01"
    //         bgColor="bg-green-100"
    //       />
    //     </div>
    //   </div>

    //   {/* Fees Collection Chart & Calendar */}
    //   <div className="px-8 pb-6">
    //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //       {/* Chart takes 2 columns */}
    //       <div className="lg:col-span-2">
    //         <FeesChart />
    //       </div>
    //       {/* Calendar takes 1 column */}
    //       <div>
    //         <Calendar />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student"/>
          <UserCard type="teacher"/>
          <UserCard type="parent" />
          <UserCard type="staff"/>
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements/>
      </div>
    </div>
  );
};

export default Dashboard;