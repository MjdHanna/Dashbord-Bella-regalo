import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, roles = [] }) {
  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.accountType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
