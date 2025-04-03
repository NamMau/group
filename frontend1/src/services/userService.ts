import { API_URL } from './authService';

export interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  personalTutor: string | null;
  students: string[];
  department: string;
  phoneNumber: string;
  preferences: Record<string, any>;
  loginHistory: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  avatar?: string;
}

export interface UpdateStudentData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  password?: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface StudyTime {
  day: string;
  hours: number;
}

interface Notification {
  _id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

class UserService {
  async getTutors(token: string): Promise<Tutor[]> {
    try {
      console.log('API_URL:', API_URL);
      const response = await fetch(`${API_URL}/users/get-tutors`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch tutors');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Handle both response formats
      if (Array.isArray(data)) {
        console.log('Data is array, returning directly');
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        console.log('Data is wrapped in data property');
        return data.data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  }

  async getStudent(studentId: string, token: string): Promise<Student> {
    try {
      const response = await fetch(`${API_URL}/users/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error('Failed to fetch student data');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateStudent(studentId: string, data: UpdateStudentData, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/update-user/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update student');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(studentId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/delete-user/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete student');
      }
    } catch (error) {
      throw error;
    }
  }

  async getStudents(token: string): Promise<Student[]> {
    try {
      const response = await fetch(`${API_URL}/users/get-students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch students');
      }

      const data = await response.json();
      
      // Ensure we always return an array of students with proper data mapping
      return Array.isArray(data) ? data.map(student => ({
        _id: student._id,
        fullName: student.fullName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        department: student.department,
        avatar: student.avatar
      })) : [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Lấy thông tin thời gian học tập của sinh viên
  async getStudentStudyTime(studentId: string, token: string): Promise<StudyTime[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/students/${studentId}/study-time`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch study time data");
      }

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Study time data is missing or not in expected format");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin chi tiết của user
  async getUserProfile(userId: string, token: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch user profile");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin user
  async updateUserProfile(userId: string, userData: UserData, token: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update user profile");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Đổi mật khẩu
  async changePassword(userId: string, oldPassword: string, newPassword: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to change password");
      }
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách khóa học đã đăng ký của sinh viên
  async getEnrolledCourses(studentId: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/students/${studentId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch enrolled courses");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách bài tập đã nộp của sinh viên
  async getSubmittedAssignments(studentId: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/students/${studentId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch submitted assignments");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách điểm số của sinh viên
  async getStudentGrades(studentId: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/students/${studentId}/grades`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch student grades");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách thông báo của user
  async getUserNotifications(userId: string, token: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch user notifications");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(userId: string, notificationId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to mark notification as read");
      }
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService(); 