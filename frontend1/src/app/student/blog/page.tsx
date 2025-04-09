
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import BlogPost from "@/components/student/blog/BlogPost";
import TutorList from "@/components/student/blog/TutorList";
import { BlogPost as BlogPostType } from "../../../services/blogService";
import { blogService } from "../../../services/blogService";
import { userService } from "../../../services/userService";
import { authService } from "../../../services/authService";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for token first
        const token = authService.getToken();
        if (!token) {
          console.error("No authentication token found");
          router.push("/login");
          return;
        }

        // Get user info from localStorage
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          console.error("No user data found");
          router.push("/login");
          return;
        }

        // Parse user data
        try {
          const userData = JSON.parse(userJson);
          if (!userData._id) {
            throw new Error("Invalid user data structure");
          }
          setCurrentUserId(userData._id);
          
          // Log for debugging
          console.log("Using user ID:", userData._id);

          // Fetch blogs and tutors in parallel
          const [studentBlogs, tutorsData] = await Promise.all([
            blogService.getStudentBlogs(userData._id),
            userService.getTutors()
          ]);

          setBlogs(Array.isArray(studentBlogs) ? studentBlogs : []);
          setTutors(Array.isArray(tutorsData) ? tutorsData : []);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          authService.logout();
          router.push("/login");
          return;
        }
      } catch (err) {
        handleFetchError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFetchError = (error: unknown) => {
    let errorMessage = "Failed to fetch data";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("401")) {
        authService.logout();
        router.push("/login");
      }
    }
    setError(errorMessage);
    console.error("API Error:", error);
  };

  const handleUpdatePost = async (updatedPost: BlogPostType) => {
    try {
      const result = await blogService.updatePost(updatedPost._id, {
        title: updatedPost.title,
        content: updatedPost.content,
        tags: updatedPost.tags,
        visibility: updatedPost.visibility,
        featuredImage: updatedPost.featuredImage || ""
      });
      
      setBlogs(prev => 
        prev.map(post => post._id === updatedPost._id ? result : post)
      );
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await blogService.deletePost(postId);
      setBlogs(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const updatedPost = await blogService.toggleLike(postId);
      setBlogs(prev => prev.map(post => post._id === postId ? updatedPost : post));
    } catch (err) {
      console.error("Toggle like failed:", err);
      alert("Failed to toggle like");
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const updatedPost = await blogService.addComment(postId, content);
      setBlogs(prev => prev.map(post => post._id === postId ? updatedPost : post));
    } catch (err) {
      console.error("Add comment failed:", err);
      alert("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const updatedPost = await blogService.deleteComment(postId, commentId);
      setBlogs(prev => prev.map(post => post._id === postId ? updatedPost : post));
    } catch (err) {
      console.error("Delete comment failed:", err);
      alert("Failed to delete comment");
    }
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
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Personal Blog</h2>
              <button
                onClick={() => router.push("/student/blog/create")}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <span className="mr-2">+New Post</span>
              </button>
            </div>
            
            {blogs.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-center">Start writing your first blog post!</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  post={blog}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                  onToggleLike={handleToggleLike}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </div>

          <div className="w-1/4 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Top Tutors</h2>
            {/* <TutorList
              tutors={tutors}
              onTutorClick={(tutorId) => router.push(`/tutors/${tutorId}`)}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBlog;