import PageHeader from '../components/PageHeader'

const STOCK_ITEMS = [
  { id: 1, name: 'Biji Kopi Arabica', quantity: 42, unit: 'kg', category: 'Bahan Baku' },
  { id: 2, name: 'Susu Segar', quantity: 18, unit: 'liter', category: 'Bahan Baku' },
  { id: 3, name: 'Cups Kertas', quantity: 320, unit: 'pcs', category: 'Kemasan' },
  { id: 4, name: 'Gula Aren', quantity: 24, unit: 'kg', category: 'Bahan Baku' },
  { id: 5, name: 'Matcha Powder', quantity: 6, unit: 'kg', category: 'Bahan Baku' },
]

export default function Inventory() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Kelola stok bahan dan pastikan semua persediaan siap untuk produksi kopi hari ini."
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-stone-900">Stok Bahan Aktif</h2>
            <p className="text-sm text-stone-500">Pantau persediaan bahan baku, kemasan, dan bahan khusus.</p>
          </div>
          <button className="rounded-2xl bg-[#f59e0b] px-5 py-3 text-sm font-bold text-[#451a03] shadow-sm hover:bg-[#fbbf24] transition-all">
            Tambah Stok
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-stone-700">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wide text-xs">
                <th className="px-4 py-3">Nama Item</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {STOCK_ITEMS.map(item => (
                <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-stone-800">{item.name}</td>
                  <td className="px-4 py-4 text-stone-500">{item.category}</td>
                  <td className="px-4 py-4 font-black text-stone-900">{item.quantity}</td>
                  <td className="px-4 py-4 text-stone-500">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
