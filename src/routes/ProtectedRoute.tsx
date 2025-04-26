// src/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
