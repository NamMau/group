"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseList from "@/components/student/home/CourseList";
import MeetingCard from "@/components/student/home/MeetingCard";
import ScheduleCard from "@/components/student/home/ScheduleCard";

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F6F3] text-[#3F2E21]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 px-8 py-6">
        <Navbar />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold text-[#5A3E2B]">My course</h1>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-[#D6CCC2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B] text-sm bg-white"
            />
          </div>
        </div>

        {/* Danh sách khóa học - 2 hàng, mỗi hàng 2 khóa học */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <CourseList title="HTML" subtitle="HTML 5" />
          <CourseList title="HTML" subtitle="HTML 5" />
          <CourseList title="HTML" subtitle="HTML 5" />
          <CourseList title="HTML" subtitle="HTML 5" />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 p-6 bg-[#EAE7DC] shadow-sm rounded-l-2xl">
        <MeetingCard 
          className="abcd"
          time="8:30 AM"
          date="17/10/2000"
        />
        
        <h2 className="text-lg font-semibold mt-8 text-[#5A3E2B]">Class schedule</h2>
        
        <div className="mt-4 space-y-4">
          <ScheduleCard 
            courseName="Name Course"
            tutorName="Name Tutor"
            dateTime="30/06/2025, 9:30 AM"
          />
          <ScheduleCard 
            courseName="Name Course"
            tutorName="Name Tutor"
            dateTime="30/06/2025, 9:30 AM"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;