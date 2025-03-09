"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import CourseCard from "@/components/dashboard/CourseCard";

const MyCourse = () => {
  const freeCourses = [
    { title: "HTML Basics", category: "Free", views: 1200, hours: 10 },
    { title: "CSS Flexbox", category: "Free", views: 950, hours: 8 },
  ];

  const proCourses = [
    { title: "Advanced React", category: "Pro", views: 500, hours: 20 },
    { title: "Node.js Mastery", category: "Pro", views: 300, hours: 25 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeItem="My Course" />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">My Courses</h1>
          
          {/* Free Courses */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Free Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </section>
          
          {/* Pro Courses */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Pro Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proCourses.map((course, index) => (
                <CourseCard key={index} {...course} isNew />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
