// src/components/products/SalesHistoryModal.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { X, ClipboardList, Loader2 } from "lucide-react";
import productApi from "@/services/api/product.api";
import ReceiptModal from "@/components/products/ReceiptModal";

function SalesHistoryModal({ isOpen, onClose }) {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const scrollRef = useRef(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  const handleSaleClick = (sale) => {
    setSelectedReceipt({
      saleNumber: sale.saleNumber,
      productName: sale.productName,
      price: sale.price,
      quantity: sale.quantity,
      total: sale.totalAmount,
      soldAt: sale.createdAt,
    });
  };
  const loadSales = useCallback(async (currentPage) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await productApi.getSalesHistory(currentPage, 20);
      const newSales = res.data.sales;
      setSales((prev) =>
        currentPage === 1 ? newSales : [...prev, ...newSales],
      );
      setHasMore(currentPage < res.data.pagination.pages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSales([]);
      setPage(1);
      setHasMore(true);
      loadSales(1);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadSales(nextPage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Riwayat Penjualan
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto flex-1 divide-y divide-gray-100"
          >
            {sales.length === 0 && !loading && (
              <div className="text-center py-12 text-sm text-gray-400">
                Belum ada riwayat penjualan.
              </div>
            )}
            {sales.map((sale) => (
              <div
                key={sale.id}
                onClick={() => handleSaleClick(sale)}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {sale.productName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(sale.createdAt)}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {sale.saleNumber}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {sale.totalAmount
                        ? formatCurrency(sale.totalAmount)
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.quantity} porsi
                    </p>
                    {sale.saleNumber && (
                      <p className="text-xs text-gray-400 font-mono">
                        {sale.saleNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
            {!hasMore && sales.length > 0 && (
              <p className="text-center text-xs text-gray-400 py-4">
                Semua data sudah ditampilkan
              </p>
            )}
          </div>
        </div>
      </div>
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </div>
  );
}

export default SalesHistoryModal;
