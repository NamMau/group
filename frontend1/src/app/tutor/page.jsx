"use client";
import { useState } from "react";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import CourseCard from "@/components/tutor/home/CourseCard";
import StudentTable from "@/components/tutor/home/StudentTable";
import SearchBar from "@/components/tutor/home/SearchBar";
import UpcomingMeeting from "@/components/tutor/home/UpcomingMeeting";
import RecentSubmissions from "@/components/tutor/home/RecentSubmissions";

const TutorDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen grid grid-cols-3 gap-6">
          {/* Danh sách khóa học */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Course</h2>
            <SearchBar />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {["HTML5", "CSS3", "JavaScript", "Python", "Bootstrap", "React"].map((title) => (
                <CourseCard
                  key={title}
                  title={title}
                  icon={title.toLowerCase()}
                  onViewCourse={() => setSelectedCourse(title)}
                />
              ))}
            </div>
          </div>

          {/* Upcoming meeting */}
          <div className="col-span-1">
            <UpcomingMeeting />
          </div>

          {/* Nếu có selectedCourse, hiển thị StudentTable */}
          {selectedCourse ? (
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-4">{selectedCourse} - Student List</h2>
              <StudentTable />
              <button
                onClick={() => setSelectedCourse(null)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Back to Courses
              </button>
            </div>
          ) : (
            <div className="col-span-3">
              <RecentSubmissions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
