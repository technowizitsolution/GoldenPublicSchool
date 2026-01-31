import Announcements from "../components/Announcements";
import CountChart from "../components/CountChart";
import EventCalendar from "../components/EventCalendar";
import FeesChart from "../components/FeesChart.jsx";
import UserCard from '../components/UserCard.jsx';
import { useAdmin } from "../../context/adminContext/AdminContext.js";

const Dashboard = () => {
  const { 
    students, 
    teachers, 
    classes,
  } = useAdmin();

  return (
    <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-col lg:flex-row h-screen bg-gray-50">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-2/3 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">

        {/* USER CARDS - Fully Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 lg:gap-4">
          <UserCard 
            type="student" 
            count={students.length}
          />
          <UserCard 
            type="teacher" 
            count={teachers.length}
          />
          <UserCard 
            type="parent" 
            count={0}
          />
          <UserCard 
            type="staff" 
            count={classes.length}
          />
        </div>

        {/* CHARTS SECTION - Responsive Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* COUNT CHART */}
          <div className="lg:col-span-1 h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[450px]">
            <CountChart />
          </div>
          
          {/* FEES CHART */}
          <div className="lg:col-span-2 h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[450px]">
            <FeesChart />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Responsive Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Calendar */}
        <div className="h-auto lg:h-96 min-h-[280px]">
          <EventCalendar />
        </div>
        
        {/* Announcements */}
        <div className=" lg:flex-1 max-h-[180px]">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;