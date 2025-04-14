"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { blogService } from "../../../services/blogService";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import BlogPost from "@/components/tutor/blog/BlogPost";
import { FiPlus } from "react-icons/fi";
import type { BlogPost as BlogPostType } from "../../../services/blogService";
import { authService } from "../../../services/authService";
import { toast } from "react-hot-toast";

const TutorBlog = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const user = authService.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setCurrentUserId(user._id);
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [router]);

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
      });
      
      setBlogs(prev => 
        prev.map(post => post._id === updatedPost._id ? result : post)
      );
      toast.success("Post updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await blogService.deletePost(postId);
      setBlogs(prev => prev.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete post");
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const updatedPost = await blogService.toggleLike(postId);
      // Get the original post to preserve author info
      const originalPost = blogs.find(post => post._id === postId);
      if (originalPost) {
        setBlogs(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...updatedPost,
              author: originalPost.author // Keep the original author info
            };
          }
          return post;
        }));
      }
      toast.success("Like updated successfully");
    } catch (err) {
      console.error("Toggle like failed:", err);
      toast.error("Failed to toggle like");
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const updatedPost = await blogService.addComment(postId, content);
      // Get the original post to preserve author info
      const originalPost = blogs.find(post => post._id === postId);
      if (originalPost) {
        setBlogs(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...updatedPost,
              author: originalPost.author // Keep the original author info
            };
          }
          return post;
        }));
      }
      toast.success("Comment added successfully");
    } catch (err) {
      console.error("Add comment failed:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const updatedPost = await blogService.deleteComment(postId, commentId);
      // Get the original post to preserve author info
      const originalPost = blogs.find(post => post._id === postId);
      if (originalPost) {
        setBlogs(prev => prev.map(post => {
          if (post._id === postId) {
            return {
              ...updatedPost,
              author: originalPost.author // Keep the original author info
            };
          }
          return post;
        }));
      }
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Delete comment failed:", err);
      toast.error("Failed to delete comment");
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
              <button
                onClick={() => router.push("/tutor/blog/create")}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <span className="mr-2">+New Post</span>
              </button>
            </div>
            
            {blogs.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-center">No blog posts available yet!</p>
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
        </div>
      </div>
    </div>
  );
};

export default TutorBlog;