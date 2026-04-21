import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/features/auth/authSlice';

// login page
const Login = Loadable(lazy(() => import('../views/pages/authentication/Login')));

// 🔥 Wrapper يمنع دخول login إذا المستخدم مسجل
function GuestGuard({ children }) {
  const token = useSelector(selectToken);

  // 🔥 أهم تعديل: redirect فوري بعد login
  if (token) {
    return <Navigate to="/dashboard/default" replace />;
  }

  return children;
}
const AuthenticationRoutes = {
  path: '/login',
  element: <MinimalLayout />,
  children: [
    {
      path: '',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      )
    }
  ]
};

export default AuthenticationRoutes;
