"use client";
import Sidebar from "@/components/studentDashboard/Sidebar";
import Navbar from "@/components/studentDashboard/Navbar";
import BlogPost from "@/components/studentDashboard/blog/BlogPost";
import TutorList from "@/components/studentDashboard/blog/TutorList";

const PersonalBlog = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Navbar />

        {/* Bài đăng blog */}
        <div className="mt-4">
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
      </div>

      {/* Tutor list */}
      <div className="w-1/4 p-4">
        <TutorList />
      </div>
    </div>
  );
};

export default PersonalBlog;
