import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import PageHeader from '../../components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function CustomerModal({ open, customer, onClose, onChange, onSave, saving, error }) {
  if (!open || !customer) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900">Edit Pelanggan</h2>
            <p className="text-sm text-stone-500">Perbarui data pelanggan dengan cepat dan aman.</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">✕</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-600">
            Nama
            <input
              value={customer.nama}
              onChange={(e) => onChange('nama', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <label className="space-y-2 text-sm text-stone-600">
            Email
            <input
              type="email"
              value={customer.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <label className="space-y-2 text-sm text-stone-600">
            Tipe Pelanggan
            <input
              value={customer.tipe_pelanggan}
              onChange={(e) => onChange('tipe_pelanggan', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <label className="space-y-2 text-sm text-stone-600">
            Role
            <input
              value={customer.role}
              onChange={(e) => onChange('role', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <label className="md:col-span-2 space-y-2 text-sm text-stone-600">
            Menu Favorit
            <input
              value={customer.menu_favorit}
              onChange={(e) => onChange('menu_favorit', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCustomers() {
  const { isLoading } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('id,nama,email,tipe_pelanggan,menu_favorit,role')
        .order('nama', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setCustomers(data || [])
    } catch (err) {
      console.warn('Failed to load customers:', err)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const openEditor = (customer) => {
    setSelectedCustomer({ ...customer })
    setError('')
    setModalOpen(true)
  }

  const handleModalChange = (field, value) => {
    setSelectedCustomer((prev) => ({ ...prev, [field]: value }))
  }

  const saveCustomer = async () => {
    if (!selectedCustomer) return
    setSaving(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          nama: selectedCustomer.nama,
          email: selectedCustomer.email,
          tipe_pelanggan: selectedCustomer.tipe_pelanggan,
          menu_favorit: selectedCustomer.menu_favorit,
          role: selectedCustomer.role,
        })
        .eq('id', selectedCustomer.id)

      if (updateError) {
        throw updateError
      }

      await loadCustomers()
      setModalOpen(false)
    } catch (err) {
      setError(err.message || 'Gagal memperbarui pelanggan.')
    } finally {
      setSaving(false)
    }
  }

  const columns = useMemo(
    () => [
      { label: 'Nama', key: 'nama' },
      { label: 'Email', key: 'email' },
      { label: 'Tipe Pelanggan', key: 'tipe_pelanggan' },
      { label: 'Menu Favorit', key: 'menu_favorit' },
      { label: 'Role', key: 'role' },
      { label: 'Status', key: 'status' },
    ],
    []
  )

  const getCellValue = (customer, column) => {
    if (column.key === 'status') {
      return customer.role === 'Member' ? 'Aktif' : 'Nonaktif'
    }
    return customer[column.key] || '-'
  }

  const toggleActivation = async (customer) => {
    const newRole = customer.role === 'Member' ? 'Inactive' : 'Member'
    setSaving(true)
    setError('')

    try {
      const { error: activateError } = await supabase
        .from('customers')
        .update({ role: newRole })
        .eq('id', customer.id)

      if (activateError) {
        throw activateError
      }

      await loadCustomers()
    } catch (err) {
      setError(err.message || 'Gagal mengubah status pelanggan.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Pelanggan"
        subtitle="Lihat, edit, dan kelola data pelanggan dari dashboard admin."
      />

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Daftar Pelanggan</CardTitle>
            <CardDescription>Semua akun pelanggan yang tersimpan di sistem.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-left text-sm text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wide text-xs">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3">{column.label}</th>
                ))}
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 align-top">{getCellValue(customer, column)}</td>
                  ))}
                  <td className="px-4 py-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditor(customer)}>
                        Lihat / Edit
                      </Button>
                      <Button size="sm" onClick={() => toggleActivation(customer)}>
                        {customer.role === 'Member' ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <CustomerModal
        open={modalOpen}
        customer={selectedCustomer}
        onClose={() => setModalOpen(false)}
        onChange={handleModalChange}
        onSave={saveCustomer}
        saving={saving}
        error={error}
      />
    </div>
  )
}
