import { authService, API_URL } from './authService';

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  personalTutor?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

class StudentService {
  async createStudent(studentData: Partial<Student>): Promise<Student> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/api/v1/auth/register/student`, {
        method: 'POST',
        headers,
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
  }

  async getStudent(studentId: string): Promise<Student> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${studentId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch student');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getStudent:', error);
      throw error;
    }
  }

  async updateStudent(studentId: string, studentData: Partial<Student>): Promise<Student> {
    try {
      const headers = {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_URL}/api/v1/users/update-user/${studentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update student');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateStudent:', error);
      throw error;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/get-students`, {
        headers: authService.getAuthHeaders(),
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAllStudents:', error);
      throw error;
    }
  }

  async deleteStudent(studentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/delete-user/${studentId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.removeToken();
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error in deleteStudent:', error);
      throw error;
    }
  }
}

export const studentService = new StudentService(); 