import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:5000/api/v1/appointments';

export interface Appointment {
  _id?: string;
  title: string;
  description?: string;
  tutor: string | { _id: string; fullName: string; }; // Could be just ID or populated object
  student: string | { _id: string; fullName: string; email: string; }; // Could be just ID or populated object
  date: string; // ISO format date string
  startTime: string;
  endTime: string;
  type: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  location?: 'startup room' | 'main office' | 'college office';
  meetingLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const appointmentService = {
  createAppointment: async (appointmentData: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Appointment> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.post(`${API_URL}/create-appointment`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw error.response?.data?.message || 'Failed to create appointment';
    }
  },

  getAppointmentsByStudent: async (studentId: string): Promise<Appointment[]> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_URL}/get-student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching student appointments:', error);
      throw error.response?.data?.message || 'Failed to fetch appointments';
    }
  },

  getAppointmentsByTutor: async (tutorId: string): Promise<Appointment[]> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_URL}/tutor/${tutorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
      //return response.data;
    } catch (error: any) {
      console.error('Error fetching tutor appointments:', error);
      throw error.response?.data?.message || 'Failed to fetch appointments';
    }
  },

  getAppointmentById: async (appointmentId: string): Promise<Appointment> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_URL}/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching appointment by ID:', error);
      throw error.response?.data?.message || 'Failed to fetch appointment';
    }
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Appointment> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.patch(`${API_URL}/${appointmentId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating appointment status:', error);
      throw error.response?.data?.message || 'Failed to update appointment status';
    }
  },

  deleteAppointment: async (appointmentId: string): Promise<void> => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    try {
      await axios.delete(`${API_URL}/delete-appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw error.response?.data?.message || 'Failed to delete appointment';
    }
  },
};