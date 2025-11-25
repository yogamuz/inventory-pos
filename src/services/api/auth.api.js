// src/services/api/auth.api.js
import apiClient from '@/config/api.config';

const AUTH_ENDPOINT = '/auth';

const authApi = {
  // Login
  login: async (credentials) => {
    const { username, password } = credentials;
    return apiClient.post(`${AUTH_ENDPOINT}/login`, { username, password });
  },

  // Logout
  logout: async () => {
    return apiClient.delete(`${AUTH_ENDPOINT}/logout`);
  },

  // Get current user
  getMe: async () => {
    return apiClient.get(`${AUTH_ENDPOINT}/me`);
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiClient.post(`${AUTH_ENDPOINT}/forgot-password`, { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return apiClient.post(`${AUTH_ENDPOINT}/reset-password/${token}`, { password });
  },
};

export default authApi;