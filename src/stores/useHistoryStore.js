// src/stores/useHistoryStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import historyApi from "@/services/api/history.api";

const useHistoryStore = create(
  devtools(
    (set, get) => ({
      // State
      history: [],
      stats: {
        totalRestock: 0,
        totalUsage: 0,
        totalAdjustment: 0,
        quantityRestocked: 0,
        quantityUsed: 0,
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
      filters: {
        rawMaterialName: "",
        type: "",
        today: false,
      },
      loading: false,
      error: null,

      // Actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      setPage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
      },

      // Fetch all raw material history
      fetchHistory: async () => {
        const { history: historyData } = get();

        if (historyData.length === 0) {
          set({ loading: true, error: null });
        } else {
          set({ error: null });
        }

        try {
          const { filters, pagination } = get();

          const params = {
            page: pagination.page,
            limit: pagination.limit,
          };

          if (filters.rawMaterialName) params.rawMaterialName = filters.rawMaterialName;
          if (filters.type) params.type = filters.type;
          if (filters.today) params.today = filters.today;

          const response = await historyApi.getRawMaterialHistory(params);

          set({
            history: response.data.history,
            pagination: response.data.pagination,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Fetch stats
      fetchStats: async () => {
        try {
          const { filters } = get();
          const params = {};
          if (filters.today) params.today = filters.today;

          const response = await historyApi.getRawMaterialHistoryStats(params);
          set({ stats: response.data });
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () =>
        set({
          history: [],
          stats: {
            totalRestock: 0,
            totalUsage: 0,
            totalAdjustment: 0,
            quantityRestocked: 0,
            quantityUsed: 0,
          },
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
          },
          filters: {
            rawMaterialName: "",
            type: "",
            today: false,
          },
          loading: false,
          error: null,
        }),
    }),
    { name: "HistoryStore" }
  )
);

export default useHistoryStore;