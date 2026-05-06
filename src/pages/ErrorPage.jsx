/**
 * ErrorPage.jsx — Halaman Error yang dapat dikonfigurasi
 *
 * Props:
 *   errorCode        string  — Kode error (400, 401, 403, dll)
 *   errorDescription string  — Deskripsi error
 *   errorImage       string  — URL gambar error
 */

export default function ErrorPage({
  errorCode = '404',
  errorDescription = 'Halaman tidak ditemukan',
  errorImage = 'https://via.placeholder.com/400x300/gray/white?text=Error'
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Error Image */}
      <div className="mb-8">
        <img
          src={errorImage}
          alt={`Error ${errorCode}`}
          className="w-80 h-60 object-contain rounded-2xl shadow-lg"
        />
      </div>

      {/* Error Code */}
      <div className="mb-4">
        <h1 className="text-8xl font-extrabold text-gray-800 mb-2">{errorCode}</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops! Something went wrong</h2>
      </div>

      {/* Error Description */}
      <p className="text-lg text-gray-500 max-w-md leading-relaxed mb-8">
        {errorDescription}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}