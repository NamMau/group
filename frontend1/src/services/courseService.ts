import { authService, API_URL } from './authService';
import { userService } from './userService';
import { chatService } from './chatService';
import axios from 'axios';
import { User } from './userService';

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

      // First, get the tutor's courses
      const coursesResponse = await axios.get(`${API_URL}/courses/coursebytutor/${tutorId}`, {
        headers: authService.getAuthHeaders(),
      });

      if (!coursesResponse.data) {
        throw new Error('No data received from server');
      }

      const courses = Array.isArray(coursesResponse.data.data) 
        ? this.convertCourseArrayDates(coursesResponse.data.data)
        : [];

      // Calculate total students from courses
      const totalStudents = courses.reduce((total, course) => 
        total + (Array.isArray(course.students) ? course.students.length : 0), 0);

      // Get upcoming appointments (if available)
      let upcomingAppointments = [];
      try {
        const appointmentsResponse = await axios.get(`${API_URL}/appointments/tutor/${tutorId}/upcoming`, {
          headers: authService.getAuthHeaders(),
        });
        upcomingAppointments = appointmentsResponse.data.data || [];
      } catch (error) {
        console.warn('Could not fetch appointments:', error);
      }

      // Get recent messages using chatService
      const recentMessages = await chatService.getMessagesByTutor(tutorId, 5);

      // Return combined dashboard data
      return {
        totalStudents,
        totalCourses: courses.length,
        totalMessages: recentMessages.length,
        upcomingAppointments,
        recentMessages: recentMessages.map((msg: any) => ({
          _id: msg?._id || '',
          content: msg?.content || '',
          sender: msg?.sender ? {
            _id: msg.sender._id || '',
            fullName: msg.sender.fullName || '',
            email: msg.sender.email || ''
          } : {
            _id: '',
            fullName: '',
            email: ''
          },
          recipient: msg?.recipient ? {
            _id: msg.recipient._id || '',
            fullName: msg.recipient.fullName || '',
            email: msg.recipient.email || ''
          } : {
            _id: '',
            fullName: '',
            email: ''
          },
          createdAt: msg?.createdAt ? new Date(msg.createdAt) : new Date()
        })),
        courses
      };
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

  async getStudentDetails(studentIds: string[]): Promise<User[]> {
    try {
      const uniqueIds = Array.from(new Set(studentIds));
      const promises = uniqueIds.map(id => 
        fetch(`${API_URL}/users/${id}`, {
          headers: authService.getAuthHeaders(),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch student with ID ${id}`);
          }
          return response.json();
        })
      );

      const responses = await Promise.all(promises);
      return responses.map(data => data.data || data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  }

  async getStudentDashboard(studentId: string): Promise<any> {
    try {
      // First get enrolled courses
      const coursesResponse = await fetch(`${API_URL}/courses/${studentId}/courses`, {
        headers: authService.getAuthHeaders()
      });

      if (!coursesResponse.ok) {
        if (coursesResponse.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch enrolled courses');
      }

      const coursesData = await coursesResponse.json();
      const courses = Array.isArray(coursesData.data) ? coursesData.data : [];

      // Get study time data
      const studyTimeData = await this.getStudyTime(studentId);

      // Calculate course progress (temporary random values)
      const enrolledCourses = courses.map((course: any) => ({
        ...course,
        progress: course.progress || Math.floor(Math.random() * 100)
      }));

      return {
        student: await userService.getUser(studentId),
        studyTime: studyTimeData,
        enrolledCourses,
        upcomingClasses: [], // To be implemented if needed
        recentMessages: []   // To be implemented if needed
      };
    } catch (error) {
      console.error('Error getting student dashboard:', error);
      throw error;
    }
  }

  private async getStudyTime(studentId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/users/students/${studentId}/study-time`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting study time:', error);
      return [];
    }
  }
}

export const courseService = new CourseService();