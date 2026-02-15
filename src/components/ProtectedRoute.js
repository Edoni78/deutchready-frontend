import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireSuperAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-brand-200 border-t-brand-600 animate-spin" />
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && user.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
