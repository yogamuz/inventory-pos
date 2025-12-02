// src/config/api.config.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = "/api/v1";

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // PENTING: Agar cookie dikirim otomatis
});
// Request interceptor untuk logging
apiClient.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (yang sudah ada, tapi tambahkan logging)
apiClient.interceptors.response.use(
  (response) => {

    return response.data;
  },
  (error) => {


    const errorMessage =
      error.response?.data?.message || error.message || "Terjadi kesalahan";

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Cek apakah sedang di halaman login atau endpoint auth
      const isAuthEndpoint = 
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/forgot-password") ||
        error.config?.url?.includes("/auth/reset-password");
      
      const isLoginPage = window.location.pathname === "/login";

      // Hanya redirect jika bukan dari auth endpoint dan bukan di halaman login
      if (!isAuthEndpoint && !isLoginPage) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);


export default apiClient;
