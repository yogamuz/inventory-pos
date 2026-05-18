// src/stores/useRawMaterialStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import rawMaterialApi from "@/services/api/rawMaterial.api";

const useRawMaterialStore = create(
  devtools(
    (set, get) => ({
      // State
      rawMaterials: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      filters: {
        search: "",
        isActive: true,
        sortBy: "createdAt",
        sortOrder: "desc",
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

      // Fetch all raw materials
      fetchRawMaterials: async () => {
        const { rawMaterials } = get();

        if (rawMaterials.length === 0) {
          set({ loading: true, error: null });
        } else {
          set({ error: null });
        }

        try {
          const { filters, pagination } = get();
          const params = {
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
          };

          const response = await rawMaterialApi.getAllRawMaterials(params);

          set({
            rawMaterials: response.data.rawMaterials,
            pagination: response.data.pagination,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Restock raw material
      restockRawMaterial: async (id, quantity) => {
        set({ loading: true, error: null });
        try {
          const response = await rawMaterialApi.restockRawMaterial(
            id,
            quantity,
          );

          set((state) => ({
            rawMaterials: state.rawMaterials.map((rm) =>
              rm.id === id ? response.data : rm,
            ),
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Record usage
      recordUsage: async (id, quantity, notes) => {
        set({ loading: true, error: null });
        try {
          const response = await rawMaterialApi.recordUsage(
            id,
            quantity,
            notes,
          );

          set((state) => ({
            rawMaterials: state.rawMaterials.map((rm) =>
              rm.id === id ? response.data : rm,
            ),
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Adjust stock
      adjustStock: async (id, stock, notes) => {
        set({ loading: true, error: null });
        try {
          const response = await rawMaterialApi.adjustStock(id, stock, notes);

          set((state) => ({
            rawMaterials: state.rawMaterials.map((rm) =>
              rm.id === id ? response.data : rm,
            ),
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteRawMaterial: async (id) => {
        set({ loading: true, error: null });
        try {
          await rawMaterialApi.deleteRawMaterial(id);

          set((state) => ({
            rawMaterials: state.rawMaterials.filter((rm) => rm.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Create raw material
      createRawMaterial: async (formData) => {
        set({ loading: true, error: null });
        try {
          await rawMaterialApi.createRawMaterial(formData);
          await get().fetchRawMaterials();
        } catch (error) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Gagal membuat bahan mentah";
          set({ error: message, loading: false });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },

      updateRawMaterial: async (id, formData) => {
        set({ loading: true, error: null });
        try {
          const response = await rawMaterialApi.updateRawMaterial(id, formData);

          set((state) => ({
            rawMaterials: state.rawMaterials.map((rm) =>
              rm.id === id ? response.data : rm,
            ),
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () =>
        set({
          rawMaterials: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0,
          },
          filters: {
            search: "",
            isActive: true,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
          loading: false,
          error: null,
        }),
    }),
    { name: "RawMaterialStore" },
  ),
);

export default useRawMaterialStore;
