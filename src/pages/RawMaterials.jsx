// src/pages/RawMaterials.jsx
import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import useRawMaterialStore from "@/stores/useRawMaterialStore";
import RawMaterialList from "@/components/rawMaterials/RawMaterialList";
import RawMaterialFilters from "@/components/rawMaterials/RawMaterialFilters";
import RawMaterialCreateModal from "@/components/rawMaterials/RawMaterialCreateModal";
import RawMaterialModal from "@/components/rawMaterials/RawMaterialModal";
import RawMaterialEditModal from "@/components/rawMaterials/RawMaterialEditModal";
import Pagination from "@/components/products/Pagination";

function RawMaterials() {
  const {
    rawMaterials,
    pagination,
    filters,
    loading,
    error,
    fetchRawMaterials,
    setFilters,
    setPage,
    restockRawMaterial,
    recordUsage,
    adjustStock,
    clearError,
    createRawMaterial,
    deleteRawMaterial,
    updateRawMaterial,
  } = useRawMaterialStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [modalMode, setModalMode] = useState("restock");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditRawMaterial, setSelectedEditRawMaterial] = useState(null);
  // Initial fetch
  useEffect(() => {
    fetchRawMaterials();
  }, [filters, pagination.page]);

  const handleSearch = (searchValue) => {
    setFilters({ search: searchValue });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openModal = (rawMaterial, mode) => {
    setSelectedRawMaterial(rawMaterial);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRawMaterial(null);
    setModalMode("restock");
  };
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreate = async (formData) => {
    try {
      await createRawMaterial(formData);
      toast.success("Bahan mentah berhasil ditambahkan");
      closeCreateModal();
    } catch (err) {
      toast.error(err.message || "Gagal menambahkan bahan mentah");
    }
  };
  const openEditModal = (rawMaterial) => {
    setSelectedEditRawMaterial(rawMaterial);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditRawMaterial(null);
  };

  const handleEdit = async (formData) => {
    try {
      await updateRawMaterial(selectedEditRawMaterial.id, formData);
      toast.success("Bahan mentah berhasil diperbarui");
      closeEditModal();
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui bahan mentah");
    }
  };

  const handleDelete = async (rawMaterial) => {
    if (
      !window.confirm(
        `Hapus "${rawMaterial.name}"? Bahan mentah akan dinonaktifkan.`,
      )
    )
      return;
    try {
      await deleteRawMaterial(rawMaterial.id);
      toast.success("Bahan mentah berhasil dihapus");
    } catch (err) {
      toast.error(err.message || "Gagal menghapus bahan mentah");
    }
  };

  const handleSubmit = async (mode, value, notes) => {
    if (!selectedRawMaterial) return;

    try {
      if (mode === "restock") {
        await restockRawMaterial(selectedRawMaterial.id, value);
        toast.success(`Berhasil restock ${value} ${selectedRawMaterial.unit}`);
      } else if (mode === "usage") {
        await recordUsage(selectedRawMaterial.id, value, notes);
        toast.success(
          `Berhasil mencatat pemakaian ${value} ${selectedRawMaterial.unit}`,
        );
      } else if (mode === "adjust") {
        await adjustStock(selectedRawMaterial.id, value, notes);
        toast.success("Stok berhasil disesuaikan");
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || "Gagal mengubah stok");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bahan Mentah</h1>
        <p className="text-gray-600">
          Kelola stok bahan mentah untuk setiap menu.
        </p>
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
      <RawMaterialFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onAdd={openCreateModal}
      />

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <RawMaterialList
          rawMaterials={rawMaterials}
          onRestock={(rm) => openModal(rm, "restock")}
          onUsage={(rm) => openModal(rm, "usage")}
          onAdjust={(rm) => openModal(rm, "adjust")}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />

        {!loading && rawMaterials.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Modal */}
      <RawMaterialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        rawMaterial={selectedRawMaterial}
        loading={loading}
        initialMode={modalMode}
      />
      <RawMaterialCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        loading={loading}
      />
      <RawMaterialEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEdit}
        rawMaterial={selectedEditRawMaterial}
        loading={loading}
      />
    </>
  );
}

export default RawMaterials;
