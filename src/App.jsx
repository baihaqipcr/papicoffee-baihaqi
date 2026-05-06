import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './assets/tailwind.css';
import Loading from './components/Loading';

// --- Import Halaman Menggunakan React.lazy ---
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const OrderList = React.lazy(() => import('./pages/OrderList'));
const Customer  = React.lazy(() => import('./pages/Customer'));

const Login    = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Forgot   = React.lazy(() => import('./pages/auth/Forgot'));

const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {



  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Layout Utama (Pakai Sidebar) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/customers" element={<Customer />} />
          </Route>

          {/* Layout Auth (Tanpa Sidebar) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>

            {/* Halaman 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}