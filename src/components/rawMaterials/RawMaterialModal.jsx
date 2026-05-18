// src/components/rawMaterials/RawMaterialModal.jsx
import { useState, useEffect } from "react";
import { X, Edit3, TrendingDown, PackagePlus } from "lucide-react";

const MODES = {
  restock: {
    label: "Restock",
    icon: PackagePlus,
    color: "green",
    buttonClass: "bg-green-500 hover:bg-green-600",
    ringClass: "focus:ring-green-500 focus:border-green-500",
    activeClass: "border-green-500 bg-green-50 text-green-700",
  }
  // usage: {
  //   label: "Catat Pemakaian",
  //   icon: TrendingDown,
  //   color: "orange",
  //   buttonClass: "bg-orange-500 hover:bg-orange-600",
  //   ringClass: "focus:ring-orange-500 focus:border-orange-500",
  //   activeClass: "border-orange-500 bg-orange-50 text-orange-700",
  // },
  // adjust: {
  //   label: "Adjust Manual",
  //   icon: Edit3,
  //   color: "blue",
  //   buttonClass: "bg-blue-500 hover:bg-blue-600",
  //   ringClass: "focus:ring-blue-500 focus:border-blue-500",
  //   activeClass: "border-blue-500 bg-blue-50 text-blue-700",
  // },
};

function RawMaterialModal({ isOpen, onClose, onSubmit, rawMaterial, loading, initialMode }) {
  const [mode, setMode] = useState("restock");
  const [quantity, setQuantity] = useState("");
  const [newStock, setNewStock] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (rawMaterial && isOpen) {
      setMode(initialMode || "restock");
      setNewStock(rawMaterial.stock?.toString() || "0");
      setQuantity("");
      setNotes("");
    }
  }, [rawMaterial, isOpen, initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "adjust") {
      if (newStock === "" || Number(newStock) < 0) {
        alert("Stok tidak boleh negatif");
        return;
      }
      onSubmit("adjust", Number(newStock), notes || null);
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Jumlah harus lebih dari 0");
      return;
    }

    if (mode === "usage" && Number(quantity) > rawMaterial.stock) {
      alert("Jumlah pemakaian melebihi stok tersedia");
      return;
    }

    onSubmit(mode, Number(quantity), notes || null);
  };

  if (!isOpen || !rawMaterial) return null;

  const currentMode = MODES[mode];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-lg">
          <div className="relative bg-white rounded-lg shadow-xl transform transition-all text-left overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMode.label} — {rawMaterial.name}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="bg-white px-6 py-4 space-y-4">
              {/* Current stock info */}
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stok Saat Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rawMaterial.stock}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {rawMaterial.unit}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Min. Stok</p>
                  <p className="text-lg font-semibold text-gray-600">
                    {rawMaterial.lowStockThreshold}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {rawMaterial.unit}
                    </span>
                  </p>
                </div>
              </div>

              {/* Mode selector */}
              <div className="flex gap-2">
                {Object.entries(MODES).map(([key, val]) => {
                  const Icon = val.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                        mode === key
                          ? val.activeClass
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {val.label}
                    </button>
                  );
                })}
              </div>

              {/* Adjust mode */}
              {mode === "adjust" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Baru ({rawMaterial.unit}){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${MODES.adjust.ringClass}`}
                      placeholder="Masukkan stok baru"
                    />
                    {newStock !== "" && (
                      <p className="mt-2 text-sm text-gray-600">
                        Perubahan:{" "}
                        <span
                          className={`font-semibold ${
                            Number(newStock) - rawMaterial.stock >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {Number(newStock) - rawMaterial.stock >= 0 ? "+" : ""}
                          {Number(newStock) - rawMaterial.stock} {rawMaterial.unit}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan{" "}
                      <span className="text-gray-400">(Opsional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tambahkan catatan (opsional)"
                    />
                  </div>
                </>
              )}

              {/* Restock mode */}
              {mode === "restock" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Restock ({rawMaterial.unit}){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${MODES.restock.ringClass}`}
                    placeholder="Masukkan jumlah restock"
                  />
                  {quantity && (
                    <p className="mt-2 text-sm text-gray-600">
                      Stok setelah restock:{" "}
                      <span className="font-semibold text-green-600">
                        {rawMaterial.stock + Number(quantity)} {rawMaterial.unit}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Usage mode */}
              {mode === "usage" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Pemakaian ({rawMaterial.unit}){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      max={rawMaterial.stock}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${MODES.usage.ringClass}`}
                      placeholder="Masukkan jumlah pemakaian"
                    />
                    {quantity && (
                      <p className="mt-2 text-sm text-gray-600">
                        Sisa stok:{" "}
                        <span
                          className={`font-semibold ${
                            rawMaterial.stock - Number(quantity) < rawMaterial.lowStockThreshold
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {rawMaterial.stock - Number(quantity)} {rawMaterial.unit}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan{" "}
                      <span className="text-gray-400">(Opsional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Contoh: dipakai untuk Seblak Komplit"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${currentMode.buttonClass}`}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RawMaterialModal;