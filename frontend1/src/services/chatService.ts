import axios from 'axios';

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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get conversation with a specific user
  getConversation: async (userId: string): Promise<Message[]> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (recipientId: string, content: string): Promise<Message> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/messages/send-message/${recipientId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Get unread messages
  getUnreadMessages: async (): Promise<Message[]> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/messages/get-unread`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<Message> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(
      `${API_URL}/messages/markasread/${messageId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`${API_URL}/messages/delete/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get message statistics for chart
  getMessageStats: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const threads = response.data;
    const messagesByDate = threads.reduce((acc: any, thread: MessageThread) => {
      const message = thread.lastMessage;
      const date = new Date(message.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!acc[date]) {
        acc[date] = { sent: 0, received: 0 };
      }
      
      if (message.sender._id === localStorage.getItem('userId')) {
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
  }
}; 