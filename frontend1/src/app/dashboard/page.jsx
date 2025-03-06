"use client";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import TimeSpentChart from "@/components/TimeSpentChart";
import ProgressList from "@/components/ProgressList";
import CourseCard from "@/components/CourseCard";

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time Spent Chart */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Time Spent on Studying</h2>
            <TimeSpentChart />
          </div>
          
          {/* Latest Progress */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Latest Progress</h2>
            <ProgressList />
          </div>
          
          {/* Your Courses */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CourseCard title="HTML5" icon="html5" />
            <CourseCard title="CSS3" icon="css3" />
            <CourseCard title="JavaScript" icon="js" />
            <CourseCard title="Python" icon="python" />
            <CourseCard title="Bootstrap" icon="bootstrap" />
            <CourseCard title="React" icon="react" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
