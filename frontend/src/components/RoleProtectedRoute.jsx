import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to their respective dashboard
    const dashboardMap = {
      admin: '/admin',
      student: '/student',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

export default RoleProtectedRoute;