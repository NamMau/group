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
  //featuredImage?: string;
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
  //featuredImage?: string;
  scheduledFor?: Date;
}

export interface UpdateBlogData {
  title: string;
  content: string;
  tags: string[];
  visibility: 'public' | 'course' | 'private';
  //featuredImage: string;
}


// interface UpdateBlogData extends Partial<CreateBlogData> {}

export const blogService = {
   // Get all blog posts
   getAllBlogs: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/get-all-blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get all posts for a student
  getStudentBlogs: async (studentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/get-blogstudent/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blog by ID
  getBlogById: async (id: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/get-blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Create new post
  createPost: async (data: CreateBlogData) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/blog/create-blog`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Update post
  updatePost: async (id: string, data: UpdateBlogData) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}/blog/update-blog/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Like/Unlike post
  toggleLike: async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blog/like-blog/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Add comment
  addComment: async (postId: string, content: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blog/add-comment/${postId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Like/Unlike comment
  toggleCommentLike: async (postId: string, commentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blog/like-comment/${postId}/comments/${commentId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(
      `${API_URL}/blog/delete-comment/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete post
  deletePost: async (postId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.delete(`${API_URL}/blog/delete-blog/${postId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('Failed to delete post');
      }

      return response.data;
    } catch (error) {
      console.error('Error in deletePost:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Authentication required');
        } else if (error.response?.status === 403) {
          throw new Error('Not authorized to delete this post');
        } else if (error.response?.status === 404) {
          throw new Error('Post not found');
        }
      }
      throw error;
    }
  },

  // Search blogs
  searchBlogs: async (query: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/search`, {
      params: { q: query },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by course
  getCourseBlogs: async (courseId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/course-blogs/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by class
  getClassBlogs: async (classId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/class-blogs/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get blogs by tag
  getBlogsByTag: async (tag: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/blog/tag-blogs/${tag}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Increment view count
  incrementViews: async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/blog/increment-views/${postId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
}; 