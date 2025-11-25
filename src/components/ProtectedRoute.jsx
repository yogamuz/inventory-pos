import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated, isInitializing, checkAuth } = useAuth();
  const location = useLocation();

  // ✅ TAMBAH: Validasi token saat mount
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      checkAuth();
    }
  }, [_hasHydrated, isAuthenticated, checkAuth]);

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