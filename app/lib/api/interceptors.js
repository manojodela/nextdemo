const { getAuthToken, removeAuthToken } = require("../utils/storage");
const { default: axiosClient } = require("./axiosClient");

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { startTime: new Date() };
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Log response time
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      removeAuthToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden');
    }

    // Retry logic for network errors
    if (!error.response && originalRequest._retryCount < 3) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      originalRequest._retryCount++;
      
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axiosClient(originalRequest);
    }

    // Log errors
    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });

    return Promise.reject(error);
  }
);