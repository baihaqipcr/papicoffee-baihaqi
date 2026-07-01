# 📋 DETAILED PLAN: AUTH INTEGRATION (PHASE 2)

## Plan: Supabase Auth Integration - Login/Register/Role-Based Access

**TL;DR:** Integrate Supabase Auth (email/password) into existing Login/Register pages, create global AuthContext hook untuk state management, implement role-based access control, dan add auth guards ke routes.

---

## **Overview**

### Current State (After Step 1)
```
✅ Database schema ready
✅ Supabase client initialized
✅ Tables linked to auth.users via user_id FK
❌ Login/Register belum Supabase Auth (masih axios ke dummyjson)
❌ Tidak ada global auth state
❌ Tidak ada route protection
```

### Target State (After Step 2)
```
✅ Supabase Auth fully integrated
✅ Global AuthContext untuk auth state
✅ Login page - authenticate dengan email/password
✅ Register page - create account + customer record
✅ Protected routes - redirect ke login jika belum auth
✅ Role-based access - admin vs member vs guest
✅ Header show current user info
```

---

## **Architecture Design**

### Auth Flow Diagram
```
USER → /register (public)
    ↓
    → supabase.auth.signUp(email, password)
    → INSERT INTO customers (user_id, nama, no_hp, ...)
    → Set raw_user_meta_data.role = 'member'
    → Auto-login & redirect to /dashboard/member
    
USER → /login (public)
    ↓
    → supabase.auth.signInWithPassword(email, password)
    → Read role from raw_user_meta_data
    → Redirect based on role:
       - role='admin' → /dashboard/admin
       - role='member' → /dashboard/member
       - role='guest' → / (public guest page)
    
LOGGED-IN USER → Protected Route
    ↓
    → Check auth context (user !== null)
    → Check role matching route requirement
    → Allow access or redirect to /login
    
USER → Logout
    ↓
    → supabase.auth.signOut()
    → Clear auth context
    → Redirect to / (guest page)
```

### State Flow
```
AuthContext (Global)
├── user: (Supabase user object | null)
├── role: ('admin' | 'member' | 'guest' | null)
├── customer: (customer record | null)
├── isLoading: boolean
├── error: string | null
├── signUp(email, password, form_data) → Promise
├── signIn(email, password) → Promise
├── signOut() → Promise
└── isAuthenticated: boolean computed
```

---

## **Steps**

### **1. Create AuthContext Hook** 

**File:** `src/contexts/AuthContext.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [role, setRole] = useState('guest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        if (supabaseUser) {
          setUser(supabaseUser)
          setRole(supabaseUser.user_metadata?.role || 'member')
          
          // Fetch customer data
          const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .single()
          
          setCustomer(customerData)
        } else {
          setRole('guest')
        }
      } catch (err) {
        console.error('Auth init error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setRole(session.user.user_metadata?.role || 'member')
          
          const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          setCustomer(customerData)
        } else {
          setUser(null)
          setCustomer(null)
          setRole('guest')
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Sign up dengan register
  const signUp = async (email, password, formData) => {
    try {
      setError(null)
      
      // 1. Create auth account
      const { data: authData, error: authError } = 
        await supabase.auth.signUp({ email, password })
      
      if (authError) throw authError
      
      // 2. Insert customer record
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: authData.user.id,
          nama: formData.nama,
          email: formData.email,
          no_hp: formData.no_hp,
          tanggal_lahir: formData.tanggal_lahir,
          tanggal_daftar: new Date().toISOString().split('T')[0],
          tipe_pelanggan: 'Baru',
          tier_level: 1
        })
      
      if (customerError) throw customerError
      
      // 3. Update user metadata dengan role
      await supabase.auth.updateUser({
        data: { role: 'member' }
      })
      
      setUser(authData.user)
      setRole('member')
      
      return { user: authData.user, error: null }
    } catch (err) {
      setError(err.message)
      return { user: null, error: err.message }
    }
  }

  // Sign in dengan login
  const signIn = async (email, password) => {
    try {
      setError(null)
      
      const { data, error } = 
        await supabase.auth.signInWithPassword({ email, password })
      
      if (error) throw error
      
      setUser(data.user)
      setRole(data.user.user_metadata?.role || 'member')
      
      // Fetch customer data
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
      
      setCustomer(customerData)
      
      return { user: data.user, error: null }
    } catch (err) {
      setError(err.message)
      return { user: null, error: err.message }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCustomer(null)
      setRole('guest')
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const value = {
    user,
    customer,
    role,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider')
  }
  return context
}
```

---

### **2. Create ProtectedRoute Component**

**File:** `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from './Loading'

export function ProtectedRoute({ 
  children, 
  requiredRole = null,
  redirectTo = '/login'
}) {
  const { isAuthenticated, role, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role if specified
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
```

---

### **3. Update App.jsx with AuthProvider & Protected Routes**

**File:** `src/App.jsx`

```jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './assets/tailwind.css';
import Loading from './components/Loading';

// Lazy pages...
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const OrderList = React.lazy(() => import('./pages/OrderList'));
const Customer = React.lazy(() => import('./pages/Customer'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Components = React.lazy(() => import('./pages/Components'));
const FiturXyz = React.lazy(() => import('./pages/FiturXyz'));

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
            {/* Public routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
            </Route>

            {/* Protected routes (require auth) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/customers" element={
                <ProtectedRoute requiredRole="admin">
                  <Customer />
                </ProtectedRoute>
              } />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/components" element={<Components />} />
              <Route path="/fitur-xyz" element={<FiturXyz />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

### **4. Update Login.jsx with Supabase Auth**

**File:** `src/pages/auth/Login.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    setError("");

    const { user, error: authError } = await signIn(formData.email, formData.password)

    if (authError) {
      setError(authError)
      setLoading(false)
      return
    }

    // Redirect based on role
    const role = user?.user_metadata?.role || 'member'
    if (role === 'admin') {
      navigate("/dashboard/admin")
    } else {
      navigate("/")
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Welcome Back 👋
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <BsFillExclamationDiamondFill className="text-lg" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? <ImSpinner2 className="inline animate-spin mr-2" /> : ''}
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <a href="/register" className="text-green-500 font-semibold hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
```

---

### **5. Update Register.jsx with Supabase Auth**

**File:** `src/pages/auth/Register.jsx`

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    no_hp: '',
    tanggal_lahir: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nama || !formData.email || !formData.password || !formData.no_hp) {
      setError("All fields required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    const { user, error: authError } = await signUp(formData.email, formData.password, formData)

    if (authError) {
      setError(authError)
      setLoading(false)
      return
    }

    // Success - redirect to dashboard
    navigate("/")
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Create Account 👋
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <BsFillExclamationDiamondFill className="text-lg" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="Your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="0812-3456-7890"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? <ImSpinner2 className="inline animate-spin mr-2" /> : ''}
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-green-500 font-semibold hover:underline">
          Log in
        </a>
      </p>
    </div>
  )
}
```

---

### **6. Update Header.jsx to Show User Info**

**File:** `src/components/Header.jsx`

**Add at top:**
```jsx
import { useAuth } from '../hooks/useAuth'
```

**Update user section:**
```jsx
const { user, customer, signOut } = useAuth()

// In JSX:
{user ? (
  <div className="flex items-center gap-4">
    <div className="text-right">
      <p className="text-xs text-gray-500 font-medium">Welcome,</p>
      <p className="text-sm font-bold text-gray-800 leading-tight">
        {customer?.nama || user?.email?.split('@')[0]}
      </p>
    </div>
    <button
      onClick={signOut}
      className="text-xs text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded-lg"
    >
      Logout
    </button>
  </div>
) : (
  <a href="/login" className="text-sm font-semibold text-green-500">
    Login
  </a>
)}
```

---

### **7. Add Guest Landing Page**

**File:** `src/pages/Guest.jsx`

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Guest() {
  const [cafe, setCafe] = useState(null)
  const [menus, setMenus] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const { data: cafeData } = await supabase
        .from('cafe_info')
        .select('*')
        .single()
      
      const { data: menuData } = await supabase
        .from('menus')
        .select('*')
        .eq('visible', true)

      setCafe(cafeData)
      setMenus(menuData || [])
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-green-500 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">{cafe?.nama_cafe || 'PapiCoffee'}</h1>
        <p className="text-lg opacity-90">{cafe?.deskripsi}</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Daftar Member
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Menu Section */}
      <div className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">{menu.kategori}</p>
              <h3 className="text-lg font-bold text-gray-800">{menu.nama_menu}</h3>
              <p className="text-gray-600 text-sm">{menu.deskripsi}</p>
              <div className="flex justify-between mt-3">
                <span className="font-bold text-green-600">Rp {menu.harga.toLocaleString()}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{menu.poin_reward} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Kunjungi Kami</h3>
            <p className="text-gray-600 mb-2"><strong>Alamat:</strong> {cafe?.alamat}</p>
            <p className="text-gray-600 mb-2"><strong>Jam:</strong> {cafe?.jam_buka} - {cafe?.jam_tutup}</p>
            <p className="text-gray-600"><strong>Telepon:</strong> {cafe?.nomor_telepon}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Keuntungan Member</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Kumpulkan poin setiap pembelian</li>
              <li>✓ Tukar poin dengan voucher</li>
              <li>✓ Akses tier dan diskon eksklusif</li>
              <li>✓ Priority service untuk VIP member</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### **8. Update App.jsx to Add Guest Route**

**Add before protected routes:**
```jsx
{/* Guest landing page */}
<Route path="/" element={<Guest />} />
```

---

## **Key Implementation Details**

### Auth State Management
```
AuthContext holds:
- user (Supabase user object)
- customer (record dari customers table)
- role (from user_metadata.role)
- isLoading, error
- Methods: signUp, signIn, signOut
```

### Registration Flow
```
1. User fills register form
2. signUp() is called with email, password, form data
3. auth.signUp() creates account in auth.users
4. INSERT INTO customers with user_id FK
5. updateUser() sets raw_user_meta_data.role = 'member'
6. Auto-login & redirect to dashboard
```

### Login Flow
```
1. User fills login form
2. signIn() calls auth.signInWithPassword()
3. AuthContext updates with user + role
4. Redirect based on role:
   - admin → /dashboard/admin (future)
   - member → / (dashboard)
```

### Protected Routes
```
ProtectedRoute component:
- Checks isAuthenticated
- Redirects to /login if not
- Optionally checks requiredRole
- Shows Loading while checking auth
```

---

## **Files to Create/Update**

| File | Action | Status |
|------|--------|--------|
| src/contexts/AuthContext.jsx | CREATE | 📋 Ready |
| src/components/ProtectedRoute.jsx | CREATE | 📋 Ready |
| src/App.jsx | UPDATE | 📋 Ready |
| src/pages/auth/Login.jsx | UPDATE | 📋 Ready |
| src/pages/auth/Register.jsx | UPDATE | 📋 Ready |
| src/components/Header.jsx | UPDATE | 📋 Ready |
| src/pages/Guest.jsx | CREATE | 📋 Ready |

---

## **Testing Scenarios**

### Test Case 1: Register New User
```
1. Navigate to /register
2. Fill form: nama, email, password, phone, DOB
3. Click Sign Up
4. Verify auth.users entry created
5. Verify customers row created
6. Verify auto-login & redirect to /
```

### Test Case 2: Login
```
1. Navigate to /login
2. Enter registered email & password
3. Click Log In
4. Verify AuthContext updates
5. Verify redirect to / (dashboard)
```

### Test Case 3: Protected Routes
```
1. Try to access / without login
2. Verify redirect to /login
3. Login successfully
4. Verify can access /
5. Logout
6. Verify redirect to login
```

### Test Case 4: Role-Based Access
```
1. Register as member (tier 1)
2. Try to access /customers (admin-only)
3. Verify redirect to /unauthorized
4. Admin should have access (future testing)
```

---

## **Potential Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| "FK violation" on register | customer_id not matching user_id | Ensure insert uses correct user_id from auth response |
| "Role not set" | Forgot to updateUser() | Call updateUser({ data: { role } }) after signUp |
| "AuthContext not found" error | AuthProvider not wrapping app | Ensure AuthProvider wraps BrowserRouter in App |
| Infinite redirect loop | Protected route logic wrong | Check ProtectedRoute component logic |
| Customer data not loading | Query filter wrong | Ensure eq('user_id', user.id) matches user.id type |

---

## **Success Criteria**

- [ ] AuthContext hook created & functional
- [ ] ProtectedRoute component redirects correctly
- [ ] Register flow: auth + customer insert + auto-login
- [ ] Login flow: auth + role check + redirect
- [ ] Header shows logged-in user info
- [ ] Logout clears auth state
- [ ] Protected routes require authentication
- [ ] Guest page loads menus from database
- [ ] No console errors or warnings
- [ ] All test scenarios pass

---

## **Approval Checklist**

- [ ] Plan matches PRD requirements?
- [ ] All components identified?
- [ ] Auth flow clear?
- [ ] Test scenarios comprehensive?
- [ ] Ready to implement?

---

**This plan includes all code snippets ready for implementation. Next: User review & approval before Step 2 execution!**
