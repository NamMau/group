"use client";
import { useState } from "react";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import CourseCard from "@/components/tutor/dashboard/CourseCard";
import StudentTable from "@/components/tutor/dashboard/StudentTable";

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
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          {/* Nếu có selectedCourse, hiển thị StudentTable */}
          {selectedCourse ? (
            <div>
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
            // Nếu chưa chọn khóa học, hiển thị danh sách khóa học
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { title: "HTML5", icon: "html5" },
                  { title: "CSS3", icon: "css3" },
                  { title: "JavaScript", icon: "js" },
                  { title: "Python", icon: "python" },
                  { title: "Bootstrap", icon: "bootstrap" },
                  { title: "React", icon: "react" },
                ].map((course) => (
                  <CourseCard
                    key={course.title}
                    title={course.title}
                    icon={course.icon}
                    onViewCourse={() => setSelectedCourse(course.title)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
