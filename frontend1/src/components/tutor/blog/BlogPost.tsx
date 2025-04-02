"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaEye, FaTag, FaLock } from "react-icons/fa";
import { blogService } from "../../../services/blogService";

interface BlogPostProps {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  course?: {
    _id: string;
    name: string;
  };
  class?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'course' | 'private';
  featuredImage?: string;
  likes: string[];
  comments: {
    _id: string;
    author: {
      _id: string;
      fullName: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
    likes: string[];
  }[];
  views: number;
  scheduledFor?: string;
  createdAt: string;
  onUpdate?: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  _id, 
  title,
  content, 
  author, 
  course,
  class: classInfo,
  tags,
  status,
  visibility,
  featuredImage,
  likes, 
  comments,
  views,
  scheduledFor,
  createdAt,
  onUpdate 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user has liked the post
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    if (userId && likes.includes(userId)) {
      setIsLiked(true);
    }
  }, [userId, likes]);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      await blogService.toggleLike(_id);
      setIsLiked(!isLiked);
      onUpdate?.();
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      await blogService.addComment(_id, newComment);
      setNewComment("");
      setShowComments(true);
      onUpdate?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/blog/${_id}`;
      await navigator.clipboard.writeText(shareUrl);
      // You might want to show a success notification here
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <FaEye className="text-green-500" />;
      case 'course':
        return <FaTag className="text-blue-500" />;
      case 'private':
        return <FaLock className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Image
            src={author.avatar || '/default-avatar.png'}
            alt={author.fullName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h4 className="font-semibold text-gray-800">{author.fullName}</h4>
            <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getVisibilityIcon(visibility)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>

      {/* Course/Class Info */}
      {(course || classInfo) && (
        <div className="text-sm text-gray-600 mb-2">
          {course && <span>Course: {course.name}</span>}
          {classInfo && <span className="ml-2">Class: {classInfo.name}</span>}
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <p className="text-gray-700 mb-3">{content}</p>

      {/* Featured Image */}
      {featuredImage && (
        <div className="mt-3">
          <Image
            src={featuredImage}
            alt="Featured Image"
            width={500}
            height={300}
            className="w-full rounded-md object-cover"
          />
        </div>
      )}

      {/* Interaction Tools */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center space-x-1 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
          >
            <FaHeart className={isLiked ? 'fill-current' : ''} />
            <span>{likes.length}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaComment />
            <span>{comments.length}</span>
          </button>

          <div className="flex items-center space-x-1 text-gray-500">
            <FaEye />
            <span>{views}</span>
          </div>

          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
          >
            <FaShare />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment._id} className="flex space-x-2">
                <Image
                  src={comment.author.avatar || '/default-avatar.png'}
                  alt={comment.author.fullName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 bg-gray-50 rounded-lg p-2">
                  <p className="font-medium text-sm">{comment.author.fullName}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <FaHeart className="text-xs text-gray-500" />
                      <span className="text-xs text-gray-500">{comment.likes.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
