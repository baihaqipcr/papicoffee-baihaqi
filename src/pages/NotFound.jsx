import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 max-w-2xl w-full p-10 md:p-16 text-center relative overflow-hidden">

        {/* Background blur dekorasi (Warna Kopi & Amber) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-200 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Ikon Gelas Kopi Kosong (SVG) */}
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-amber-50 rounded-full text-[#78350f]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.25V18a2.25 2.25 0 01-2.25 2.25H8.25A2.25 2.25 0 016 18V8.25m12 0a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 8.25m12 0V6a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 6v2.25" />
              </svg>
            </div>
          </div>

          {/* Angka 404 */}
          <h1 className="text-[120px] leading-none font-black text-[#451a03] tracking-tighter opacity-10 absolute -top-10 left-1/2 -translate-x-1/2 select-none">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-stone-800 relative z-10">
            Halaman Tidak Ditemukan
          </h2>

          {/* Description */}
          <p className="text-stone-500 mt-4 max-w-md mx-auto leading-relaxed">
            Sepertinya pesanan halaman yang kamu cari tidak ada di menu kami. 
            Mungkin link-nya salah ketik atau sudah dihapus oleh barista.
          </p>

          {/* Action */}
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <Link
              to="/"
              className="bg-[#78350f] hover:bg-[#451a03] text-white px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-stone-200 hover:-translate-y-1"
            >
              Kembali ke Dashboard
            </Link>

            <div className="flex gap-2">
              <Link
                to="/orders"
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200"
              >
                Cek Pesanan
              </Link>
              <Link
                to="/customers"
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200"
              >
                Pelanggan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}