"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import BlogPost from "@/components/student/blog/BlogPost";
import TutorList from "@/components/student/blog/TutorList";

const PersonalBlog = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-[70px] h-[calc(100vh-70px)]">
        <Sidebar />
      </div>

      {/* Main content (Dịch phải tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính (Thêm padding-top để tránh bị Navbar che) */}
        <div className="pt-20 px-6 space-y-6 overflow-auto min-h-screen flex">
          {/* Blog Content */}
          <div className="w-3/4">
            <h2 className="text-xl font-semibold mb-4">Personal Blog</h2>
            <BlogPost
              author="Hoàng Huy"
              avatar="/avatar1.jpg"
              content="Chào mọi người! Đây là bài viết đầu tiên trên blog cá nhân của mình."
              image="/blog-image.jpg"
            />
            <BlogPost
              author="Ngọc Lan"
              avatar="/avatar3.jpg"
              content="Một ngày thật đẹp để học Next.js! 🚀"
            />
          </div>

          {/* Tutor List (Chiếm 1/4 màn hình) */}
          <div className="w-1/4 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Top Tutors</h2>
            <TutorList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBlog;
