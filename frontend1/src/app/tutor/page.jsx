"use client";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import CourseCard from "@/components/tutor/home/CourseCard";
import MeetingCard from "@/components/tutor/home/MeetingCard";
import SubmissionList from "@/components/tutor/home/SubmissionList";

const StudentDashboard = () => {
  return (
    <div className="flex bg-[#F7F5F2] text-[#3E3E3E]">
      {/* Sidebar */}
      <div className="w-64 bg-[#E8DED1] shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-[#FFF] shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          {/* Tiêu đề */}
          <h2 className="text-2xl font-semibold text-[#5A463E]">My course</h2>

          {/* Thanh tìm kiếm nhỏ */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484]"
            />
          </div>

          {/* Course List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <CourseCard title="HTML5" />
            <CourseCard title="CSS3" />
            <CourseCard title="JavaScript" />
            <CourseCard title="ReactJS" />
            <CourseCard title="Node.js" />
            <CourseCard title="Firebase" />
          </div>

          {/* Meeting + Submission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Meeting */}
            <MeetingCard className="bg-[#E8DED1] p-6 rounded-lg shadow-md" />

            {/* Most Recent Submission */}
            <SubmissionList className="bg-[#FFF] p-6 rounded-lg shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
