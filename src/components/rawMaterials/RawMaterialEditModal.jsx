// src/components/rawMaterials/RawMaterialEditModal.jsx
import { useState, useEffect } from "react";
import { X, FlaskConical, Upload } from "lucide-react";

const UNIT_OPTIONS = ["pcs", "gram", "ml", "liter", "kg"];

function RawMaterialEditModal({ isOpen, onClose, onSubmit, rawMaterial, loading }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form saat modal dibuka
  useEffect(() => {
    if (rawMaterial && isOpen) {
      setName(rawMaterial.name || "");
      setUnit(rawMaterial.unit || "pcs");
      setLowStockThreshold(rawMaterial.lowStockThreshold?.toString() || "10");
      setNotes(rawMaterial.notes || "");
      setImageFile(null);
      setImagePreview(rawMaterial.imageUrl || null);
    }
  }, [rawMaterial, isOpen]);

  const resetForm = () => {
    setName("");
    setUnit("pcs");
    setLowStockThreshold("");
    setNotes("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Nama bahan mentah wajib diisi");
      return;
    }
    if (lowStockThreshold === "" || Number(lowStockThreshold) < 0) {
      alert("Minimum stok tidak boleh negatif");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("unit", unit);
    formData.append("lowStockThreshold", Number(lowStockThreshold));
    if (notes.trim()) formData.append("notes", notes.trim());
    if (imageFile) formData.append("image", imageFile);

    onSubmit(formData);
    resetForm();
  };

  if (!isOpen || !rawMaterial) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        <div className="relative inline-block w-full max-w-lg">
          <div className="relative bg-white rounded-lg shadow-xl transform transition-all text-left overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Bahan Mentah — {rawMaterial.name}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="bg-white px-6 py-4 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Bahan <span className="text-gray-400">(Opsional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FlaskConical className="h-7 w-7 text-gray-300" />
                    )}
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4" />
                    {imagePreview ? "Ganti Foto" : "Pilih Foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Bahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Contoh: Tepung Terigu"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Stok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Contoh: 10"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Notifikasi stok menipis akan muncul jika stok di bawah angka ini
                </p>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan <span className="text-gray-400">(Opsional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Tambahkan catatan (opsional)"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RawMaterialEditModal;