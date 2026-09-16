import { Navigate, useLocation } from 'react-router-dom';
import { dashboardPath, getSession } from '../services/auth';

export default function ProtectedRoute({ roles, children }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (roles && !roles.includes(session.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

export function RoleRedirect() {
  const session = getSession();
  return <Navigate to={session ? dashboardPath(session.role) : '/login'} replace />;
}
