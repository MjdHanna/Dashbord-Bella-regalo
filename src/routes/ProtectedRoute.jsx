import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectToken } from '../redux/features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const token = useSelector(selectToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
