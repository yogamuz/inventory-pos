// src/components/stocks/StockFilters.jsx
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

function StockFilters({ filters, onFilterChange, onSearch }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const isFirstRender = useRef(true);

  // Debounce search ONLY
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

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    // Langsung panggil tanpa debounce
    onFilterChange({ sortBy, sortOrder });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Sort */}
        <div>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="stock-asc">Stok Terendah</option>
            <option value="stock-desc">Stok Tertinggi</option>
            <option value="sold-desc">Terjual Tertinggi</option>
            <option value="sold-asc">Terjual Terendah</option>
            <option value="totalRevenue-desc">Pendapatan Tertinggi</option>
            <option value="totalRevenue-asc">Pendapatan Terendah</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default StockFilters;