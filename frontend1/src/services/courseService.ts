import { authService, API_URL } from './authService';
import { userService } from './userService';
import axios from 'axios';

export interface Course {
  _id: string;
  name: string;
  description?: string;
  category: 'Web Development' | 'Frontend' | 'JavaScript' | 'Python' | 'UI/UX' | 'React' | 'Bootstrap';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  startDate: Date | null; // Cho phép null/undefined từ API
  endDate: Date | null;   // Cho phép null/undefined từ API
  tutor: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  // students?: {
  //   _id: string;
  //   fullName: string;
  //   email?: string;
  // }[];
  students: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
  createdAt: Date | null; // Cho phép null/undefined từ API
  updatedAt: Date | null; // Cho phép null/undefined từ API
}

class CourseService {
  private convertCourseDates(course: any): Course {
    return {
      ...course,
      startDate: course.startDate ? new Date(course.startDate) : null,
      endDate: course.endDate ? new Date(course.endDate) : null,
      createdAt: course.createdAt ? new Date(course.createdAt) : null,
      updatedAt: course.updatedAt ? new Date(course.updatedAt) : null,
    } as Course;
  }

  private convertCourseArrayDates(courses: any[]): Course[] {
    return courses.map(course => this.convertCourseDates(course));
  }

  async getTutorDashboard(tutorId: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/courses/tutor-dashboard/${tutorId}`, {
        headers: authService.getAuthHeaders(),
      });

      if (response.data.data && Array.isArray(response.data.data.courses)) {
        response.data.data.courses = this.convertCourseArrayDates(response.data.data.courses);
      } else if (response.data.data) {
        response.data.data = this.convertCourseDates(response.data.data);
      }

      return response.data.data;
    } catch (error) {
      console.error('Error getting tutor dashboard:', error);
      throw error;
    }
  }

  async enrollInCourse(courseId: string, studentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/enroll/${courseId}`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to enroll in course');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in enrollInCourse:', error);
      throw error;
    }
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/courses/${userId}/courses`, {
        headers: authService.getAuthHeaders(),
      });

      return this.convertCourseArrayDates(response.data.data);
    } catch (error) {
      console.error('Error getting courses for student:', error);
      throw error;
    }
  }

  async getCoursesByTutor(tutorId: string): Promise<Course[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/courses/coursebytutor/${tutorId}`, {
        headers: authService.getAuthHeaders(),
      });

      return this.convertCourseArrayDates(response.data.data);
    } catch (error) {
      console.error('Error getting courses by tutor:', error);
      throw error;
    }
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/courses/create-course`, {
        method: 'POST',
        headers,
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create course');
      }

      const data = await response.json();
      return this.convertCourseDates(data);
    } catch (error) {
      console.error('Error in createCourse:', error);
      throw error;
    }
  }

  async getCourse(courseId: string): Promise<Course> {
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch course');
      }

      const data = await response.json();
      return this.convertCourseDates(data);
    } catch (error) {
      console.error('Error in getCourse:', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/courses/update-course/${courseId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update course');
      }

      const data = await response.json();
      return this.convertCourseDates(data);
    } catch (error) {
      console.error('Error in updateCourse:', error);
      throw error;
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_URL}/courses/get-courses`, {
        headers: authService.getAuthHeaders(),
        cache: 'no-store'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch courses');
      }

      const data = await response.json();
      return Array.isArray(data) ? this.convertCourseArrayDates(data) : [];
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/courses/delete-course/${courseId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();