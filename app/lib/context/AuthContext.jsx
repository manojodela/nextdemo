'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../auth/authService';
import { getAuthToken, getCurrentUser, isTokenExpired, setCurrentUser } from '../auth/tokens';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const storedUser = getCurrentUser();

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        const refreshResult = await authService.refreshToken();
        if (!refreshResult.success) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
      }

      // If we have stored user data, use it
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        // Fetch current user from server
        const userResult = await authService.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.user);
          setCurrentUser(userResult.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTokenExpiry = async () => {
    const token = getAuthToken();
    if (token && isTokenExpired(token)) {
      const refreshResult = await authService.refreshToken();
      if (!refreshResult.success) {
        logout();
      }
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setUser(result.user);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.logout();
    router.push('/login');
  };

  const refreshUser = async () => {
    const result = await authService.getCurrentUser();
    if (result.success) {
      setUser(result.user);
      setCurrentUser(result.user);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};