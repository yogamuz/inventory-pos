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

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Terjadi kesalahan";

    // Handle specific error codes
    if (error.response?.status === 401) {
      // ✅ PERBAIKAN: Hanya redirect jika BUKAN dari endpoint login
      const isLoginEndpoint = error.config?.url?.includes("/auth/login");

      if (!isLoginEndpoint) {
        // Redirect ke login jika unauthorized (kecuali dari login page)
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);



export default apiClient;
