import axios from 'axios';

export const API_URL = 'http://localhost:5000/api/v1';

export const authService = {
  // Lưu token
  setToken: (accessToken: string, refreshToken: string, user?: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // Thêm thông tin user vào localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  },

  // Lấy token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Lấy refresh token
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  // Xóa token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Kiểm tra token có tồn tại
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      return !!token && !!user;
    }
    return false;
  },

  // Lấy thông tin user
  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      console.log('Login response:', response.data); // Log để debug

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Invalid response from server');
      }

      // Store tokens
      authService.setToken(accessToken, refreshToken, user);
      console.log('Tokens stored successfully'); // Log để debug

      return response.data;
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, {
          refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.removeToken();
    }
  },

  // Lấy headers với token
  getAuthHeaders: () => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },
}; 