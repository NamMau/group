import axios from 'axios';

export const API_URL = 'http://localhost:5000/api/v1';

export const authService = {
  // Lưu token
  setToken: (accessToken: string, refreshToken: string, user?: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // if (user) {
      //   localStorage.setItem('user', JSON.stringify(user));
      // }
      if (user) {
        // Đảm bảo có _id cho frontend sử dụng
        const transformedUser = {
          ...user,
          _id: user._id || user.id,
        };
        localStorage.setItem('user', JSON.stringify(transformedUser));
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
      return !!token;
    }
    return false;
  },

  // Lấy thông tin user
  // getUser: () => {
  //   try {
  //     const user = localStorage.getItem("user");
  //     if (!user) return null;
  //     const parsed = JSON.parse(user);
  //     // Đảm bảo luôn có _id trong đối tượng user
  //     return {
  //       ...parsed,
  //       _id: parsed._id || parsed.id,
  //     };
  //   } catch (error) {
  //     return null;
  //   }
  // },

  getUser: () => {
    try {
      const userString = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');

      if (!userString || !accessToken) return null;

      const user = JSON.parse(userString);

      return {
        ...user,
        token: accessToken,
      };
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens and user data
      authService.setToken(accessToken, refreshToken, user);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        throw new Error(errorMessage);
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