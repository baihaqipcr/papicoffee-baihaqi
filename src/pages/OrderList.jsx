import PageHeader from '../components/PageHeader'

/* ── Constants & Styles ── */
const ORDERS = [
  { id: '#ORD-001', customer: 'Jons Sena', item: 'Pistachio Latte', qty: 2, total: 'Rp 85.000', status: 'Delivered', date: '12 Jan 2025', avatar: 'jons' },
  { id: '#ORD-002', customer: 'Sofia Amalia', item: 'Caramel Latte', qty: 1, total: 'Rp 45.000', status: 'On Process', date: '12 Jan 2025', avatar: 'sofia' },
  { id: '#ORD-003', customer: 'Budi Santoso', item: 'Kopapi Susu', qty: 3, total: 'Rp 120.000', status: 'Delivered', date: '11 Jan 2025', avatar: 'budi' },
  { id: '#ORD-004', customer: 'Anandreansyah', item: 'Machiatto', qty: 1, total: 'Rp 75.000', status: 'Cancelled', date: '11 Jan 2025', avatar: 'anand' },
  { id: '#ORD-005', customer: 'Rina Kusuma', item: 'Matcha Latte XL', qty: 2, total: 'Rp 56.000', status: 'On Process', date: '10 Jan 2025', avatar: 'rina' },
  { id: '#ORD-006', customer: 'Doni Prasetyo', item: 'Vanilla Latte', qty: 4, total: 'Rp 96.000', status: 'Delivered', date: '10 Jan 2025', avatar: 'doni' },
  { id: '#ORD-007', customer: 'Mega Wulandari', item: 'Red Velvet Frappuccino', qty: 1, total: 'Rp 65.000', status: 'Delivered', date: '09 Jan 2025', avatar: 'mega' },
  { id: '#ORD-008', customer: 'Fajar Hidayat', item: 'Hazelnut Latte', qty: 2, total: 'Rp 78.000', status: 'Cancelled', date: '09 Jan 2025', avatar: 'fajar' },
]

const STATUS_STYLE = {
  'Delivered': { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'On Process': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
  'Cancelled': { dot: 'bg-stone-400', text: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-100' },
}

const HOVER_CARD = "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/5";

/* ── Sub-Components ── */
function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE['On Process']
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${s.text} ${s.bg} ${s.border} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
      {status}
    </span>
  )
}

function OrderSummaryCard({ label, value, change, up, color, bg, icon }) {
  return (
    <div className={`bg-white ${HOVER_CARD} rounded-[2rem] p-6 border border-amber-50/50 flex items-center gap-5`}>
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-xs text-stone-400 font-bold uppercase tracking-tight">{label}</p>
        <p className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-md inline-block ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
          {up ? '↑' : '↓'} {change}
        </p>
      </div>
    </div>
  )
}

export default function OrderList() {
  return (
    <div className="space-y-8 bg-[#faf8f5] p-2 min-h-screen">
      <PageHeader
        title="Daftar Pesanan Papi Coffee"
        subtitle="Pantau dan siapkan kopi terbaik untuk pelangganmu hari ini."
        showFilter={true}
        filterLabel="Rentang Waktu"
        filterSub="Januari 2025"
      />

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrderSummaryCard label="Total Pesanan" value="357" change="4.4%" up={true} color="text-stone-800" bg="bg-stone-100" icon="📦" />
        <OrderSummaryCard label="Sedang Diseduh" value="48" change="1.2%" up={true} color="text-amber-700" bg="bg-amber-100" icon="☕" />
        <OrderSummaryCard label="Batal Hari Ini" value="12" change="2.1%" up={false} color="text-stone-500" bg="bg-stone-200/50" icon="🚫" />
      </div>

      {/* Table Section */}
      <div className={`bg-white rounded-[2.5rem] shadow-xl shadow-amber-900/5 border border-amber-50 overflow-hidden ${HOVER_CARD}`}>
        {/* Table toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 border-b border-stone-50">
          <div className="relative w-full sm:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
            <input
              placeholder="Cari nama atau menu..."
              className="pl-11 pr-6 py-3 text-sm bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-200 w-full sm:w-80 placeholder:text-stone-400 font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="flex-1 sm:flex-none text-sm border-none bg-stone-50 rounded-2xl px-4 py-3 text-stone-600 font-bold focus:ring-2 focus:ring-amber-200 cursor-pointer">
              <option>Semua Status</option>
              <option>Delivered</option>
              <option>On Process</option>
            </select>
            <button className="bg-[#78350f] hover:bg-[#451a03] text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-amber-900/20 active:scale-95">
              + Pesanan Baru
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50/50">
                {['Order ID', 'Customer', 'Menu', 'Qty', 'Total', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-[11px] font-black text-stone-400 uppercase tracking-[0.1em] px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono text-[11px] font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                      {o.id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?u=${o.avatar}`}
                        alt={o.customer}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform"
                      />
                      <div>
                        <p className="text-sm font-bold text-stone-800">{o.customer}</p>
                        <p className="text-[10px] text-stone-400 font-medium">{o.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-stone-600 font-medium max-w-[200px] truncate">{o.item}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-stone-500 bg-white border border-stone-100 px-2 py-1 rounded-md">
                      {o.qty}x
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-stone-900">{o.total}</td>
                  <td className="px-6 py-5"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                         <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                         <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination yang lebih 'Clean' */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-stone-50/30 gap-4">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            Menampilkan <span className="text-stone-800">1–8</span> dari <span className="text-stone-800">357</span> Pesanan
          </p>
          <div className="flex items-center gap-2">
            {['‹', '1', '2', '3', '›'].map((p, i) => (
              <button key={i} className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm
                ${p === '1' ? 'bg-[#78350f] text-white' : 'bg-white text-stone-400 hover:bg-amber-50 hover:text-amber-800'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}