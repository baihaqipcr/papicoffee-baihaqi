import React, { Suspense, useEffect, useState } from 'react';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './assets/tailwind.css';
import Loading from './components/Loading';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// --- Import Halaman Menggunakan React.lazy ---
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const OrderList = React.lazy(() => import('./pages/OrderList'));
const Customer = React.lazy(() => import('./pages/Customer'));
const Menu = React.lazy(() => import('./pages/Menu'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Inventory = React.lazy(() => import('./pages/Inventory'));

const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Forgot = React.lazy(() => import('./pages/auth/Forgot'));

const NotFound = React.lazy(() => import('./pages/NotFound'));

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) {
          console.warn('Supabase session error:', error.message);
          setSession(null);
        } else {
          setSession(data?.session ?? null);
        }
      } catch (err) {
        if (!mounted) return;
        console.warn('Session load failed:', err);
        setSession(null);
      } finally {
        if (mounted) {
          setAuthChecked(true);
        }
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (!authChecked) {
    return <Loading />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Layout Utama (Pakai Sidebar) */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/products/:id" element={<ProductDetail />} />
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