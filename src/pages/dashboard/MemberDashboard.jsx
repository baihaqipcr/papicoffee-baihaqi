import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '../../components/PageHeader'

export default function MemberDashboard() {
  const { user, customer, isLoading, refreshCustomer } = useAuth()
  const [menuFavorit, setMenuFavorit] = useState('')
  const [tingkatGula, setTingkatGula] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (customer) {
      setMenuFavorit(customer.menu_favorit || '')
      setTingkatGula(customer.tingkat_gula_favorit || '')
    }
  }, [customer])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setStatusMessage('')

    try {
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          menu_favorit: menuFavorit,
          tingkat_gula_favorit: tingkatGula,
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      await refreshCustomer()
      setStatusMessage('Preferensi berhasil disimpan.')
    } catch (err) {
      setError(err.message || 'Tidak dapat menyimpan preferensi. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="rounded-[2rem] bg-white p-10 shadow-md border border-stone-200 text-center max-w-xl">
          <p className="text-stone-600">Profil Anda belum tersedia. Silakan hubungi admin untuk aktivasi data pelanggan.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Member"
        subtitle="Perbarui preferensi Anda dan lihat profil pelanggan secara langsung."
      />

      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Profil Saya</CardTitle>
            <CardDescription>Informasi profil yang hanya dapat dilihat oleh Anda.</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Nama</h3>
              <p className="mt-2 text-lg font-semibold text-stone-900">{customer.nama}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Email</h3>
              <p className="mt-2 text-lg font-semibold text-stone-900">{customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Tipe Pelanggan</h3>
              <p className="mt-2 text-lg font-semibold text-stone-900">{customer.tipe_pelanggan || 'Member'}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-stone-600">Menu Favorit</label>
              <input
                type="text"
                value={menuFavorit}
                onChange={(e) => setMenuFavorit(e.target.value)}
                className="mt-2 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                placeholder="Contoh: Espresso Double"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600">Tingkat Gula Favorit</label>
              <input
                type="text"
                value={tingkatGula}
                onChange={(e) => setTingkatGula(e.target.value)}
                className="mt-2 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                placeholder="Contoh: Sedikit Manis"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}

            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={saving} className="rounded-2xl">
                {saving ? 'Menyimpan...' : 'Simpan Preferensi'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
