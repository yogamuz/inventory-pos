// src/components/products/ProductRecipeModal.jsx
import { useState, useEffect } from "react";
import {
  X,
  FlaskConical,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import useRecipeStore from "@/stores/useRecipeStore";
import rawMaterialApi from "@/services/api/rawMaterial.api";

function ProductRecipeModal({ isOpen, onClose, product }) {
  const {
    currentRecipe,
    recipeLoading,
    fetchRecipeByProductId,
    addIngredient,
    updateIngredient,
    removeIngredient,
    clearCurrentRecipe,
  } = useRecipeStore();

  const [rawMaterials, setRawMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [newRawMaterialId, setNewRawMaterialId] = useState("");
  const [newQty, setNewQty] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchRecipeByProductId(product.id);
      loadRawMaterials();
    }
    if (!isOpen) {
      clearCurrentRecipe();
      setShowAddForm(false);
      setEditingId(null);
    }
  }, [isOpen, product]);

  const loadRawMaterials = async () => {
    try {
      const response = await rawMaterialApi.getAllRawMaterials({
        isActive: true,
        limit: 100,
      });
      setRawMaterials(response.data.rawMaterials || []);
    } catch {
      setRawMaterials([]);
    }
  };

  const handleStartEdit = (ingredient) => {
    setEditingId(ingredient.id);
    setEditQty(ingredient.quantityPerUnit.toString());
  };

  const handleSaveEdit = async (recipeId) => {
    if (!editQty || Number(editQty) <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }
    try {
      await updateIngredient(recipeId, Number(editQty), product.id);
      setEditingId(null);
      setEditQty("");
    } catch (err) {
      alert(err.message || "Gagal mengupdate bahan");
    }
  };

  const handleRemove = async (recipeId) => {
    if (!window.confirm("Hapus bahan ini dari resep?")) return;
    try {
      await removeIngredient(recipeId, product.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus bahan");
    }
  };

  const handleAdd = async () => {
    if (!newRawMaterialId) {
      alert("Pilih bahan mentah terlebih dahulu");
      return;
    }
    if (!newQty || Number(newQty) <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }
    try {
      await addIngredient(product.id, newRawMaterialId, Number(newQty));
      setNewRawMaterialId("");
      setNewQty("");
      setShowAddForm(false);
    } catch (err) {
      alert(err.message || "Gagal menambahkan bahan");
    }
  };

  // Raw materials yang belum ada di resep
  const usedRawMaterialIds = new Set(
    currentRecipe?.ingredients?.map((i) => i.rawMaterial?.id) || []
  );
  const availableRawMaterials = rawMaterials.filter(
    (rm) => !usedRawMaterialIds.has(rm.id)
  );

  const selectedRawMaterial = rawMaterials.find(
    (rm) => rm.id === newRawMaterialId
  );

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-xl">
          <div className="relative bg-white rounded-lg shadow-xl transform transition-all text-left overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resep — {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Bahan yang dibutuhkan per 1 porsi
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="bg-white px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {recipeLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                </div>
              ) : !currentRecipe?.ingredients?.length ? (
                <div className="text-center py-8">
                  <FlaskConical className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    Belum ada resep untuk menu ini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentRecipe.ingredients.map((ingredient) => {
                    const rm = ingredient.rawMaterial;
                    const isEditing = editingId === ingredient.id;

                    return (
                      <div
                        key={ingredient.id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        {/* Left: image + name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 h-8 w-8">
                            {rm?.imageUrl ? (
                              <img
                                src={rm.imageUrl}
                                alt={rm.name}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                                <FlaskConical className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {rm?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Stok: {rm?.stock} {rm?.unit}
                            </p>
                          </div>
                        </div>

                        {/* Right: qty + actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <input
                                type="number"
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                min="0.01"
                                step="0.01"
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-red-500 focus:border-red-500"
                                autoFocus
                              />
                              <span className="text-xs text-gray-400 w-8">
                                {rm?.unit}
                              </span>
                              <button
                                onClick={() => handleSaveEdit(ingredient.id)}
                                disabled={recipeLoading}
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-semibold text-gray-700 text-right w-16">
                                {ingredient.quantityPerUnit} {rm?.unit}
                              </span>
                              <button
                                onClick={() => handleStartEdit(ingredient)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemove(ingredient.id)}
                                disabled={recipeLoading}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add ingredient form */}
              {showAddForm && (
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Tambah Bahan
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newRawMaterialId}
                      onChange={(e) => setNewRawMaterialId(e.target.value)}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Pilih bahan...</option>
                      {availableRawMaterials.map((rm) => (
                        <option key={rm.id} value={rm.id}>
                          {rm.name} ({rm.unit})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        min="0.01"
                        step="0.01"
                        placeholder="Jumlah"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                      />
                      {selectedRawMaterial && (
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {selectedRawMaterial.unit}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAdd}
                        disabled={recipeLoading}
                        className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        Tambah
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewRawMaterialId("");
                          setNewQty("");
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  disabled={recipeLoading || availableRawMaterials.length === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Bahan
                </button>
              )}
              <div className={!showAddForm ? "" : "ml-auto"}>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductRecipeModal;