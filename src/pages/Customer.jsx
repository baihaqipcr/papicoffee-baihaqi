/**
 * Customer.jsx � Halaman Customer dengan CRUD menggunakan Supabase
 */

import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { supabase } from '../lib/supabase'
import CUSTOMERS from './customers.json'

const EMPTY_FORM = {
  customer_id: '',
  nama: '',
  no_hp: '',
  email: '',
  tanggal_lahir: '',
  tanggal_daftar: '',
  tipe_pelanggan: '',
  menu_favorit: '',
  tingkat_gula_favorit: '',
  avatar_seed: '',
}

const getSeed = name => (name || '').trim().split(' ')[0]?.toLowerCase() || 'customer'

const normalizeCustomer = c => ({
  // map older sample keys to new schema
  customer_id: c.customer_id ?? (c.id ? String(c.id) : undefined) ?? c.customer_id,
  nama: c.nama ?? c.name ?? c.Nama ?? '',
  no_hp: c.no_hp ?? c.phone ?? c.no_hp ?? '',
  email: c.email ?? '',
  tanggal_lahir: c.tanggal_lahir ?? c.tanggal_lahir ?? c.tanggal_lahir ?? '',
  tanggal_daftar: c.tanggal_daftar ?? c.joined_date ?? c.joined ?? '',
  tipe_pelanggan: c.tipe_pelanggan ?? c.status ?? '',
  menu_favorit: c.menu_favorit ?? '',
  tingkat_gula_favorit: c.tingkat_gula_favorit ?? '',
})

function CustomerTalentCard({ c, onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-transparent hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden">
      <button className="absolute top-6 right-6 text-gray-300 hover:text-purple-600 transition-colors">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      <div className="relative mb-4 mt-2">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-50 group-hover:ring-purple-100 transition-all duration-500 transform group-hover:scale-105">
          <img
            src={`https://picsum.photos/seed/${c.avatar_seed || getSeed(c.nama)}/150/150`}
            alt={c.nama}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.nama}&background=f3e8ff&color=a855f7&size=150` }}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-orange-200">
          <span className="text-xs">★</span> 4.5
        </div>
      </div>

      <h3 className="text-lg font-black text-gray-800 mb-0.5 group-hover:text-purple-700 transition-colors">{c.nama}</h3>
      <p className="text-xs font-bold text-gray-400 mb-2">@{(c.nama || '').toLowerCase().replace(/\s/g, '')}</p>
      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-wider">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {c.no_hp || c.city || ''}
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed mb-6 px-2 line-clamp-2">
        Pelanggan setia Papi Coffee yang menyukai varian Arabica dan sering menghabiskan waktu untuk bekerja.
      </p>

      <div className="w-full space-y-3 mb-4">
        <StatBar label="Loyalty" value={85} color="bg-purple-600" />
        <StatBar label="Visit Frequency" value={60} color="bg-purple-600" />
        <StatBar label="Satisfaction" value={92} color="bg-purple-600" />
      </div>

      <div className="flex w-full justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onEdit(c)}
          className="rounded-2xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(c)}
          className="rounded-2xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function StatBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{label}</span>
        <span className="text-[10px] font-black text-gray-800">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function Customer() {
  const [customers, setCustomers] = useState(CUSTOMERS.map(normalizeCustomer))
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  const loadCustomers = async (p = page) => {
    setLoading(true)
    const from = (p - 1) * perPage
    const to = from + perPage - 1
    const { data, error, count } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (error) {
      console.error('Supabase fetch error:', error)
      setCustomers(CUSTOMERS.map(normalizeCustomer))
      setTotal(CUSTOMERS.length)
    } else {
      setCustomers((data || []).map(normalizeCustomer))
      setTotal(count ?? (data ? data.length : 0))
    }

    setLoading(false)
  }

  useEffect(() => {
    loadCustomers(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage])

  const filteredCustomers = useMemo(() => {
    if (!search) return customers
    const term = search.toLowerCase()
    return customers.filter(c =>
      c.nama?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.no_hp?.toLowerCase().includes(term) ||
      c.tipe_pelanggan?.toLowerCase().includes(term)
    )
  }, [search, customers])

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageStart = page > 6 ? page - 5 : 1
  const pageEnd = Math.min(totalPages, pageStart + 5)
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i)

  const openNewCustomer = () => {
    setForm(EMPTY_FORM)
    setEditing(null)
    setError('')
    setShowForm(true)
  }

  const openEditCustomer = customer => {
    setForm({ ...customer })
    setEditing(customer)
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setForm(EMPTY_FORM)
    setEditing(null)
    setError('')
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      customer_id: editing?.customer_id || form.customer_id || (crypto?.randomUUID ? crypto.randomUUID() : `c_${Date.now()}`),
      nama: form.nama,
      no_hp: form.no_hp,
      email: form.email,
      tanggal_lahir: form.tanggal_lahir || null,
      tanggal_daftar: form.tanggal_daftar || null,
      tipe_pelanggan: form.tipe_pelanggan,
      menu_favorit: form.menu_favorit,
      tingkat_gula_favorit: form.tingkat_gula_favorit,
    }

    if (!payload.nama || !payload.no_hp) {
      setError('Nama dan No HP wajib diisi.')
      setSaving(false)
      return
    }

    try {
      if (editing) {
        const { data, error } = await supabase
          .from('customers')
          .update(payload)
          .eq('customer_id', editing.customer_id)
          .select()
          .single()

        if (error) throw error
        if (data) {
          // reload current page to keep pagination consistent
          await loadCustomers(page)
        }
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert([payload])
          .select()
          .single()

        if (error) throw error
        if (data) {
          // after insert, go to first page to show the newest record
          setPage(1)
          await loadCustomers(1)
        }
      }

      closeForm()
    } catch (err) {
      console.error('Supabase save error:', err)
      setError(err.message || 'Gagal menyimpan data customer.')
    }

    setSaving(false)
  }

  const handleDelete = async customer => {
    if (!window.confirm(`Hapus customer ${customer.nama}?`)) return

    try {
      const { error } = await supabase.from('customers').delete().eq('customer_id', customer.customer_id)
      if (error) throw error
      setCustomers(prev => prev.filter(item => item.customer_id !== customer.customer_id))
    } catch (err) {
      console.error('Supabase delete error:', err)
      window.alert('Gagal menghapus customer.')
    }
  }

  return (
    <div className="space-y-6 bg-[#f8f9fd] min-h-screen p-2">
      <PageHeader
        title="Customers"
        subtitle="Manage your customer list with create, edit, and delete actions"
        breadcrumb={['Dashboard', 'Customers']}
      >
        <button
          type="button"
          onClick={openNewCustomer}
          className="rounded-2xl bg-[#4338ca] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#3730a3]"
        >
          Add Customer
        </button>
      </PageHeader>

      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-500">Customer CRUD</div>
            <span className="text-sm text-gray-400">Total: {customers.length}</span>
          </div>

          <div className="flex flex-1 items-center gap-3 max-w-2xl">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="search"
              placeholder="Search by nama, email, no_hp, tipe_pelanggan..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] bg-white p-4 shadow-sm border border-gray-50">
        {loading ? (
          <div className="py-24 text-center text-gray-500">Loading customers...</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Nama</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">No HP</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Tanggal Lahir</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Tanggal Daftar</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Tipe Pelanggan</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Menu Favorit</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Tingkat Gula Favorit</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-10 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => (
                    <tr key={customer.customer_id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-4 py-4 font-semibold text-gray-800">{customer.nama}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.no_hp}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.email}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.tanggal_lahir}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.tanggal_daftar}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.tipe_pelanggan}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.menu_favorit}</td>
                      <td className="px-4 py-4 text-gray-500">{customer.tingkat_gula_favorit}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditCustomer(customer)}
                            className="rounded-2xl bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(customer)}
                            className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between px-2">
              <div className="text-sm text-gray-500">
                Menampilkan {total === 0 ? 0 : (page - 1) * perPage + 1} - {Math.min(page * perPage, total)} dari {total}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-2xl border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Prev
                </button>

                {pageStart > 1 && (
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    className="rounded-2xl px-3 py-2 text-sm font-semibold bg-white border"
                  >
                    1
                  </button>
                )}
                {pageStart > 2 && (
                  <span className="px-2 text-sm text-gray-500">...</span>
                )}

                {visiblePages.map(pageNumber => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-2xl px-3 py-2 text-sm font-semibold ${page === pageNumber ? 'bg-purple-600 text-white' : 'bg-white border'}`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {pageEnd < totalPages - 1 && (
                  <span className="px-2 text-sm text-gray-500">...</span>
                )}
                {pageEnd < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className="rounded-2xl px-3 py-2 text-sm font-semibold bg-white border"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => page < totalPages && setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-2xl border px-3 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between gap-3 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editing ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editing ? 'Update the customer data.' : 'Create a new customer record.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full bg-gray-100 px-4 py-3 text-gray-500 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Nama
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                No HP
                <input
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Email
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Tanggal Lahir
                <input
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleChange}
                  type="date"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Tanggal Daftar
                <input
                  name="tanggal_daftar"
                  value={form.tanggal_daftar}
                  onChange={handleChange}
                  type="date"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Tipe Pelanggan
                <select
                  name="tipe_pelanggan"
                  value={form.tipe_pelanggan}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                >
                  <option value="">-- Pilih --</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Menu Favorit
                <input
                  name="menu_favorit"
                  value={form.menu_favorit}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700">
                Tingkat Gula Favorit
                <input
                  name="tingkat_gula_favorit"
                  value={form.tingkat_gula_favorit}
                  onChange={handleChange}
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-700 sm:col-span-2">
                Avatar Seed (opsional)
                <input
                  name="avatar_seed"
                  value={form.avatar_seed}
                  onChange={handleChange}
                  type="text"
                  placeholder="seed for avatar generation"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-purple-500"
                />
              </label>

              {error && (
                <div className="sm:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                >
                  {saving ? 'Saving...' : editing ? 'Update Customer' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
