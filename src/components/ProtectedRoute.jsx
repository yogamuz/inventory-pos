import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated } = useAuth();
  const location = useLocation();

  if (!_hasHydrated) {
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