import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export interface RelatedTo {
  type: 'course' | 'meeting' | 'document' | 'blog';
  id: string;
}

export interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  isRead: boolean;
  attachments?: Attachment[];
  relatedTo?: RelatedTo;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    attachments?: Attachment[];
    relatedTo?: RelatedTo;
  };
  unreadCount: number;
}

export const messageService = {
  // Get all message threads (conversations)
  getMessageThreads: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get conversation with a specific user
  getConversation: async (userId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Send a message
  sendMessage: async (userId: string, content: string, attachments?: Attachment[], relatedTo?: RelatedTo) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/messages/send-message/${userId}`,
      { content, attachments, relatedTo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/messages/markasread/${messageId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Delete a message
  deleteMessage: async (messageId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/messages/delete/${messageId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  },

  // Get unread messages count
  getUnreadMessages: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/messages/get-unread`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
}; 