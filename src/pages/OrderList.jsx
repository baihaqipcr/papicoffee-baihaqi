/**
 * OrderList.jsx — Halaman Order List
 */

import PageHeader from '../components/PageHeader'

const ORDERS = [
  { id: '#ORD-001', customer: 'Jons Sena',       item: 'Nasi Chicken Katsu + Americano 2 Shot', qty: 2, total: 'Rp 85.000',  status: 'Delivered', date: '12 Jan 2025', avatar: 'jons'    },
  { id: '#ORD-002', customer: 'Sofia Amalia',     item: 'Pistachio Latte', qty: 1, total: 'Rp 45.000',  status: 'On Process', date: '12 Jan 2025', avatar: 'sofia'   },
  { id: '#ORD-003', customer: 'Budi Santoso',     item: 'Kopapi Susu',  qty: 3, total: 'Rp 120.000', status: 'Delivered', date: '11 Jan 2025', avatar: 'budi'    },
  { id: '#ORD-004', customer: 'Anandreansyah',    item: 'Mie Goreng + Matcha Latte',  qty: 1, total: 'Rp 75.000',  status: 'Cancelled', date: '11 Jan 2025', avatar: 'anand'   },
  { id: '#ORD-005', customer: 'Rina Kusuma',      item: 'Gado-gado + Lontong', qty: 2, total: 'Rp 56.000',  status: 'On Process', date: '10 Jan 2025', avatar: 'rina'    },
  { id: '#ORD-006', customer: 'Doni Prasetyo',    item: 'Bakso Jumbo Spesial', qty: 4, total: 'Rp 96.000',  status: 'Delivered', date: '10 Jan 2025', avatar: 'doni'    },
  { id: '#ORD-007', customer: 'Mega Wulandari',   item: 'Rendang + Nasi Putih',qty: 1, total: 'Rp 65.000',  status: 'Delivered', date: '09 Jan 2025', avatar: 'mega'    },
  { id: '#ORD-008', customer: 'Fajar Hidayat',    item: 'Soto Betawi Spesial', qty: 2, total: 'Rp 78.000',  status: 'Cancelled', date: '09 Jan 2025', avatar: 'fajar'   },
]

const STATUS_STYLE = {
  'Delivered':  { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200'  },
  'On Process': { dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  'Cancelled':  { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'    },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE['On Process']
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
      px-2.5 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

export default function OrderList() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Order List"
        subtitle="Manage and track all customer orders"
        showFilter={true}
        filterLabel="Filter Periode"
        filterSub="17 April 2025 – 21 May 2025"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders',    value: '357', change: '+4.4%', up: true,  color: 'text-blue-600',  bg: 'bg-blue-50',  icon: '📦' },
          { label: 'On Process',      value: '48',  change: '+1.2%', up: true,  color: 'text-amber-600', bg: 'bg-amber-50', icon: '⏳' },
          { label: 'Cancelled Today', value: '12',  change: '-2.1%', up: false, color: 'text-red-500',   bg: 'bg-red-50',   icon: '❌' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${s.up ? 'text-green-500' : 'text-red-400'}`}>
                {s.up ? '▲' : '▼'} {s.change} vs yesterday
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              placeholder="Search order..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-green-400 w-64 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-600
              focus:outline-none focus:border-green-400 bg-gray-50">
              <option>All Status</option>
              <option>Delivered</option>
              <option>On Process</option>
              <option>Cancelled</option>
            </select>
            <button className="flex items-center gap-1.5 bg-[#78350f] hover:bg-[#451a03]
              text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              + New Order
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order ID', 'Customer', 'Menu Item', 'Qty', 'Total', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase
                    tracking-wider px-4 py-3 whitespace-nowrap first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o, i) => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/60
                  transition-colors duration-100 group">
                  <td className="px-4 py-3.5 pl-6">
                    <span className="font-mono text-xs font-bold text-green-600 bg-green-50
                      px-2 py-0.5 rounded-lg">{o.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={`https://picsum.photos/seed/${o.avatar}/32/32`}
                        alt={o.customer}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${o.customer}&size=32` }}
                      />
                      <span className="text-sm font-semibold text-gray-800">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[160px] truncate">{o.item}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100
                      px-2 py-0.5 rounded-lg">{o.qty}x</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800">{o.total}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-400 font-medium">{o.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3.5 pr-6">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600
                        transition-colors" title="View">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <circle cx="7" cy="7" r="2.5"/><path d="M1 7c1.5-3 3.5-4.5 6-4.5S12.5 4 14 7c-1.5 3-3.5 4.5-6 4.5S2.5 10 1 7z"/>
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-400 hover:text-amber-600
                        transition-colors" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M9 2l3 3-7 7H2v-3L9 2z"/>
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600
                        transition-colors" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <polyline points="2 4 12 4"/><path d="M5 4V2h4v2"/><path d="M3 4l1 8h6l1-8"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-700">1–8</span> of <span className="font-semibold text-gray-700">357</span> orders</p>
          <div className="flex items-center gap-1.5">
            {['‹', '1', '2', '3', '...', '45', '›'].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                ${p === '1' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}