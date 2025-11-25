// src/services/api/history.api.js
import apiClient from '@/config/api.config';

const HISTORY_ENDPOINT = '/history';
const EXPORT_ENDPOINT = '/export';

const historyApi = {
  // Get all history with filters
  getAllHistory: async (params = {}) => {
    const { page, limit, productName, type, today } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (productName) queryParams.append('productName', productName);
    if (type) queryParams.append('type', type);
    if (today !== undefined) queryParams.append('today', today);
    
    const query = queryParams.toString();
    return apiClient.get(`${HISTORY_ENDPOINT}${query ? `?${query}` : ''}`);
  },

  // Get history stats
  getHistoryStats: async (params = {}) => {
    const { today } = params;
    const queryParams = new URLSearchParams();
    
    if (today !== undefined) queryParams.append('today', today);
    
    const query = queryParams.toString();
    return apiClient.get(`${HISTORY_ENDPOINT}/stats${query ? `?${query}` : ''}`);
  },

  // Get history by product ID
  getHistoryByProductId: async (productId, params = {}) => {
    const { page, limit, type } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (type) queryParams.append('type', type);
    
    const query = queryParams.toString();
    return apiClient.get(`${HISTORY_ENDPOINT}/product/${productId}${query ? `?${query}` : ''}`);
  },

  // Export history to Excel
  exportToExcel: async (days = 7) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1${EXPORT_ENDPOINT}/history?days=${days}`,
        {
          method: 'GET',
          credentials: 'include', // Important: send cookies
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan Penjualan ${days} Hari.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to export data');
    }
  },
};

export default historyApi;