import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const PRODUCTS = [
  {
    id: 1,
    title: 'Pistachio Latte',
    category: 'Coffee',
    brand: 'Papi Signature',
    price: 85000,
    description:
      'Perpaduan espresso premium dengan susu creamy dan pistachio pilihan yang menghasilkan rasa lembut dan mewah.',
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    stock: 24,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Caramel Latte',
    category: 'Coffee',
    brand: 'Papi Classic',
    price: 45000,
    description:
      'Espresso hangat dengan caramel manis dan foam susu lembut yang cocok dinikmati kapan saja.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
    stock: 18,
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Kopapi Susu',
    category: 'Coffee',
    brand: 'Best Seller',
    price: 120000,
    description:
      'Kopi susu khas Papi Coffee dengan cita rasa creamy dan aroma roasted beans yang kuat.',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
    stock: 12,
    rating: 4.9,
  },
  {
    id: 4,
    title: 'Macchiato',
    category: 'Coffee',
    brand: 'Italian Blend',
    price: 75000,
    description:
      'Minuman espresso klasik dengan sentuhan foam susu tipis dan rasa kopi yang bold.',
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop',
    stock: 10,
    rating: 4.6,
  },
]

export default function PlaceholderPage() {
  const { id } = useParams()

  const product = PRODUCTS.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Menu Tidak Ditemukan"
          subtitle="Data menu tidak tersedia"
          showFilter={false}
        />

        <div className="bg-white rounded-[30px] shadow-sm border border-[#f3e8dc] p-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-6">
            <span className="text-5xl">☕</span>
          </div>

          <h2 className="text-3xl font-black text-[#3b2416] mb-3">
            Menu Tidak Ditemukan
          </h2>

          <p className="text-[#8b7355] max-w-md mx-auto leading-relaxed mb-8">
            Menu yang kamu cari mungkin sudah dihapus atau belum tersedia di
            Papi Coffee.
          </p>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-[#8b4513]
            hover:bg-[#6f360f] text-white px-6 py-3 rounded-2xl
            font-bold transition-all duration-200 shadow-md"
          >
            ← Kembali ke Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Detail Menu"
        subtitle={`Informasi lengkap ${product.title}`}
        showFilter={false}
      />

      <div className="bg-white rounded-[30px] shadow-sm border border-[#f3e8dc] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* Image Section */}
          <div className="bg-gradient-to-br from-[#f8f1ea] to-[#fffaf5] p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="rounded-[28px] w-full max-w-md object-cover shadow-xl"
            />
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">

            <div className="mb-5">
              <span className="bg-amber-100 text-[#8b4513] text-xs font-bold px-4 py-1.5 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-black text-[#2b1b12] leading-tight mb-4">
              {product.title}
            </h1>

            <p className="text-[#8b7355] leading-relaxed text-[15px] mb-8">
              {product.description}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">

              <div className="bg-[#faf6f1] rounded-2xl p-5 border border-[#f1e5d8]">
                <p className="text-xs uppercase tracking-wider text-[#9f866f] font-bold mb-2">
                  Harga
                </p>

                <h3 className="text-2xl font-black text-[#8b4513]">
                  Rp {product.price.toLocaleString('id-ID')}
                </h3>
              </div>

              <div className="bg-[#faf6f1] rounded-2xl p-5 border border-[#f1e5d8]">
                <p className="text-xs uppercase tracking-wider text-[#9f866f] font-bold mb-2">
                  Rating
                </p>

                <h3 className="text-2xl font-black text-[#8b4513]">
                  ⭐ {product.rating}
                </h3>
              </div>

              <div className="bg-[#faf6f1] rounded-2xl p-5 border border-[#f1e5d8]">
                <p className="text-xs uppercase tracking-wider text-[#9f866f] font-bold mb-2">
                  Brand
                </p>

                <h3 className="text-lg font-bold text-[#3b2416]">
                  {product.brand}
                </h3>
              </div>

              <div className="bg-[#faf6f1] rounded-2xl p-5 border border-[#f1e5d8]">
                <p className="text-xs uppercase tracking-wider text-[#9f866f] font-bold mb-2">
                  Stock
                </p>

                <h3 className="text-lg font-bold text-[#3b2416]">
                  {product.stock} Cups
                </h3>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">

              <button
                className="bg-[#8b4513] hover:bg-[#6f360f]
                text-white font-bold px-6 py-3 rounded-2xl
                transition-all duration-200 shadow-md"
              >
                Order Again
              </button>

              <Link
                to="/orders"
                className="border border-[#e7d7c6]
                hover:bg-[#faf6f1] text-[#6b4a36]
                font-bold px-6 py-3 rounded-2xl
                transition-all duration-200"
              >
                Back to Orders
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}