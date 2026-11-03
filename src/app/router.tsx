import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ExpensesPage } from '../features/expenses/ExpensesPage';
import { LotsListPage } from '../features/lots/LotsListPage';
import { LotDetailPage } from '../features/lots/LotDetailPage';
import { TraceabilityPage } from '../features/traceability/TraceabilityPage';
import { PublicTracePage } from '../features/traceability/PublicTracePage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { NotFoundPage } from '../features/NotFoundPage';

export const router = createBrowserRouter([
  // Routes quản trị bên trong MainLayout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'production-lots',
        element: <LotsListPage />,
      },
      {
        path: 'production-lots/:id',
        element: <LotDetailPage />,
      },
      {
        path: 'traceability',
        element: <TraceabilityPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // Route truy xuất nguồn gốc công khai cho người tiêu dùng (Độc lập, không có sidebar)
  {
    path: '/trace/:code',
    element: <PublicTracePage />,
  },
]);
