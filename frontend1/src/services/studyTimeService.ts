import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface StudyTimeData {
  day: string;
  hours: number;
}

export const studyTimeService = {
  // Get student's study time statistics
  getStudyTime: async (studentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/users/${studentId}/study-time`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get weekly study time statistics
//   getWeeklyStats: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_URL}/study-time/weekly`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data.data;
//   },

  // Get monthly study time statistics
//   getMonthlyStats: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_URL}/study-time/monthly`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data.data;
//   }
}; 