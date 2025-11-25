// src/components/stocks/StockAdjustModal.jsx
import { useState, useEffect } from 'react';
import { X, Edit3, TrendingDown } from 'lucide-react';

function StockAdjustModal({ isOpen, onClose, onSubmit, product, loading, initialMode }) {
  const [mode, setMode] = useState('adjust');
  const [newStock, setNewStock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product && isOpen) {
      setMode(initialMode || 'adjust');
      setNewStock(product.stock?.toString() || '0');
      setQuantity('');
      setNotes('');
    }
  }, [product, isOpen, initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'adjust') {
      if (newStock === '' || Number(newStock) < 0) {
        alert('Stok tidak boleh negatif');
        return;
      }
      onSubmit('adjust', Number(newStock), notes || null);
    } else if (mode === 'sale') {
      if (!quantity || Number(quantity) <= 0) {
        alert('Jumlah penjualan harus lebih dari 0');
        return;
      }
      if (Number(quantity) > product.stock) {
        alert('Jumlah penjualan melebihi stok tersedia');
        return;
      }
      onSubmit('sale', Number(quantity), null);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-lg">
          <div className="relative bg-white rounded-lg shadow-xl transform transition-all text-left overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === 'adjust' ? 'Adjust Stok' : 'Catat Penjualan'} - {product.name}
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Stok Saat Ini</p>
                <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('adjust')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    mode === 'adjust'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                  Adjust Manual
                </button>
                <button
                  type="button"
                  onClick={() => setMode('sale')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    mode === 'sale'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <TrendingDown className="h-4 w-4" />
                  Catat Penjualan
                </button>
              </div>

              {mode === 'adjust' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Baru <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan stok baru"
                    />
                    {newStock !== '' && (
                      <p className="mt-2 text-sm text-gray-600">
                        Perubahan:{' '}
                        <span className={`font-semibold ${Number(newStock) - product.stock >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Number(newStock) - product.stock >= 0 ? '+' : ''}
                          {Number(newStock) - product.stock}
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan <span className="text-gray-400">(Opsional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tambahkan catatan (opsional)"
                    />
                  </div>
                </>
              )}

              {mode === 'sale' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Terjual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                    max={product.stock}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Masukkan jumlah terjual"
                  />
                  {quantity && (
                    <p className="mt-2 text-sm text-gray-600">
                      Stok setelah penjualan: <span className="font-semibold">{product.stock - Number(quantity)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

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
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  mode === 'adjust'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockAdjustModal;