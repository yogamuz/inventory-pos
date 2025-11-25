// src/hooks/useAuth.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "@/services/api/auth.api";

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // Set user data
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      login: async (credentials) => {
        try {
          const response = await authApi.login(credentials);
          set({
            user: response.data.user,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          throw error;
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
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // LocalStorage key name
      partialize: (state) => ({
        user: state.user, // Hanya simpan user data, bukan token
        isAuthenticated: state.isAuthenticated,
      }),
      // ✅ TAMBAHKAN INI - Callback saat hydration selesai
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuth;
