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
      isInitializing: true, // ✅ TAMBAH INI

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
            _hasHydrated: true,
            isInitializing: false, // ✅ TAMBAH
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
        set({ isInitializing: true }); // ✅ TAMBAH
        try {
          const response = await authApi.getMe();
          set({
            user: response.data,
            isAuthenticated: true,
            _hasHydrated: true,
            isInitializing: false, // ✅ TAMBAH
          });
          return true;
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            isInitializing: false, // ✅ TAMBAH
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        _hasHydrated: state._hasHydrated,
        // isInitializing TIDAK di-persist
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuth;