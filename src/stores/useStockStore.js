// src/stores/useStockStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import productApi from "@/services/api/product.api";

const useStockStore = create(
  devtools(
    (set, get) => ({
      // State
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      filters: {
        search: "",
        isActive: true, // Default hanya produk aktif
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

      // Fetch all products
      fetchProducts: async () => {
        const { products } = get();

        if (products.length === 0) {
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

          const response = await productApi.getAllProducts(params);

          set({
            products: response.data.products,
            pagination: response.data.pagination,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Restock product
      restockProduct: async (id, quantity) => {
        set({ loading: true, error: null });
        try {
          const response = await productApi.restockProduct(id, quantity);

          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? response.data : p
            ),
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Record sale
      recordSale: async (id, quantity) => {
        set({ loading: true, error: null });
        try {
          const response = await productApi.recordSale(id, quantity);

          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? response.data : p
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
          const response = await productApi.adjustStock(id, stock, notes);

          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? response.data : p
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
          products: [],
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
    { name: "StockStore" }
  )
);

export default useStockStore;
