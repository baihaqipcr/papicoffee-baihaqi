import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const PRODUCTS = [
  { id: 1, title: 'Pistachio Latte', category: 'Kopi', price: 85000, description: 'Perpaduan espresso premium dengan susu creamy dan pistachio pilihan yang menghasilkan rasa lembut dan mewah.', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop', stock: 24, rating: 4.8 },
  { id: 2, title: 'Caramel Latte', category: 'Kopi', price: 45000, description: 'Espresso hangat dengan caramel manis dan foam susu lembut yang cocok dinikmati kapan saja.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop', stock: 18, rating: 4.7 },
  { id: 3, title: 'Kopapi Susu', category: 'Kopi', price: 120000, description: 'Kopi susu khas Papi Coffee dengan cita rasa creamy dan aroma roasted beans yang kuat.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop', stock: 12, rating: 4.9 },
  { id: 4, title: 'Macchiato', category: 'Kopi', price: 75000, description: 'Minuman espresso klasik dengan sentuhan foam susu tipis dan rasa kopi yang bold.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop', stock: 10, rating: 4.6 },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = PRODUCTS.find((item) => String(item.id) === String(id))

  if (!product) {
    return (
      <div className="space-y-6 bg-[#faf8f5] min-h-screen p-6">
        <PageHeader title="Menu Tidak Ditemukan" subtitle="Silakan pilih pesanan yang tersedia di daftar." showFilter={false} />
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-stone-200 text-center">
          <p className="text-stone-500 mb-6">Maaf, item yang kamu minta tidak tersedia atau telah dihapus.</p>
          <Link to="/orders" className="inline-flex items-center justify-center rounded-2xl bg-[#f59e0b] px-6 py-3 text-sm font-bold text-[#451a03] hover:bg-[#fbbf24] transition-all">
            Kembali ke Daftar Pesanan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-[#faf8f5] min-h-screen p-6">
      <PageHeader title="Detail Menu" subtitle={`Informasi lengkap untuk ${product.title}`} showFilter={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#fff7ed] to-[#fff1e0] shadow-sm border border-stone-200">
          <img src={product.image} alt={product.title} className="w-full h-[420px] object-cover" />
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-stone-100">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-amber-700">
              {product.category}
            </span>
            <h1 className="mt-6 text-4xl font-black text-stone-900">{product.title}</h1>
            <p className="mt-4 text-stone-600 leading-relaxed">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-3xl bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700">Harga: Rp {product.price.toLocaleString('id-ID')}</div>
              <div className="rounded-3xl bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700">Stok: {product.stock} pcs</div>
              <div className="rounded-3xl bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700">Rating: ⭐ {product.rating}</div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-stone-100">
            <h2 className="text-xl font-black text-stone-900">Aksi</h2>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link to="/orders" className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#78350f] px-6 py-4 text-sm font-bold text-white hover:bg-[#451a03] transition-all">
                Kembali ke Pesanan
              </Link>
              <button className="inline-flex flex-1 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-4 text-sm font-bold text-stone-900 hover:border-amber-300 transition-all">
                Tambah ke Daftar Favorit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
