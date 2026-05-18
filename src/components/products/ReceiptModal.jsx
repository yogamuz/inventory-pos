// src/components/products/ReceiptModal.jsx
import { X, Printer, CheckCircle2 } from "lucide-react";

function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!isOpen || !receipt) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg max-w-sm w-full shadow-xl print:shadow-none">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 print:hidden">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold text-gray-900">
                Penjualan Berhasil
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Receipt Body */}
          <div className="px-6 py-5" id="receipt-content">
            {/* Nama Toko */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                Struk Penjualan
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(receipt.soldAt)}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* No Transaksi */}
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">No. Transaksi</span>
              <span className="font-mono font-semibold text-gray-900">
                {receipt.saleNumber}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Item */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium flex-1 mr-4">
                  {receipt.productName}
                </span>
                <span className="text-gray-900">
                  {formatCurrency(receipt.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {receipt.quantity} porsi × {formatCurrency(receipt.price)}
                </span>
                <span className="text-gray-700">
                  {formatCurrency(receipt.total)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 my-3" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(receipt.total)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-300 mt-3 mb-4" />

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400">
              Terima kasih atas pembelian Anda
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 flex gap-3 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;