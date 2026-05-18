// src/services/api/history.api.js
import apiClient from "@/config/api.config";

const HISTORY_ENDPOINT = "/history";
const EXPORT_ENDPOINT = "/export";

const historyApi = {
  // Get all history with filters
  getAllHistory: async (params = {}) => {
    const { page, limit, productName, type, today } = params;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (productName) queryParams.append("productName", productName);
    if (type) queryParams.append("type", type);
    if (today !== undefined) queryParams.append("today", today);

    const query = queryParams.toString();
    return apiClient.get(`${HISTORY_ENDPOINT}${query ? `?${query}` : ""}`);
  },

  // Get history stats
  getHistoryStats: async (params = {}) => {
    const { today } = params;
    const queryParams = new URLSearchParams();

    if (today !== undefined) queryParams.append("today", today);

    const query = queryParams.toString();
    return apiClient.get(
      `${HISTORY_ENDPOINT}/stats${query ? `?${query}` : ""}`,
    );
  },

  // Get history by product ID
  getHistoryByProductId: async (productId, params = {}) => {
    const { page, limit, type } = params;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (type) queryParams.append("type", type);

    const query = queryParams.toString();
    return apiClient.get(
      `${HISTORY_ENDPOINT}/product/${productId}${query ? `?${query}` : ""}`,
    );
  },

  // Export history to Excel
  exportToExcel: async (days = 7) => {
    try {
      const response = await apiClient.get(`/export/history?days=${days}`, {
        responseType: "blob",
      });

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Laporan Penjualan ${days} Hari.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw new Error(error.message || "Gagal mengekspor data");
    }
  },
  // Get raw material history
  getRawMaterialHistory: async (params = {}) => {
    const { page, limit, rawMaterialName, type, today } = params;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (rawMaterialName) queryParams.append("rawMaterialName", rawMaterialName);
    if (type) queryParams.append("type", type);
    if (today !== undefined) queryParams.append("today", today);

    const query = queryParams.toString();
    return apiClient.get(`/raw-material-history${query ? `?${query}` : ""}`);
  },

  // Get raw material history stats
  getRawMaterialHistoryStats: async (params = {}) => {
    const { today } = params;
    const queryParams = new URLSearchParams();
    if (today !== undefined) queryParams.append("today", today);
    const query = queryParams.toString();
    return apiClient.get(
      `/raw-material-history/stats${query ? `?${query}` : ""}`,
    );
  },
};

export default historyApi;
