"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import BlogPost from "@/components/student/blog/BlogPost";
import TutorList from "@/components/student/blog/TutorList";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { BlogPost as BlogPostType } from "../../../services/blogService";

interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  specialization?: string;
}

const PersonalBlog = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch blogs
        const blogResponse = await axios.get('http://localhost:5000/api/v1/blogs/get-blogs', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch tutors
        const tutorResponse = await axios.get('http://localhost:5000/api/v1/users/get-tutors', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBlogs(blogResponse.data);
        setTutors(tutorResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/v1/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog");
    }
  };

  const handleEditBlog = (blogId: string) => {
    router.push(`/tutor/blog/edit/${blogId}`);
  };

  if (loading) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md fixed left-0 top-[70px] h-[calc(100vh-70px)]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md fixed left-0 top-[70px] h-[calc(100vh-70px)]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed left-0 top-[70px] h-[calc(100vh-70px)]">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 px-6 space-y-6 overflow-auto min-h-screen flex">
          {/* Blog Content */}
          <div className="w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Personal Blog</h1>
                <p className="text-gray-600 mt-2">
                  Share your thoughts and experiences with the community
                </p>
              </div>
              <button
                onClick={() => router.push('/tutor/blog/create')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create New Blog
              </button>
            </div>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="relative group">
                  <BlogPost
                    post={blog}
                    currentUserId={localStorage.getItem('userId') || ''}
                    onUpdate={async () => {
                      const response = await axios.get('http://localhost:5000/api/v1/blogs/get-blogs', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                      setBlogs(response.data);
                    }}
                    onDelete={async (postId) => {
                      await handleDeleteBlog(postId);
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBlog(blog._id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FiEdit2 className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Blog Posts Yet</h3>
                <p className="text-gray-600">Start sharing your thoughts with the community!</p>
              </div>
            )}
          </div>

          {/* Tutor List */}
          <div className="w-1/4 p-4 bg-white shadow-md rounded-lg">
            <TutorList
              onNewPost={() => router.push('/tutor/blog/create')}
              onTutorClick={(tutorId) => router.push(`/tutor/profile/${tutorId}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBlog;
