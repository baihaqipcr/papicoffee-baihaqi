# 📋 DETAILED PLAN: ADMIN PANEL CRUD (PHASE 3)

## Plan: Customer Management with Supabase Database Integration

**TL;DR:** Update existing Customer.jsx CRUD interface dengan real Supabase queries. Implement useCustomers hook dengan create/read/update/delete methods, add form validation, toast notifications, dan real-time data sync dari customers table.

---

## **Overview**

### Current State (After Step 2)
```
✅ Database customers table ready
✅ Auth system ready (admin/member roles)
✅ UI components exist (buttons, modals, forms)
❌ CRUD operations belum Supabase (masih in-memory)
❌ Tidak ada real data persistence
❌ Tidak ada form validation yang robust
```

### Target State (After Step 3)
```
✅ Create customer → INSERT INTO customers
✅ Read customers → SELECT * FROM customers with filters
✅ Update customer → UPDATE customers SET ...
✅ Delete customer → DELETE FROM customers (with confirmation)
✅ Search & filter by nama, email, tier
✅ Form validation dengan error messages
✅ Toast notifications (success/error)
✅ Real-time data refresh after mutations
✅ Admin can manage all customers
```

---

## **Architecture Design**

### CRUD Flow Diagram
```
┌─────────────────────────────────────────────────────────┐
│              Customer Management Page                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  useCustomers Hook (state + methods)                    │
│  ├── customers: array of customer records              │
│  ├── loading: boolean                                   │
│  ├── error: string | null                              │
│  ├── fetchCustomers() → SELECT query                   │
│  ├── createCustomer(data) → INSERT query               │
│  ├── updateCustomer(id, data) → UPDATE query           │
│  ├── deleteCustomer(id) → DELETE query                 │
│  └── searchCustomers(query) → filtered array           │
│                                                         │
│  Components:                                            │
│  ├── CustomerList (table display)                      │
│  ├── CustomerForm (create/edit modal)                  │
│  ├── SearchBar (filter customers)                      │
│  └── ToastNotification (success/error)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
1. Component Mount
   ↓
   fetchCustomers() → Supabase SELECT
   ↓
   setCustomers([...]) → state update
   ↓
   Component re-render dengan data

2. Create Flow
   ↓
   User submit form
   ↓
   Validate input
   ↓
   createCustomer() → Supabase INSERT
   ↓
   Success: toast + refresh list
   ↓
   Error: show toast error

3. Update Flow
   ↓
   User click Edit
   ↓
   Modal opens with pre-filled data
   ↓
   User submit form
   ↓
   updateCustomer() → Supabase UPDATE
   ↓
   Success: toast + refresh list

4. Delete Flow
   ↓
   User click Delete
   ↓
   Show confirm dialog
   ↓
   User confirm
   ↓
   deleteCustomer() → Supabase DELETE
   ↓
   Success: toast + remove dari state
```

---

## **Steps**

### **1. Create useCustomers Hook**

**File:** `src/hooks/useCustomers.js`

```javascript
import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all customers
  const fetchCustomers = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('customers')
        .select('*, tier_rules:tier_level(tier_name, diskon_default)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Add search filter if provided
      if (searchQuery) {
        query = query.or(
          `nama.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,no_hp.ilike.%${searchQuery}%`
        )
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setCustomers(data || [])
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new customer
  const createCustomer = useCallback(async (formData) => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!formData.nama || !formData.email || !formData.no_hp) {
        throw new Error('Nama, email, dan no HP harus diisi')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Format email tidak valid')
      }

      // Check if email already exists
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existing) {
        throw new Error('Email sudah terdaftar')
      }

      // Calculate tier based on tipe_pelanggan
      const tierMap = {
        'Baru': 1,
        'Aktif': 2,
        'VIP': 3,
        'Dormant': 1
      }
      const tier_level = tierMap[formData.tipe_pelanggan] || 1

      const { data, error: insertError } = await supabase
        .from('customers')
        .insert({
          nama: formData.nama,
          email: formData.email,
          no_hp: formData.no_hp,
          tanggal_lahir: formData.tanggal_lahir || null,
          tipe_pelanggan: formData.tipe_pelanggan || 'Baru',
          tier_level,
          tanggal_daftar: new Date().toISOString().split('T')[0],
          menu_favorit: formData.menu_favorit || null,
          tingkat_gula_favorit: formData.tingkat_gula_favorit || 'Normal',
          is_active: true
        })
        .select()

      if (insertError) throw insertError

      // Add to state
      setCustomers(prev => [data[0], ...prev])

      return { data: data[0], error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update customer
  const updateCustomer = useCallback(async (id, formData) => {
    try {
      setLoading(true)
      setError(null)

      // Validate
      if (!formData.nama || !formData.email || !formData.no_hp) {
        throw new Error('Nama, email, dan no HP harus diisi')
      }

      // Calculate tier
      const tierMap = {
        'Baru': 1,
        'Aktif': 2,
        'VIP': 3,
        'Dormant': 1
      }
      const tier_level = tierMap[formData.tipe_pelanggan] || 1

      const { data, error: updateError } = await supabase
        .from('customers')
        .update({
          nama: formData.nama,
          email: formData.email,
          no_hp: formData.no_hp,
          tanggal_lahir: formData.tanggal_lahir || null,
          tipe_pelanggan: formData.tipe_pelanggan || 'Baru',
          tier_level,
          menu_favorit: formData.menu_favorit || null,
          tingkat_gula_favorit: formData.tingkat_gula_favorit || 'Normal',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      // Update state
      setCustomers(prev =>
        prev.map(c => (c.id === id ? data[0] : c))
      )

      return { data: data[0], error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete customer
  const deleteCustomer = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Remove from state
      setCustomers(prev => prev.filter(c => c.id !== id))

      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Search customers
  const searchCustomers = useCallback((searchQuery) => {
    return customers.filter(c =>
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.no_hp.includes(searchQuery)
    )
  }, [customers])

  // Initialize on mount
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
  }
}
```

---

### **2. Create Toast Notification System**

**File:** `src/components/Toast.jsx`

```jsx
import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type }

    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

export function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-700'
              : toast.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          <span>
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

### **3. Create CustomerForm Component**

**File:** `src/components/CustomerForm.jsx`

```jsx
import { useState, useEffect } from 'react'

export function CustomerForm({ 
  customer = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    tanggal_lahir: '',
    tipe_pelanggan: 'Baru',
    menu_favorit: '',
    tingkat_gula_favorit: 'Normal'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    }
  }, [customer])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.no_hp.trim()) {
      newErrors.no_hp = 'Nomor HP harus diisi'
    }

    if (formData.tanggal_lahir && new Date(formData.tanggal_lahir) > new Date()) {
      newErrors.tanggal_lahir = 'Tanggal lahir tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nama */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Masukkan nama"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.nama ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nama && (
          <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nomor HP
        </label>
        <input
          type="tel"
          name="no_hp"
          value={formData.no_hp}
          onChange={handleChange}
          placeholder="0812-3456-7890"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.no_hp ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.no_hp && (
          <p className="text-xs text-red-500 mt-1">{errors.no_hp}</p>
        )}
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tanggal Lahir
        </label>
        <input
          type="date"
          name="tanggal_lahir"
          value={formData.tanggal_lahir}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Customer Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tipe Pelanggan
        </label>
        <select
          name="tipe_pelanggan"
          value={formData.tipe_pelanggan}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Baru">Baru</option>
          <option value="Aktif">Aktif</option>
          <option value="VIP">VIP</option>
          <option value="Dormant">Dormant</option>
        </select>
      </div>

      {/* Favorite Menu */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Menu Favorit
        </label>
        <input
          type="text"
          name="menu_favorit"
          value={formData.menu_favorit}
          onChange={handleChange}
          placeholder="Kopi Sanger"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Sugar Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tingkat Gula Favorit
        </label>
        <select
          name="tingkat_gula_favorit"
          value={formData.tingkat_gula_favorit}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Minim">Minim</option>
          <option value="Normal">Normal</option>
          <option value="Banyak">Banyak</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
        >
          {loading ? 'Menyimpan...' : customer ? 'Update' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}
```

---

### **4. Update Customer.jsx with Supabase Integration**

**File:** `src/pages/Customer.jsx`

Replace entire file with:

```jsx
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useCustomers } from '../hooks/useCustomers'
import { useToast, Toast } from '../components/Toast'
import { CustomerForm } from '../components/CustomerForm'

function CustomerCard({ c }) {
  const isActive = c.is_active && c.tier_rules?.tier_name
  const tierColor = {
    'Baru': 'bg-gray-100 text-gray-700',
    'Aktif': 'bg-blue-100 text-blue-700',
    'VIP': 'bg-purple-100 text-purple-700',
    'Exclusive': 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${c.nama}&size=48`}
          alt={c.nama}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
        />
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
          c.is_active ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{c.nama}</p>
        <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
          tierColor[c.tier_rules?.tier_name] || 'bg-gray-100'
        }`}>
          {c.tier_rules?.tier_name || 'Unknown'}
        </p>
      </div>
    </div>
  )
}

function CustomerTableRow({ c, onEdit, onDelete }) {
  const tierColor = {
    'Baru': 'bg-gray-100 text-gray-700',
    'Aktif': 'bg-blue-100 text-blue-700',
    'VIP': 'bg-purple-100 text-purple-700',
    'Exclusive': 'bg-yellow-100 text-yellow-700'
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${c.nama}&size=40`}
            alt={c.nama}
            className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{c.nama}</p>
            <p className="text-xs text-gray-400">{c.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{c.no_hp}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{c.tipe_pelanggan}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          tierColor[c.tier_rules?.tier_name] || 'bg-gray-100'
        }`}>
          {c.tier_rules?.tier_name || 'Unknown'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{c.saldo_poin}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {c.is_active ? 'Aktif' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(c)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(c.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function Customer() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer, fetchCustomers } = useCustomers()
  const { toasts, addToast, removeToast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const filteredCustomers = customers.filter(c =>
    c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.no_hp.includes(searchTerm)
  )

  const topCustomers = [...customers]
    .sort((a, b) => b.saldo_poin - a.saldo_poin)
    .slice(0, 4)

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      return
    }

    setFormLoading(true)
    deleteCustomer(id).then(({ error }) => {
      if (error) {
        addToast(`Error: ${error}`, 'error')
      } else {
        addToast('Customer berhasil dihapus', 'success')
      }
      setFormLoading(false)
    })
  }

  const handleSaveCustomer = async (formData) => {
    setFormLoading(true)

    let result
    if (editingCustomer) {
      result = await updateCustomer(editingCustomer.id, formData)
    } else {
      result = await createCustomer(formData)
    }

    if (result.error) {
      addToast(`Error: ${result.error}`, 'error')
    } else {
      addToast(
        editingCustomer ? 'Customer berhasil diupdate' : 'Customer berhasil ditambah',
        'success'
      )
      setIsModalOpen(false)
      setEditingCustomer(null)
    }

    setFormLoading(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer"
        breadcrumb={['Dashboard', 'Management', 'Customer']}
      >
        <button
          onClick={handleAddCustomer}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <span>+</span> Add Customer
        </button>
      </PageHeader>

      {/* Top Customers & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Customers (by Poin)</h3>
          <div className="space-y-3">
            {topCustomers.map(c => (
              <CustomerCard key={c.id} c={c} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-lg font-bold text-gray-800">{customers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-lg font-bold text-green-600">
                {customers.filter(c => c.is_active).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">VIP Tier</span>
              <span className="text-lg font-bold text-purple-600">
                {customers.filter(c => c.tier_level === 3).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Poin</span>
              <span className="text-lg font-bold text-gray-800">
                {customers.reduce((sum, c) => sum + c.saldo_poin, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">All Customers</h3>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Points
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => (
                    <CustomerTableRow
                      key={c.id}
                      c={c}
                      onEdit={handleEditCustomer}
                      onDelete={handleDeleteCustomer}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'No customers found' : 'No customers yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <CustomerForm
              customer={editingCustomer}
              onSubmit={handleSaveCustomer}
              onCancel={handleCloseModal}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
```

---

### **5. Create useCustomers Hook Export**

**File:** `src/hooks/index.js`

```javascript
export { useCustomers } from './useCustomers'
```

---

## **Error Handling Strategy**

```javascript
// Handle errors gracefully
try {
  const result = await createCustomer(formData)
  if (result.error) {
    addToast(`Error: ${result.error}`, 'error')
    return
  }
  addToast('Success!', 'success')
} catch (err) {
  addToast(`Unexpected error: ${err.message}`, 'error')
}
```

---

## **Testing Scenarios**

### Test 1: Create Customer
```
✓ Form validation (empty fields, invalid email)
✓ Duplicate email check
✓ Auto-calculate tier based on tipe_pelanggan
✓ Customer inserted into database
✓ Success toast shown
✓ Modal closes
✓ New customer appears in list
```

### Test 2: Update Customer
```
✓ Form pre-fills with existing data
✓ Change data
✓ Submit update
✓ Customer record updated in database
✓ List refreshes with new data
✓ Success toast shown
```

### Test 3: Delete Customer
```
✓ Click delete
✓ Confirm dialog appears
✓ User confirms
✓ Customer deleted from database
✓ Customer removed from UI list
✓ Success toast shown
```

### Test 4: Search & Filter
```
✓ Type in search box
✓ List filters by nama/email/phone
✓ Real-time filtering
✓ Clear search shows all
```

### Test 5: Error Handling
```
✓ Duplicate email shows error
✓ Invalid email format shows error
✓ Database error shows toast
✓ Network error handled gracefully
```

---

## **Key Features**

✅ **CRUD Operations**
- Create: Form validation + auto-tier calculation
- Read: SELECT with real-time refresh
- Update: Pre-filled form + update query
- Delete: Confirm dialog + cascade delete

✅ **Form Validation**
- Required fields check
- Email format validation
- Unique email check
- Date validation

✅ **User Feedback**
- Toast notifications (success/error)
- Loading states
- Error messages in form
- Confirmation dialogs

✅ **Search & Filter**
- Real-time search by nama/email/phone
- Case-insensitive search
- Filter results display

✅ **UI/UX**
- Modal for create/edit
- Responsive table
- Top customers cards
- Statistics display
- Loading states

---

## **Files to Create/Update**

| File | Action | Status |
|------|--------|--------|
| src/hooks/useCustomers.js | CREATE | 📋 Ready |
| src/hooks/index.js | CREATE | 📋 Ready |
| src/components/Toast.jsx | CREATE | 📋 Ready |
| src/components/CustomerForm.jsx | CREATE | 📋 Ready |
| src/pages/Customer.jsx | UPDATE | 📋 Ready |

---

## **Success Criteria**

- [ ] useCustomers hook CRUD all working
- [ ] Form validation robust
- [ ] Toast notifications showing
- [ ] Create customer → INSERT works
- [ ] Update customer → UPDATE works
- [ ] Delete customer → DELETE works
- [ ] Search filters in real-time
- [ ] Error handling comprehensive
- [ ] UI responsive & polished
- [ ] No console errors

---

**Ready for implementation? Plan approved by user before proceeding!**
