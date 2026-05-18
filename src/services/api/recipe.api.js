// src/services/api/recipe.api.js
import apiClient from "@/config/api.config";

const RECIPE_ENDPOINT = "/recipes";

const recipeApi = {
  // Get all recipes grouped by product
  getAllRecipes: () => {
    return apiClient.get(RECIPE_ENDPOINT);
  },

  // Get recipe by product ID
  getRecipeByProductId: (productId) => {
    return apiClient.get(`${RECIPE_ENDPOINT}/product/${productId}`);
  },

  // Get all menus availability
  getMenuAvailability: () => {
    return apiClient.get(`${RECIPE_ENDPOINT}/availability`);
  },

  // Check availability for specific product
  checkAvailability: (productId, quantity = 1) => {
    return apiClient.get(
      `${RECIPE_ENDPOINT}/availability/${productId}?quantity=${quantity}`
    );
  },

  // Set (replace) entire recipe for a product
  setRecipe: (productId, ingredients) => {
    return apiClient.put(`${RECIPE_ENDPOINT}/product/${productId}`, {
      ingredients,
    });
  },

  // Add single ingredient
  addIngredient: (productId, rawMaterialId, quantityPerUnit) => {
    return apiClient.post(RECIPE_ENDPOINT, {
      productId,
      rawMaterialId,
      quantityPerUnit,
    });
  },

  // Update single ingredient quantity
  updateIngredient: (id, quantityPerUnit) => {
    return apiClient.put(`${RECIPE_ENDPOINT}/${id}`, { quantityPerUnit });
  },

  // Remove single ingredient
  removeIngredient: (id) => {
    return apiClient.delete(`${RECIPE_ENDPOINT}/${id}`);
  },
};

export default recipeApi;