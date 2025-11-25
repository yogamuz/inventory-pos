// src/stores/useProductStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import productApi from "@/services/api/product.api";

const useProductStore = create(
  devtools(
    (set, get) => ({
      // State
      products: [],
      currentProduct: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      filters: {
        search: "",
        isActive: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      loading: false,
      error: null,

      // Actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 }, // Reset to page 1 on filter change
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

      // Fetch product by ID
      fetchProductById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await productApi.getProductById(id);
          set({ currentProduct: response.data, loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Create product
      createProduct: async (productData, imageFile) => {
        set({ loading: true, error: null });
        try {
          const response = await productApi.createProduct(
            productData,
            imageFile
          );

          // Refresh products list
          await get().fetchProducts();

          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Update product
      updateProduct: async (id, productData, imageFile) => {
        set({ loading: true, error: null });
        try {
          const response = await productApi.updateProduct(
            id,
            productData,
            imageFile
          );

          // ✅ Update products list dengan id yang benar
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? response.data : p
            ),
            currentProduct: response.data,
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Delete product
      deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          await productApi.deleteProduct(id);

          // Refresh products list
          await get().fetchProducts();

          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Hard delete product
      hardDeleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          await productApi.hardDeleteProduct(id);

          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            loading: false,
          }));
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

          // Update products list
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

          // Update products list
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

          // Update products list
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

      // Clear current product
      clearCurrentProduct: () => set({ currentProduct: null }),

      // Reset store
      reset: () =>
        set({
          products: [],
          currentProduct: null,
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0,
          },
          filters: {
            search: "",
            isActive: undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
          loading: false,
          error: null,
        }),
    }),
    { name: "ProductStore" }
  )
);

export default useProductStore;
