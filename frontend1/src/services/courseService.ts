import { API_URL } from './authService';

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  startDate: string;
  endDate: string;
  tutor: {
    _id: string;
    fullName: string;
  };
  students: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export const courseService = {
  // Lấy danh sách khóa học cho dashboard của student
  getStudentCourses: async (studentId: string, token: string): Promise<Course[]> => {
    try {
      const response = await fetch(`${API_URL}/api/v1/courses/student-dashboard/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  getCourseById: async (courseId: string, token: string): Promise<Course> => {
    try {
      const response = await fetch(`${API_URL}/api/v1/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch course details");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
}; 