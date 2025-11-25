// src/components/products/ProductFilters.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, Filter } from 'lucide-react';

function ProductFilters({ filters, onFilterChange, onSearch }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const isFirstRender = useRef(true);

  // Debounce search ONLY (tidak untuk filter lain)
  useEffect(() => {
    // Skip debounce pada first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]); // Hanya trigger saat searchValue berubah

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    // Langsung panggil tanpa debounce
    onFilterChange({
      isActive: value === 'all' ? undefined : value === 'true',
    });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    // Langsung panggil tanpa debounce
    onFilterChange({ sortBy, sortOrder });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchValue}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={
              filters.isActive === undefined
                ? 'all'
                : filters.isActive
                ? 'true'
                : 'false'
            }
            onChange={handleStatusChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="all">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="stock-asc">Stok Terendah</option>
            <option value="stock-desc">Stok Tertinggi</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;