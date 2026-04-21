import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const ProductsPage = Loadable(lazy(() => import('views/products')));
const OrdersPage = Loadable(lazy(() => import('views/orders')));
const UsersPage = Loadable(lazy(() => import('views/users')));
const Brandspage = Loadable(lazy(() => import('views/brands')));
const OccasionsPage = Loadable(lazy(() => import('views/occasions')));
const VendorsPage = Loadable(lazy(() => import('views/vendors')));
const DriversPage = Loadable(lazy(() => import('views/drivers')));
const CategoriesPage = Loadable(lazy(() => import('views/categories')));
const ReportsPage = Loadable(lazy(() => import('views/reports')));
const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },
    { path: 'products', element: <ProductsPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'brands', element: <Brandspage /> },
    { path: 'occasions', element: <OccasionsPage /> },
    { path: 'vendors', element: <VendorsPage /> },
    { path: 'drivers', element: <DriversPage /> },
    { path: 'categories', element: <CategoriesPage /> },
    { path: 'reports', element: <ReportsPage /> }
  ]
};

export default MainRoutes;
