// src/hooks/useAuth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '@/services/api/auth.api';

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // Set user data
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Clear user data
      clearUser: () => set({ user: null, isAuthenticated: false }),

      // Login - PENTING: Jangan update state jika gagal!
      login: async (credentials) => {
        try {
          const response = await authApi.login(credentials);
          // Hanya update state jika berhasil
          set({ 
            user: response.data.user, 
            isAuthenticated: true 
          });
          return response;
        } catch (error) {
          // JANGAN set state di sini! Biarkan state tetap seperti sebelumnya
          // State yang tidak berubah = tidak ada re-render
          throw error; // Re-throw error agar bisa di-catch di component
        }
      },

      // Logout
      logout: async () => {
        await authApi.logout();
        set({ user: null, isAuthenticated: false });
      },

      // Check auth status
      checkAuth: async () => {
        try {
          const response = await authApi.getMe();
          set({ 
            user: response.data, 
            isAuthenticated: true 
          });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key name
      partialize: (state) => ({ 
        user: state.user, // Hanya simpan user data, bukan token
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuth;