import Image from "next/image";
import { FiHeart, FiMessageCircle, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { blogService, BlogPost as BlogPostType } from "../../../services/blogService";
import { useRouter } from "next/navigation";

interface BlogPostProps {
  post: BlogPostType;
  onUpdate?: (updatedPost: BlogPostType) => void;
  onDelete?: (postId: string) => void;
  onToggleLike?: (postId: string) => Promise<void>;
  onAddComment?: (postId: string, content: string) => Promise<void>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<void>;
  currentUserId: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  post,
  onUpdate,
  onDelete,
  onToggleLike,
  onAddComment,
  onDeleteComment,
  currentUserId,
}) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await onToggleLike?.(post._id);
    } catch (error) {
      console.error('Error liking post:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete?.(post._id);
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setIsCommenting(true);
      await onAddComment?.(post._id, newComment);
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await onDeleteComment?.(post._id, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Handle error (show toast, etc.)
    }
  };

  const isLiked = post.likes.includes(currentUserId);
  const isAuthor = post.author._id === currentUserId;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName)}&background=random`}
            alt={`${post.author.fullName}'s avatar`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h4 className="font-semibold text-gray-900">{post.author.fullName}</h4>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Menu Button */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="More options"
            >
              <FiMoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4">
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {/* {post.featuredImage && (
        <div className="mt-4">
          <Image
            src={post.featuredImage}
            alt="Post Image: ${post.title}"
            width={800}
            height={400}
            className="w-full object-cover"
          />
        </div>
      )} */}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 mt-2 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes.length}</span>
            </button>
            <button
              onClick={() => router.push(`/student/blog/${post._id}`)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <FiMessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </button>
            <span className="text-gray-500 text-sm">
              {post.views} views
            </span>
          </div>
        </div>
      </div>
      {/* Comments section */}
      <div className="p-4">
        <div className="mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="border p-2 w-full rounded-md"
          />
          <button
            onClick={handleAddComment}
            disabled={isCommenting}
            className="mt-2 bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
          >
            Post
          </button>
        </div>
        {post.comments.map((comment) => (
          <div key={comment._id} className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{comment.author.fullName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              {comment.author._id === currentUserId && onDeleteComment && (
                <button
                  onClick={() => onDeleteComment(post._id, comment._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;