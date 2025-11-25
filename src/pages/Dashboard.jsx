import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit3,
  ArrowRight,
  Plus,
  FileText,
} from "lucide-react";
import productApi from "@/services/api/product.api";
import historyApi from "@/services/api/history.api";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const loginToastShownRef = useRef(false);
  const resetToastShownRef = useRef(false);

  useEffect(() => {
    if (location.state?.loginSuccess && !loginToastShownRef.current) {
      loginToastShownRef.current = true;
      toast.success("Login berhasil!");
      // Clear the state untuk mencegah toast muncul lagi saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.resetSuccess && !resetToastShownRef.current) {
      resetToastShownRef.current = true;
      toast.success("Password berhasil direset!");
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [statsRes, todayStatsRes, activitiesRes, lowStockRes] =
        await Promise.all([
          productApi.getDashboardStats(),
          historyApi.getHistoryStats({ today: true }),
          historyApi.getAllHistory({ limit: 5 }),
          productApi.getLowStockProducts(10),
        ]);

      setDashboardStats(statsRes.data);
      setTodayStats(todayStatsRes.data);
      setRecentActivities(activitiesRes.data.history);
      setLowStockProducts(lowStockRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "sale":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "restock":
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case "adjustment":
        return <Edit3 className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "sale":
        return "bg-green-50 border-green-200";
      case "restock":
        return "bg-orange-50 border-orange-200";
      case "adjustment":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Calculate today's revenue (price * quantity sold)
  const calculateTodayRevenue = () => {
    // Since we don't have price in history, we use quantitySold * average from topProducts
    // This is an approximation
    return todayStats?.quantitySold
      ? formatCurrency(todayStats.quantitySold * 15000) // Approx average price
      : formatCurrency(0);
  };

  const handleNavigate = (path) => {
    // You can replace this with your actual navigation logic
    console.log(`Navigate to: ${path}`);
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ TAMBAHKAN: Toaster dengan position top-center */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang di Bakso Aci Gg Leak Admin.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Hari Ini
            </span>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Pendapatan</p>
          <p className="text-2xl font-bold">{calculateTodayRevenue()}</p>
          <p className="text-xs opacity-80 mt-2">
            {todayStats?.quantitySold || 0} unit terjual
          </p>
        </div>

        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Hari Ini
            </span>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">
            Transaksi Penjualan
          </p>
          <p className="text-2xl font-bold">{todayStats?.totalSale || 0}</p>
          <p className="text-xs opacity-80 mt-2">
            {todayStats?.totalRestock || 0} restock
          </p>
        </div>

        {/* Total Active Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Produk Aktif</p>
          <p className="text-2xl font-bold">
            {dashboardStats?.activeProducts || 0}
          </p>
          <p className="text-xs opacity-80 mt-2">
            dari {dashboardStats?.totalProducts || 0} total
          </p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Stok Menipis</p>
          <p className="text-2xl font-bold">{lowStockProducts?.length || 0}</p>
          <p className="text-xs opacity-80 mt-2">perlu restocking</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleNavigate("/stocks")}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <ShoppingCart className="h-5 w-5 text-red-600" />
            </div>
            <span className="font-semibold text-gray-900">Catat Penjualan</span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
        </button>

        <button
          onClick={() => handleNavigate("/products")}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Tambah Produk</span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => handleNavigate("/analytics")}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Lihat Laporan</span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Aktivitas Terbaru
            </h2>
            <button
              onClick={() => handleNavigate("/history")}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada aktivitas</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-l-4 ${getActivityColor(
                    activity.type
                  )}`}
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {activity.productName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span
                        className={`font-semibold ${
                          activity.type === "sale"
                            ? "text-red-600"
                            : activity.type === "restock"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {activity.type === "sale" ? "-" : "+"}
                        {Math.abs(activity.quantity)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      activity.type === "sale"
                        ? "bg-green-100 text-green-700"
                        : activity.type === "restock"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activity.type === "sale"
                      ? "Sale"
                      : activity.type === "restock"
                      ? "Restock"
                      : "Adjust"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Produk Terlaris</h2>
            <button
              onClick={() => handleNavigate("/analytics")}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Lihat Detail
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {dashboardStats?.topProducts?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada data penjualan</p>
              </div>
            ) : (
              dashboardStats?.topProducts?.map((product, index) => (
                <div
                  key={product.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-shrink-0 h-12 w-12">
                    {product.imageUrl ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {product.sold}
                    </p>
                    <p className="text-xs text-gray-500">terjual</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert - Full Width */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Peringatan Stok Menipis
              </h2>
            </div>
            <button
              onClick={() => handleNavigate("/stocks")}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Kelola Stok
            </button>
          </div>
          {lowStockProducts?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Semua produk memiliki stok yang cukup</p>
            </div>
          ) : (
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
                      Stok
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-red-600">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock <= 5
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {product.stock <= 5 ? "Kritis" : "Rendah"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
