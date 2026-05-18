// src/components/rawMaterials/RawMaterialFilters.jsx
import { useState, useEffect, useRef } from "react";
import { Search, Plus } from "lucide-react";

function RawMaterialFilters({ filters, onFilterChange, onSearch, onAdd }) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    onFilterChange({ sortBy, sortOrder });
  };

  const handleUnitChange = (e) => {
    onFilterChange({ unit: e.target.value || undefined });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari bahan mentah..."
            value={searchValue}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Tambah Bahan Mentah */}
        <div className="flex items-end">
          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>

        {/* Filter by Unit */}
        <div>
          <select
            onChange={handleUnitChange}
            defaultValue=""
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Semua Satuan</option>
            <option value="pcs">pcs</option>
            <option value="gram">gram</option>
            <option value="ml">ml</option>
            <option value="liter">liter</option>
            <option value="kg">kg</option>
          </select>
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
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default RawMaterialFilters;
