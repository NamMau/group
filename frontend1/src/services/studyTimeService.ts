import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:5000/api/v1';

export interface StudyTimeData {
  day: string;
  hours: number;
}

export const studyTimeService = {
  // Get student's study time statistics
  getStudyTime: async (studentId: string): Promise<StudyTimeData[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/users/students/${studentId}/study-time`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid study time data format:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching study time:', error);
      return [];
    }
  },

  // Get weekly study time statistics
  getWeeklyStats: async (): Promise<StudyTimeData[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/study-time/weekly`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid weekly stats data format:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      return [];
    }
  },

  // Get monthly study time statistics
  getMonthlyStats: async (): Promise<StudyTimeData[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/study-time/monthly`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid monthly stats data format:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }
  }
}; 