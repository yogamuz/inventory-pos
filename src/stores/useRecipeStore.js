// src/stores/useRecipeStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import recipeApi from "@/services/api/recipe.api";
import useProductStore from "@/stores/useProductStore";
const useRecipeStore = create(
  devtools(
    (set, get) => ({
      // State
      availability: [], // [{ product, canMake, maxPortions, missingIngredients }]
      currentRecipe: null, // { product, ingredients: [...] }
      loading: false,
      recipeLoading: false,
      error: null,

      // Fetch availability for all menus
      fetchAvailability: async () => {
        set({ loading: true, error: null });
        try {
          const response = await recipeApi.getMenuAvailability();
          set({ availability: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Fetch recipe for a specific product
      fetchRecipeByProductId: async (productId) => {
        set({ recipeLoading: true, error: null });
        try {
          const response = await recipeApi.getRecipeByProductId(productId);
          set({ currentRecipe: response.data, recipeLoading: false });
          return response.data;
        } catch (error) {
          // 404 = belum ada resep, bukan error kritis
          set({
            currentRecipe: { product: null, ingredients: [] },
            recipeLoading: false,
          });
        }
      },

      // Set (replace) entire recipe
      setRecipe: async (productId, ingredients) => {
        set({ recipeLoading: true, error: null });
        try {
          const response = await recipeApi.setRecipe(productId, ingredients);
          set({ currentRecipe: response.data, recipeLoading: false });

          // Refresh availability setelah resep diubah
          await get().fetchAvailability();
          await useProductStore.getState().fetchProducts();
          return response.data;
        } catch (error) {
          set({ error: error.message, recipeLoading: false });
          throw error;
        }
      },

      // Add single ingredient
      addIngredient: async (productId, rawMaterialId, quantityPerUnit) => {
        set({ recipeLoading: true, error: null });
        try {
          await recipeApi.addIngredient(
            productId,
            rawMaterialId,
            quantityPerUnit,
          );

          // Refresh recipe
          await get().fetchRecipeByProductId(productId);
          await get().fetchAvailability();
          await useProductStore.getState().fetchProducts();
        } catch (error) {
          set({ error: error.message, recipeLoading: false });
          throw error;
        }
      },

      // Update single ingredient
      updateIngredient: async (recipeId, quantityPerUnit, productId) => {
        set({ recipeLoading: true, error: null });
        try {
          await recipeApi.updateIngredient(recipeId, quantityPerUnit);

          // Refresh recipe
          await get().fetchRecipeByProductId(productId);
          await get().fetchAvailability();
          await useProductStore.getState().fetchProducts();
        } catch (error) {
          set({ error: error.message, recipeLoading: false });
          throw error;
        }
      },

      // Remove single ingredient
      removeIngredient: async (recipeId, productId) => {
        set({ recipeLoading: true, error: null });
        try {
          await recipeApi.removeIngredient(recipeId);

          // Refresh recipe
          await get().fetchRecipeByProductId(productId);
          await get().fetchAvailability();
          await useProductStore.getState().fetchProducts();
        } catch (error) {
          set({ error: error.message, recipeLoading: false });
          throw error;
        }
      },

      // Clear current recipe
      clearCurrentRecipe: () => set({ currentRecipe: null }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    { name: "RecipeStore" },
  ),
);

export default useRecipeStore;
