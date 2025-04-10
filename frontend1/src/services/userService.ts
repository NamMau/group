import { authService, API_URL } from './authService';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student extends User {
  personalTutor?: string;
}

export interface Tutor extends User {
  students?: string[];
  preferences?: Record<string, any>;
  loginHistory?: any[];
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  password?: string;
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

export class UserService {
  private getHeaders() {
    return {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json'
    };
  }

  // Tutor methods
  async createTutor(tutorData: Partial<Tutor>): Promise<Tutor> {
    try {
      const response = await fetch(`${API_URL}/auth/register/tutor`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tutorData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tutor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createTutor:', error);
      throw error;
    }
  }

  async createStudent(studentData: Partial<Student>): Promise<Student> {
    try {
      const response = await fetch(`${API_URL}/auth/register/student`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tutor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
  }

  async getTutors(): Promise<Tutor[]> {
    try {
      const response = await fetch(`${API_URL}/users/get-tutors`, {
        // headers: this.getHeaders(), 
        headers: {Authorization: `Bearer ${authService.getToken()}`
      },
      cache: 'no-store'
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tutors');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error in getTutors:', error);
      throw error;
    }
  }

  // Student methods
  async getStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_URL}/users/get-students`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        },
        cache: 'no-store'
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch students');
      }
  
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }  

  async getUser(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/update-user/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/delete-user/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  // Additional methods
  async getStudentStudyTime(studentId: string): Promise<StudyTime[]> {
    try {
      const response = await fetch(`${API_URL}/users/students/${studentId}/study-time`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch study time');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error in getStudentStudyTime:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/notifications`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch notifications');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/profile/${userId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(preferences: any): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/notification-preferences`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Error in updateNotificationPreferences:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch all users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async activateUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/activate`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to activate user');
      }
    } catch (error) {
      console.error('Error in activateUser:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/deactivate`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error in deactivateUser:', error);
      throw error;
    }
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/preferences`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/preferences`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateUserPreferences:', error);
      throw error;
    }
  }

  // Dashboard methods
  async getUserDashboard(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/dashboard`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user dashboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUserDashboard:', error);
      throw error;
    }
  }

  // Student specific methods
  async getStudentProgress(studentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/students/${studentId}/progress`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch student progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getStudentProgress:', error);
      throw error;
    }
  }

  async getEnrolledCourses(studentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/users/students/${studentId}/courses`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch enrolled courses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getEnrolledCourses:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 