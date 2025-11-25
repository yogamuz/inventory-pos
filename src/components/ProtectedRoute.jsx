import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated, isInitializing, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // ✅ FIX: Hanya panggil checkAuth saat hydration selesai, TANPA cek isAuthenticated
    if (_hasHydrated && !isInitializing) {
      checkAuth();
    }
  }, [_hasHydrated]); // ✅ FIX: Hapus isAuthenticated & checkAuth dari dependency

  // Loading saat hydration atau validating token
  if (!_hasHydrated || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}