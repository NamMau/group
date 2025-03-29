"use client";
import Navbar from "@/components/student/dashboard/Navbar";
import CourseDetail from "@/components/student/mycourse/course/CourseDetail";
import CourseInfo from "@/components/student/mycourse/course/CourseInfo";
import RegisterButton from "@/components/student/mycourse/course/RegisterButton";

const CoursePage = () => {
    return (
      <div className="bg-[#F8F5F2] min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-8 flex gap-10">
          {/* Phần thông tin khóa học */}
          <div className="flex-1">
            <CourseDetail />
            <RegisterButton />
            <CourseInfo />
          </div>
  
          {/* Hình ảnh khóa học */}
          <div className="w-1/3 h-56 bg-gray-300 border rounded-lg"></div>
        </div>
      </div>
    );
  };
  
  export default CoursePage;