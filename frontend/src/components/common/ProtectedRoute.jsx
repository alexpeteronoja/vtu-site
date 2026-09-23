import { Navigate, Outlet } from 'react-router-dom';
import withAuth from '../../utils/withAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = withAuth();

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check if user's role matches one of them
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If role doesn't match, redirect to unauthorized or a default safe page (like user dashboard)
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
