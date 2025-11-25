import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  AlertCircle,
  Download,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import productApi from "@/services/api/product.api";
import historyApi from "@/services/api/history.api";
import toast, { Toaster } from "react-hot-toast";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
      toast.error("Gagal memuat data analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async (days) => {
    try {
      setExporting(true);
      toast.loading("Mengekspor data...");
      await historyApi.exportToExcel(days);
      toast.dismiss();
      toast.success(`Berhasil mengekspor laporan ${days} hari`);
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal mengekspor data");
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Colors for pie chart
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'];

  // Prepare chart data
  const topProductsBarData = stats?.topProducts.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    terjual: p.sold,
    pendapatan: p.totalRevenue / 1000, // Convert to thousands
  })) || [];

  const topProductsPieData = stats?.topProducts.map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
    value: p.sold,
  })) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Monitor performa penjualan dan inventori Anda.</p>
          </div>
          
          {/* Export Button */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExportExcel(7)}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export 7 Hari
            </button>
            <button
              onClick={() => handleExportExcel(30)}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export 30 Hari
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>

        {/* Total Products */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Produk</p>
          <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
          <p className="text-xs opacity-80 mt-2">
            {stats?.activeProducts || 0} produk aktif
          </p>
        </div>

        {/* Total Sold */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Terjual</p>
          <p className="text-2xl font-bold">{stats?.totalSold || 0} items</p>
        </div>

        {/* Total Stock */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Stok</p>
          <p className="text-2xl font-bold">{stats?.totalStock || 0} items</p>
          <p className="text-xs opacity-80 mt-2">
            {stats?.lowStockProducts || 0} stok menipis
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Top Products by Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produk Terlaris (Unit Terjual)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value, name) => {
                  if (name === 'terjual') return [value + ' items', 'Terjual'];
                  if (name === 'pendapatan') return [formatCurrency(value * 1000), 'Pendapatan'];
                  return [value, name];
                }}
              />
              <Bar dataKey="terjual" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Top Products Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribusi Penjualan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProductsPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topProductsPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [value + ' items', 'Terjual']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Produk Terlaris</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terjual
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pendapatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.topProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
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
                        <div className="text-xs text-gray-500">Rank #{index + 1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.sold} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.totalRevenue)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}