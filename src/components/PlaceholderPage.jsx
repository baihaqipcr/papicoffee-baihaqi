export default function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Halaman {title}</h2>
        <p>Halaman ini sedang dalam tahap pengembangan.</p>
      </div>
    </div>
  )
}