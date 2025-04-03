import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface BlogPost {
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
  tags: string[];
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
  shares: number;
  scheduledFor?: Date;
  createdAt: string;
  updatedAt: string;
}

interface CreateBlogData {
  title: string;
  content: string;
  course?: string;
  class?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'course' | 'private';
  featuredImage?: string;
  scheduledFor?: Date;
}

interface UpdateBlogData extends Partial<CreateBlogData> {}

export const blogService = {
  // Get all posts for a student
  getStudentBlogs: async (studentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/get-blogstudent/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blog by ID
  getBlogById: async (id: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/get-blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Create new post
  createPost: async (data: CreateBlogData) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/blogs/create-blog`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Update post
  updatePost: async (id: string, data: UpdateBlogData) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}/blogs/update-blog/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Like/Unlike post
  toggleLike: async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blogs/like-blog/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Add comment
  addComment: async (postId: string, content: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blogs/add-comment/${postId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Like/Unlike comment
  toggleCommentLike: async (postId: string, commentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blogs/like-comment/${postId}/comments/${commentId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(
      `${API_URL}/blogs/delete-comment/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete post
  deletePost: async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}/blogs/delete-blog/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Search blogs
  searchBlogs: async (query: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/search`, {
      params: { q: query },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by course
  getCourseBlogs: async (courseId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/course-blogs/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by class
  getClassBlogs: async (classId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/class-blogs/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by tag
  getBlogsByTag: async (tag: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blogs/tag-blogs/${tag}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Increment view count
  incrementViews: async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blogs/increment-views/${postId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
}; 