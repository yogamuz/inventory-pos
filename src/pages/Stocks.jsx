// src/pages/Stocks.jsx (Updated)
import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useStockStore from "@/stores/useStockStore";
import StockList from "@/components/stocks/StockList";
import StockFilters from "@/components/stocks/StockFilters";
import Pagination from "@/components/products/Pagination";
import StockAdjustModal from "@/components/stocks/StockAdjustModal";

function Stocks() {
  const {
    products,
    pagination,
    filters,
    loading,
    error,
    fetchProducts,
    setFilters,
    setPage,
    recordSale,
    adjustStock,
    clearError,
  } = useStockStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("adjust");

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  // Handle search
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

  // Handle adjust stock
  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setModalMode("adjust");
    setIsModalOpen(true);
  };

  // Handle record sale
  const handleRecordSale = (product) => {
    setSelectedProduct(product);
    setModalMode("sale");
    setIsModalOpen(true);
  };

  // Handle submit
  const handleSubmit = async (mode, value, notes) => {
    if (!selectedProduct) return;

    try {
      if (mode === "sale") {
        await recordSale(selectedProduct.id, value);
        toast.success(`Berhasil mencatat penjualan sebanyak ${value}`);
      } else {
        await adjustStock(selectedProduct.id, value, notes);
        toast.success("Stok berhasil disesuaikan");
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error adjusting stock:", err);
      toast.error("Gagal mengubah stok");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode("adjust");
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Stok</h1>
        <p className="text-gray-600">Kelola stok produk Anda.</p>
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
      <StockFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Stocks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <StockList
          products={products}
          onAdjust={handleAdjustStock}
          onSale={handleRecordSale}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        product={selectedProduct}
        loading={loading}
        initialMode={modalMode}
      />
    </>
  );
}

export default Stocks;