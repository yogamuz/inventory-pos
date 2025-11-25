import { useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated, checkAuth, isInitializing } = useAuth();
  const location = useLocation();
  const checkAuthCalledRef = useRef(false);

  useEffect(() => {
    // ✅ PERBAIKAN: Hanya check auth SEKALI saat mount dan hydrated
    if (_hasHydrated && !checkAuthCalledRef.current && !isAuthenticated) {
      checkAuthCalledRef.current = true;
      checkAuth();
    }
  }, [_hasHydrated, isAuthenticated, checkAuth]);

  // Loading saat hydration atau checking auth
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