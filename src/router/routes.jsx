import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Stocks from "@/pages/Stocks.jsx";
import Products from "@/pages/Products.jsx";
import Analytics from "@/pages/Analytics.jsx";
import History from "@/pages/History.jsx";
import Login from "@/pages/Login.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="products" element={<Products />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}
