import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl w-full p-10 text-center relative overflow-hidden">

        {/* Background blur dekorasi */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-green-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Error 404
          </div>

          {/* Angka 404 */}
          <h1 className="text-[100px] leading-none font-black text-gray-900 tracking-tight">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
            Halaman yang kamu cari tidak tersedia atau route belum didefinisikan.
            Silakan kembali ke dashboard atau navigasi menu yang tersedia.
          </p>

          {/* Action */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-sm"
            >
              Kembali ke Dashboard
            </Link>

            <Link
              to="/orders"
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
            >
              Buka Order List
            </Link>
            <Link
              to="/customers"
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
            >
              Buka Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}