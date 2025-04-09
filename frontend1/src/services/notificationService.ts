import axios, { AxiosError } from "axios";
import { authService } from "./authService"; // To get token from authService

// Define the base URL for the notification-related API
const BASE_URL = 'http://localhost:5000/api/v1/notifications';

// 1. Define and export the interface
export interface AppNotification {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string; // Optional property if it exists in your API
}

// Helper function to get the Authorization token
const getAuthToken = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error("User is not authenticated.");
  }
  return token;
};

// 2. Fetch Notifications
export const fetchNotifications = async (): Promise<AppNotification[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.data || [];
  } catch (err: unknown) {
    // Type 'unknown' error as AxiosError
    if (err instanceof AxiosError) {
      console.error("Error fetching notifications:", err);
      throw new Error(err.response?.data?.message || "Failed to fetch notifications");
    }
    throw new Error("Unknown error occurred while fetching notifications");
  }
};

// 3. Mark Notification as Read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.post(
      `${BASE_URL}/mark-read`,
      { notificationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err: unknown) {
    // Type 'unknown' error as AxiosError
    if (err instanceof AxiosError) {
      console.error("Error marking notification as read:", err);
      throw new Error(err.response?.data?.message || "Failed to mark notification as read");
    }
    throw new Error("Unknown error occurred while marking notification as read");
  }
};

// 4. Create Notification (Optional)
export const createNotification = async (userId: string, message: string): Promise<void> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      BASE_URL,
      { user: userId, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err: unknown) {
    // Type 'unknown' error as AxiosError
    if (err instanceof AxiosError) {
      console.error("Error creating notification:", err);
      throw new Error(err.response?.data?.message || "Failed to create notification");
    }
    throw new Error("Unknown error occurred while creating notification");
  }
};

export const notificationService = {
  fetchNotifications,
  markNotificationAsRead,
  createNotification
};