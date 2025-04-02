"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import BlogPost from "@/components/student/blog/BlogPost";
import TutorList from "@/components/student/blog/TutorList";
import axios from "axios";
import { BlogPost as BlogPostType } from "../../../services/blogService";

type Tutor = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  specialization?: string;
  rating?: number;
  totalStudents?: number;
}

const PersonalBlog = () => {
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        // Get student ID from token or user context
        const studentId = localStorage.getItem("userId");
        if (!studentId) {
          setError("User ID not found");
          return;
        }
        setCurrentUserId(studentId);

        // Fetch blogs and tutors in parallel
        const [blogsResponse, tutorsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/blogs/get-blogstudent/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/v1/users/get-tutors', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setBlogs(blogsResponse.data.data || []); // Access the data property
        setTutors(tutorsResponse.data.data || []); // Access the data property
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdatePost = (updatedPost: BlogPostType) => {
    setBlogs(blogs.map(blog => 
      blog._id === updatedPost._id ? updatedPost : blog
    ));
  };

  const handleDeletePost = (postId: string) => {
    setBlogs(blogs.filter(blog => blog._id !== postId));
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-100 min-h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
            {blogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No blog posts yet.</p>
            ) : (
              blogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  post={blog}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </div>

          {/* Tutor List (Chiếm 1/4 màn hình) */}
          <div className="w-1/4 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Top Tutors</h2>
            <TutorList
              onNewPost={() => {}}
              onTutorClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBlog; 