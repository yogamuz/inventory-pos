// src/services/api/product.api.js
import apiClient from '@/config/api.config';

const PRODUCT_ENDPOINT = '/products';

const productApi = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const { page, limit, search, isActive, sortBy, sortOrder } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (isActive !== undefined) queryParams.append('isActive', isActive);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    
    const query = queryParams.toString();
    return apiClient.get(`${PRODUCT_ENDPOINT}${query ? `?${query}` : ''}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return apiClient.get(`${PRODUCT_ENDPOINT}/${id}`);
  },

  // Create new product
  createProduct: async (productData, imageFile = null) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    if (productData.stock !== undefined) {
      formData.append('stock', productData.stock);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return apiClient.post(PRODUCT_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

// Update product 
updateProduct: async (id, productData, imageFile = null) => {
  const formData = new FormData();
  
  if (productData.name !== undefined) formData.append('name', productData.name);
  if (productData.price !== undefined) formData.append('price', productData.price);
  // HAPUS: stock tidak dikirim saat update
  if (productData.isActive !== undefined) formData.append('isActive', productData.isActive);
  if (imageFile) formData.append('image', imageFile);

  return apiClient.put(`${PRODUCT_ENDPOINT}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},

  // Delete product (soft delete)
  deleteProduct: async (id) => {
    return apiClient.delete(`${PRODUCT_ENDPOINT}/${id}`);
  },

  // Hard delete product (permanent)
  hardDeleteProduct: async (id) => {
    return apiClient.delete(`${PRODUCT_ENDPOINT}/${id}/hard`);
  },

  // Restock product
  restockProduct: async (id, quantity) => {
    return apiClient.post(`${PRODUCT_ENDPOINT}/${id}/restock`, { quantity });
  },

  // Record sale
  recordSale: async (id, quantity) => {
    return apiClient.post(`${PRODUCT_ENDPOINT}/${id}/sale`, { quantity });
  },

  // Adjust stock
  adjustStock: async (id, stock, notes = null) => {
    return apiClient.patch(`${PRODUCT_ENDPOINT}/${id}/adjust`, { stock, notes });
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    return apiClient.get(`${PRODUCT_ENDPOINT}/stats`);
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 5) => {
    return apiClient.get(`${PRODUCT_ENDPOINT}/low-stock?threshold=${threshold}`);
  },
};

export default productApi;