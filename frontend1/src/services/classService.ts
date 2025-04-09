import { authService } from './authService';

// Thêm từ khóa export cho interface Class
export interface Class {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  tutor: string;
  courses: string[];
  status?: 'not_started' | 'ongoing' | 'finished' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

interface ClassFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  tutor: string;
  courses: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const classService = {
  // Get all classes
  async getAllClasses(): Promise<Class[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_URL}/classes/get-all-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  },

  // Get class by ID
  async getClassById(classId: string): Promise<Class | null> {
    try {
      const token = authService.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/classes/get-class-by/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch class');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching class:', error);
      return null;
    }
  },

  // Create new class
  async createClass(classData: ClassFormData): Promise<Class | null> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/classes/create-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create class');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  // Update class
  async updateClass(classId: string, classData: Partial<ClassFormData>): Promise<Class | null> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/classes/update-class/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update class');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  // Delete class
  async deleteClass(classId: string): Promise<boolean> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/classes/delete-class/${classId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      return true;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },

  // Get available courses for class creation
  async getAvailableCourses(): Promise<{ _id: string; name: string }[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_URL}/courses/get-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available courses');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching available courses:', error);
      return [];
    }
  },

  // Get available tutors
  async getAvailableTutors(): Promise<{ _id: string; fullName: string }[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_URL}/users/get-tutors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available tutors');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching available tutors:', error);
      return [];
    }
  }
};