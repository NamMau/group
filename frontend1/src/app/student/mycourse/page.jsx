"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseList from "@/components/student/dashboard/CourseList";
import MeetingCard from "@/components/student/home/MeetingCard";
import ScheduleCard from "@/components/student/home/ScheduleCard";

const MyCourse = () => {
  const router = useRouter();

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen fixed left-0 top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 px-6 space-y-6 overflow-auto min-h-screen flex gap-6">
          {/* Course List */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
              <p className="text-gray-600 mt-2">
                View and manage all your enrolled courses
              </p>
            </div>
            <CourseList />
          </div>

          {/* Right Sidebar */}
          <div className="w-1/4 p-4 bg-gray-50 shadow-md">
            <MeetingCard />
            <h2 className="text-lg font-bold mt-4">Class Schedule</h2>
            <ScheduleCard />
            <ScheduleCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
