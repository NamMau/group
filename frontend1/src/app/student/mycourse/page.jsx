"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseCard from "@/components/student/mycourse/CourseCardProp";
import { useRouter } from "next/navigation"; // Dùng useRouter thay vì useRouter từ next/router

const MyCourse = () => {
  const router = useRouter();

  const handleViewCourse = () => {
    router.push("./mycourse/course"); // Điều hướng đến trang chi tiết khóa học
  };

  const freeCourses = [
    { title: "IT Introductory Knowledge", category: "Free Course", views: "33.2k", duration: "2h12p" },
    { title: "Web Development Basics", category: "Free Course", views: "28.5k", duration: "3h00p" },
    { title: "Python for Beginners", category: "Free Course", views: "45.8k", duration: "4h30p" },
  ];

  const proCourses = [
    { title: "HTML, CSS Pro", category: "Video", views: "33.2k", duration: "2h10p", isNew: true },
    { title: "Advanced JavaScript", category: "Video", views: "25.4k", duration: "3h15p", isNew: true },
    { title: "React & Next.js Mastery", category: "Video", views: "18.6k", duration: "5h20p", isNew: true },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar active="My Course" />
      </div>

      <div className="flex-1 ml-64">
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          <div className="max-w-screen-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {freeCourses.map((course, index) => (
                <CourseCard key={index} {...course} onClick={handleViewCourse} />
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              Pro Courses
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">New</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {proCourses.map((course, index) => (
                <CourseCard key={index} {...course} onClick={handleViewCourse} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
