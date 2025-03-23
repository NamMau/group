"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseCard from "@/components/student/mycourse/CourseCardProp";

const MyCourse = () => {
  const freeCourses = [
    {
      title: "IT Introductory Knowledge",
      category: "Free Course",
      views: "33.2k",
      duration: "2h12p",
    },
    {
      title: "IT Introductory Knowledge",
      category: "Free Course",
      views: "33.2k",
      duration: "2h12p",
    },
    {
      title: "IT Introductory Knowledge",
      category: "Free Course",
      views: "33.2k",
      duration: "2h12p",
    },
  ];

  const proCourses = [
    {
      title: "HTML, CSS Pro",
      category: "Video",
      views: "33.2k",
      duration: "2h10p",
      isNew: true,
    },
    {
      title: "HTML, CSS Pro",
      category: "Video",
      views: "33.2k",
      duration: "2h10p",
      isNew: true,
    },
    {
      title: "HTML, CSS Pro",
      category: "Video",
      views: "33.2k",
      duration: "2h10p",
      isNew: true,
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar active="My Course" />
      </div>

      {/* Main Content (Dịch phải tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính (Thêm padding-top để tránh bị Navbar che) */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          <div className="max-w-screen-lg mx-auto">
            {/* Free Courses */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Free Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {freeCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>

            {/* Pro Courses */}
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              Pro Courses
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">New</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {proCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
