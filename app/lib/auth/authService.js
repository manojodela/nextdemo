import axiosClient from '../api/axiosClient';
import { setAuthToken, removeAuthToken, getAuthToken } from './tokens';

export class AuthService {
  async login(credentials) {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      if (token) {
        setAuthToken(token);
        return { success: true, user, token };
      }
      
      return { success: false, error: 'No token received' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  async register(userData) {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      const { token, user } = response.data;
      
      if (token) {
        setAuthToken(token);
        return { success: true, user, token };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }

  async logout() {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      // Redirect to login
      window.location.href = '/login';
    }
  }

  async refreshToken() {
    try {
      const response = await axiosClient.post('/auth/refresh');
      const { token } = response.data;
      
      if (token) {
        setAuthToken(token);
        return { success: true, token };
      }
      
      return { success: false };
    } catch (error) {
      removeAuthToken();
      return { success: false };
    }
  }

  async getCurrentUser() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await axiosClient.get('/auth/me');
      return { success: true, user: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        removeAuthToken();
      }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get user' 
      };
    }
  }

  async verifyToken() {
    try {
      const token = getAuthToken();
      if (!token) return false;

      const response = await axiosClient.post('/auth/verify');
      return response.data.valid;
    } catch (error) {
      removeAuthToken();
      return false;
    }
  }
}

export const authService = new AuthService();