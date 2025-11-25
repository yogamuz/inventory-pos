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

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      login: async (credentials) => {
        try {
          const response = await authApi.login(credentials);
          set({
            user: response.data.user,
            isAuthenticated: true,
            _hasHydrated: true, // ✅ SET HYDRATED SAAT LOGIN
          });
          return response;
        } catch (error) {
          throw error;
        }
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const response = await authApi.getMe();
          set({
            user: response.data,
            isAuthenticated: true,
            _hasHydrated: true, // ✅ SET HYDRATED SAAT CHECK AUTH
          });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuth;
