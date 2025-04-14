import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:5000/api/v1';

export interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    email: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  relatedTo?: {
    type: 'course' | 'meeting' | 'document' | 'blog';
    id: string;
  };
}

export interface MessageThread {
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const chatService = {
  // Get all message threads
  getMessageThreads: async (): Promise<MessageThread[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/threads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching message threads:', error);
      return [];
    }
  },

  // Get conversation with a specific user
  getConversation: async (userId: string): Promise<Message[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  },

  // Send a message
  sendMessage: async (recipientId: string, content: string): Promise<Message | null> => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const response = await axios.post(
        `${API_URL}/messages/send-message/${recipientId}`,
        { receiverId: recipientId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw the error so components can handle it
    }
  },

  // Get unread messages
  getUnreadMessages: async (): Promise<Message[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/get-unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      return [];
    }
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<Message | null> => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const response = await axios.put(
        `${API_URL}/messages/markasread/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return null;
    }
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<boolean> => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      await axios.delete(`${API_URL}/messages/delete/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  },

  // Get message statistics for chart
  getMessageStats: async () => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/threads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const threads = response.data;
      const user = authService.getUser();
      const userId = user?.userId;

      const messagesByDate = threads.reduce((acc: any, thread: MessageThread) => {
        const message = thread.lastMessage;
        const date = new Date(message.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!acc[date]) {
          acc[date] = { sent: 0, received: 0 };
        }
        
        if (message.sender._id === userId) {
          acc[date].sent++;
        } else {
          acc[date].received++;
        }
        
        return acc;
      }, {});

      return Object.entries(messagesByDate).map(([date, stats]: [string, any]) => ({
        date,
        sent: stats.sent,
        received: stats.received
      }));
    } catch (error) {
      console.error('Error fetching message stats:', error);
      return [];
    }
  },

  // Get messages by tutor
  getMessagesByTutor: async (tutorId: string, limit: number = 5): Promise<Message[]> => {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get(
        `${API_URL}/messages/get-messages-by-tutor/${tutorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching tutor messages:', error);
      return [];
    }
  }
};