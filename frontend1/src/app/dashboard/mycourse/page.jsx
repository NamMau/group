"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import CourseCard from "@/components/dashboard/CourseCard";


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
      <Sidebar active="My Course" />
      <div className="flex-1 p-6">
        <Navbar />
        <h2 className="text-xl font-semibold text-brown-800 mb-4">Free Courses</h2>
        <div className="grid grid-cols-3 gap-4">
          {freeCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
        <h2 className="text-xl font-semibold text-brown-800 mt-6 mb-4">Pro Courses <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">New</span></h2>
        <div className="grid grid-cols-3 gap-4">
          {proCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
