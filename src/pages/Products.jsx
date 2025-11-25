// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { Plus, AlertCircle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useProductStore from "@/stores/useProductStore";
import ProductList from "@/components/products/ProductList";
import ProductFilters from "@/components/products/ProductFilters";
import Pagination from "@/components/products/Pagination";
import ProductFormModal from "@/components/products/ProductFormModal";

export default function Products() {
  const {
    products,
    pagination,
    filters,
    loading,
    error,
    fetchProducts,
    setFilters,
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    hardDeleteProduct,
    clearError,
  } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  // Handle search with debounce
  const handleSearch = (searchValue) => {
    setFilters({ search: searchValue });
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle add product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setShowDeleteConfirm(product);
  };

// Confirm delete 
const confirmDelete = async () => {
  if (!showDeleteConfirm) return;
  
  try {
    await hardDeleteProduct(showDeleteConfirm.id); // Ganti menjadi hardDeleteProduct
    setShowDeleteConfirm(null);
    toast.success('Produk berhasil dihapus permanen'); // TAMBAHKAN
  } catch (err) {
    console.error('Error deleting product:', err);
    toast.error('Gagal menghapus produk'); // TAMBAHKAN
  }
};

  // Handle form submit
const handleFormSubmit = async (formData, imageFile) => {
  try {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData, imageFile);
      toast.success('Produk berhasil diupdate'); // TAMBAHKAN
    } else {
      await createProduct(formData, imageFile);
      toast.success('Produk berhasil ditambahkan'); // TAMBAHKAN
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  } catch (err) {
    console.error('Error saving product:', err);
    toast.error('Gagal menyimpan produk'); // TAMBAHKAN
  }
};

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Produk</h1>
            <p className="text-gray-600">Kelola inventori produk Anda.</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
{showDeleteConfirm && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4">
      {/* Backdrop Blur Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setShowDeleteConfirm(null)}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Hapus Produk Permanen
        </h3>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus produk{' '}
          <strong>{showDeleteConfirm.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(null)}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={confirmDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Menghapus...' : 'Hapus Permanen'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}
