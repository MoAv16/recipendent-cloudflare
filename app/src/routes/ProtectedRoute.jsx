import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ROUTES } from '../config/constants';

export default function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireRole && userData?.role !== requireRole) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
