// src/services/api/rawMaterial.api.js
import apiClient from "@/config/api.config";

const rawMaterialApi = {
  // Get all raw materials
  getAllRawMaterials: (params) => {
    return apiClient.get("/raw-materials", { params });
  },

  // Get raw material by ID
  getRawMaterialById: (id) => {
    return apiClient.get(`/raw-materials/${id}`);
  },

  // Create raw material
  createRawMaterial: (formData) => {
    return apiClient.post("/raw-materials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update raw material
  updateRawMaterial: (id, formData) => {
    return apiClient.put(`/raw-materials/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Soft delete
  deleteRawMaterial: (id) => {
    return apiClient.delete(`/raw-materials/${id}`);
  },

  // Hard delete
  hardDeleteRawMaterial: (id) => {
    return apiClient.delete(`/raw-materials/${id}/hard`);
  },

  // Restock
  restockRawMaterial: (id, quantity) => {
    return apiClient.post(`/raw-materials/${id}/restock`, { quantity });
  },

  // Record usage
  recordUsage: (id, quantity, notes) => {
    return apiClient.post(`/raw-materials/${id}/usage`, { quantity, notes });
  },

  // Adjust stock
  adjustStock: (id, stock, notes) => {
    return apiClient.patch(`/raw-materials/${id}/adjust`, { stock, notes });
  },

  // Dashboard stats
  getDashboardStats: () => {
    return apiClient.get("/raw-materials/stats");
  },

  // Low stock
  getLowStockRawMaterials: (threshold) => {
    return apiClient.get("/raw-materials/low-stock", {
      params: threshold ? { threshold } : {},
    });
  },
};

export default rawMaterialApi;