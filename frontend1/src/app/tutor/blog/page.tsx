"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { blogService } from "../../../services/blogService";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import BlogPost from "@/components/student/blog/BlogPost";
//import TutorList, { TutorListProps, Tutor } from "@/components/student/blog/TutorList";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { BlogPost as BlogPostType, UpdateBlogData } from "../../../services/blogService";
import { userService } from "../../../services/userService";
import { authService } from "../../../services/authService";
import axios from "axios";

const PersonalBlog = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  //const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const blogResponse = await blogService.getAllBlogs();
        const tutorResponse = await userService.getTutors();

        if (Array.isArray(blogResponse)) {
          setBlogs(blogResponse);
        } else {
          setBlogs([]);
        }

        // if (Array.isArray(tutorResponse)) {
        //   // Type cast the tutors fetched from userService to the Tutor interface
        //   setTutors(tutorResponse as Tutor[]);
        // } else {
        //   setTutors([]);
        // }
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
      await blogService.deletePost(blogId);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog");
    }
  };

  const handleEditBlog = async (blogId: string) => {
    try {
      const updatedBlogData: UpdateBlogData = {
        title: "Updated Blog Title",
        content: "Updated blog content",
        tags: ["Updated Tag1", "Updated Tag2"],
        visibility: "public",
        //featuredImage: "default-avatar.png",
      };

      const response = await blogService.updatePost(blogId, updatedBlogData);
      setBlogs(blogs.map(blog => (blog._id === blogId ? { ...blog, ...response } : blog)));
      router.push('/tutor/blog');
    } catch (err) {
      console.error("Error editing blog:", err);
      alert("Failed to update blog");
    }
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
      <div className="w-64 bg-white shadow-md fixed left-0 top-[70px] h-[calc(100vh-70px)]">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64">
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        <div className="pt-20 px-6 space-y-6 overflow-auto min-h-screen flex">
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
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="relative group">
                  <BlogPost
                    post={blog}
                    currentUserId={localStorage.getItem('userId') || ''}
                    onUpdate={async () => {
                      const updatedBlogs = await blogService.getAllBlogs();
                      setBlogs(updatedBlogs);
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

          {/* <div className="w-1/4 p-4 bg-white shadow-md rounded-lg">
            <TutorList
              tutors={tutors}
              onNewPost={() => router.push('/tutor/blog/create')}
              onTutorClick={(tutorId) => router.push(`/tutor/profile/${tutorId}`)}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PersonalBlog;