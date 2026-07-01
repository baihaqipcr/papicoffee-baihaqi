import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { user, role, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      if (role === 'Admin') {
        navigate('/dashboard/admin/customers', { replace: true })
      } else {
        navigate('/dashboard/member', { replace: true })
      }
    }
  }, [isLoading, user, role, navigate])

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-12 shadow-xl shadow-stone-200/50">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 mb-4">Selamat datang di Papi Coffee</span>
          <h1 className="text-5xl font-black tracking-tight text-stone-900 mb-6">Dashboard manajemen kedai kopi yang bersahabat.</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-600 mb-10">Login atau daftar untuk mengelola pelanggan dan preferensi Member. Admin memiliki akses penuh untuk melihat dan mengedit data pelanggan.</p>

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="/login" className="px-6 py-3">Login</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register" className="px-6 py-3">Register</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
