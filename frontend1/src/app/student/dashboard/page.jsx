"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import TimeSpentChart from "@/components/student/dashboard/TimeSpentChart";
import ProgressList from "@/components/student/dashboard/ProgressList";
import CourseCard from "@/components/student/dashboard/CourseCard";

const StudentDashboard = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content (Dịch phải tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính (Thêm padding-top để tránh bị Navbar che) */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Time Spent Chart (Chiếm 2 cột trên desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Time Spent on Studying</h2>
              <TimeSpentChart />
            </div>

            {/* Latest Progress (Chiếm 1 cột) */}
            <div className="bg-white p-6 rounded-lg shadow-md h-[320px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Latest Progress</h2>
              <ProgressList />
            </div>
          </div>

          {/* Your Courses (Grid linh hoạt) */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default StudentDashboard;
