"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseList from "@/components/student/home/CourseList";
import MeetingCard from "@/components/student/home/MeetingCard";
import ScheduleCard from "@/components/student/home/ScheduleCard";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-6 bg-white">
        <Navbar />
        <h1 className="text-2xl font-bold mt-4">My Course</h1>

        {/* Danh sách khóa học */}
        <div className="mt-4">
          <CourseList />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 p-4 bg-gray-50 shadow-md">
        <MeetingCard />
        <h2 className="text-lg font-bold mt-4">Class Schedule</h2>
        <ScheduleCard />
        <ScheduleCard />
      </div>
    </div>
  );
};

export default DashboardPage;
