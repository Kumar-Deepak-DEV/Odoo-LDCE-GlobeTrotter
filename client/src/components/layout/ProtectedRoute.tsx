import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading skeleton / spinner while validating authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to /login and preserve requested location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin role and user is not admin, redirect to /dashboard
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        state={{
          alert: {
            type: 'error',
            message: 'Access denied. You do not have administrator permissions.',
          },
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
