
// src/components/stocks/StockList.jsx
import { Package, Edit3, TrendingDown } from "lucide-react";

function StockList({ products, onAdjust, onSale, loading }) {
  if (!products || products.length === 0) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Tidak ada produk
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Tidak ada data produk untuk ditampilkan.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      {loading && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
            <span>Memuat data...</span>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produk
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Terjual
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pendapatan
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{index + 1}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-left">
                  <div className="flex-shrink-0 h-10 w-10">
                    {product.imageUrl ? (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">
                  {formatCurrency(product.price)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">
                  <span
                    className={
                      product.stock < 10 ? "text-red-600 font-semibold" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{product.sold || 0}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">
                  {formatCurrency(product.totalRevenue || 0)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onAdjust(product)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Adjust
                  </button>
                  <button
                    onClick={() => onSale(product)}
                    className="text-green-600 hover:text-green-900 inline-flex items-center px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Sale
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;