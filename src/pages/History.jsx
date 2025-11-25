// src/pages/History.jsx
import { useEffect, useState } from "react";
import { AlertCircle, X, Package, TrendingUp, TrendingDown, Edit3, Calendar } from "lucide-react";
import useHistoryStore from "@/stores/useHistoryStore";

export default function History() {
  const {
    history,
    pagination,
    filters,
    loading,
    error,
    fetchHistory,
    setFilters,
    setPage,
    clearError,
  } = useHistoryStore();

  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [todayFilter, setTodayFilter] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [filters, pagination.page]);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilters({ productName: value });
  };

  // Handle type filter
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFilters({ type });
  };

  // Handle today filter
  const handleTodayToggle = () => {
    const newToday = !todayFilter;
    setTodayFilter(newToday);
    setFilters({ today: newToday });
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'restock':
        return <TrendingUp className="h-4 w-4" />;
      case 'sale':
        return <TrendingDown className="h-4 w-4" />;
      case 'adjustment':
        return <Edit3 className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'restock':
        return 'bg-orange-100 text-orange-700';
      case 'sale':
        return 'bg-green-100 text-green-700';
      case 'adjustment':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format quantity
  const formatQuantity = (type, quantity) => {
    if (type === 'sale') {
      return `-${Math.abs(quantity)}`;
    } else if (type === 'restock') {
      return `+${quantity}`;
    }
    return quantity;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Stok</h1>
        <p className="text-gray-600">Pantau semua perubahan stok produk Anda.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Semua Tipe</option>
            <option value="restock">Restock</option>
            <option value="sale">Penjualan</option>
            <option value="adjustment">Adjustment</option>
          </select>

          {/* Today Filter */}
          <button
            onClick={handleTodayToggle}
            className={`px-4 py-2 rounded-lg border-2 transition-colors inline-flex items-center gap-2 ${
              todayFilter
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Hari Ini
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Daftar Riwayat</h2>
        </div>

        {loading && history.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Tidak ada riwayat</h3>
            <p className="mt-1 text-sm text-gray-500">Belum ada aktivitas stok yang tercatat.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Product Image */}
                    <div className="flex-shrink-0 h-12 w-12">
                      {item.productId?.imageUrl ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={item.productId.imageUrl}
                          alt={item.productName}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">{item.productName}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{formatDate(item.createdAt)}</span>
                        <span className="text-gray-300">•</span>
                        <span className={`font-semibold ${
                          item.type === 'sale' ? 'text-red-600' : 
                          item.type === 'restock' ? 'text-green-600' : 
                          'text-blue-600'
                        }`}>
                          {formatQuantity(item.type, item.quantity)} unit
                        </span>
                        {item.notes && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 italic">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${getTypeColor(
                      item.type
                    )}`}
                  >
                    {getTypeIcon(item.type)}
                    {item.type === 'restock' ? 'Restock' : 
                     item.type === 'sale' ? 'Penjualan' : 
                     'Adjustment'}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                    {pagination.total} riwayat
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}