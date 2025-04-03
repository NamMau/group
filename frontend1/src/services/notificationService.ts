import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface Notification {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  title: string;
  content: string;
  type: 'course' | 'meeting' | 'document' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const notificationService = {
  // Get all notifications
  getNotifications: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(
      `${API_URL}/notifications/mark-all-read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(
      `${API_URL}/notifications/${notificationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  }
}; 