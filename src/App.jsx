import React, { Suspense } from 'react';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './assets/tailwind.css';
import Loading from './components/Loading';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';

// --- Import Halaman Menggunakan React.lazy ---
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const OrderList = React.lazy(() => import('./pages/OrderList'));
const Customer = React.lazy(() => import('./pages/Customer'));
const Menu = React.lazy(() => import('./pages/Menu'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const MemberDashboard = React.lazy(() => import('./pages/dashboard/MemberDashboard'));
const AdminCustomers = React.lazy(() => import('./pages/dashboard/AdminCustomers'));
const DashboardRedirect = React.lazy(() => import('./pages/dashboard/DashboardRedirect'));

const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Forgot = React.lazy(() => import('./pages/auth/Forgot'));

const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />

            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Member']}><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/dashboard/member" element={<ProtectedRoute allowedRoles={['Member']}><MemberDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/admin/customers" element={<ProtectedRoute allowedRoles={['Admin']}><AdminCustomers /></ProtectedRoute>} />

              <Route path="/orders" element={<OrderList />} />
              <Route path="/customers" element={<Customer />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products/:id" element={<ProductDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}