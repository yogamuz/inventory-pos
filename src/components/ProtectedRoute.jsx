import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect ke login dan simpan intended URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}