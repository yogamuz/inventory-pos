// src/components/products/SellModal.jsx
import { useState } from "react";
import { X, ShoppingCart, Minus, Plus } from "lucide-react";

function SellModal({ isOpen, onClose, onSubmit, product, loading }) {
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quantity);
  };

  const increment = () => {
    if (quantity < product?.stock) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  if (!isOpen || !product) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
        <div className="relative bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Catat Penjualan
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-5">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">
                {formatCurrency(product.price)} · Stok: {product.stock} porsi
              </p>
            </div>
          </div>

          {/* Quantity */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jumlah Terjual
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-5">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>

            {/* Footer */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellModal;