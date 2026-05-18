import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';

import Loadable from 'ui-component/Loadable';

import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../views/pages/Unauthorized/Unauthorized';

// pages
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/dashboard')));

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

    // ================= ADMIN ONLY =================

    {
      path: 'users',

      element: (
        <ProtectedRoute roles={['admin']}>
          <UsersPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'vendors',

      element: (
        <ProtectedRoute roles={['admin']}>
          <VendorsPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'drivers',

      element: (
        <ProtectedRoute roles={['admin']}>
          <DriversPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'reports',

      element: (
        <ProtectedRoute roles={['admin']}>
          <ReportsPage />
        </ProtectedRoute>
      )
    },

    // ================= ADMIN + VENDOR =================

    {
      path: 'products',

      element: (
        <ProtectedRoute roles={['admin', 'vendor']}>
          <ProductsPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'orders',

      element: (
        <ProtectedRoute roles={['admin', 'vendor']}>
          <OrdersPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'brands',

      element: (
        <ProtectedRoute roles={['admin']}>
          <Brandspage />
        </ProtectedRoute>
      )
    },

    {
      path: 'categories',

      element: (
        <ProtectedRoute roles={['admin']}>
          <CategoriesPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'occasions',

      element: (
        <ProtectedRoute roles={['admin']}>
          <OccasionsPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/unauthorized',
      element: <Unauthorized />
    }
  ]
};

export default MainRoutes;
