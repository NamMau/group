"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseGrid from "@/components/student/document/CourseGrid";

const DashboardLayout = () => {
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
        <div className="pt-20 p-6 overflow-auto min-h-screen">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">My Course</h2>

            {/* Danh sách khóa học */}
            <CourseGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
