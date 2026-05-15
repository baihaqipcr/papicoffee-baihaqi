/**
 * OrderList.jsx — Coffee Shop Theme Version
 */

import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'

const ORDERS = [
  { id: 1, displayId: '#ORD-001', customer: 'Jons Sena',      item: 'Pistachio Latte',        qty: 2, total: 'Rp 85.000',  status: 'Delivered',  date: '12 Jan 2025', avatar: 'jons' },
  { id: 2, displayId: '#ORD-002', customer: 'Sofia Amalia',   item: 'Caramel Latte',          qty: 1, total: 'Rp 45.000',  status: 'On Process', date: '12 Jan 2025', avatar: 'sofia' },
  { id: 3, displayId: '#ORD-003', customer: 'Budi Santoso',   item: 'Kopapi Susu',            qty: 3, total: 'Rp 120.000', status: 'Delivered',  date: '11 Jan 2025', avatar: 'budi' },
  { id: 4, displayId: '#ORD-004', customer: 'Anandreansyah',  item: 'Macchiato',              qty: 1, total: 'Rp 75.000',  status: 'Cancelled',  date: '11 Jan 2025', avatar: 'anand' },
  { id: 5, displayId: '#ORD-005', customer: 'Rina Kusuma',    item: 'Matcha Latte XL',        qty: 2, total: 'Rp 56.000',  status: 'On Process', date: '10 Jan 2025', avatar: 'rina' },
  { id: 6, displayId: '#ORD-006', customer: 'Doni Prasetyo',  item: 'Vanilla Latte',          qty: 4, total: 'Rp 96.000',  status: 'Delivered',  date: '10 Jan 2025', avatar: 'doni' },
  { id: 7, displayId: '#ORD-007', customer: 'Mega Wulandari', item: 'Red Velvet Frappuccino', qty: 1, total: 'Rp 65.000',  status: 'Delivered',  date: '09 Jan 2025', avatar: 'mega' },
]

const STATUS_STYLE = {
  Delivered: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },

  'On Process': {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },

  Cancelled: {
    dot: 'bg-stone-400',
    text: 'text-stone-500',
    bg: 'bg-stone-100',
    border: 'border-stone-200',
  },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full border
        text-[11px] font-semibold
        ${s.text} ${s.bg} ${s.border}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

export default function OrderList() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Daftar Pesanan Papi Coffee"
        subtitle="Pantau dan siapkan kopi terbaik untuk pelangganmu hari ini."
        showFilter={true}
        filterLabel="Rentang Waktu"
        filterSub="Januari 2025"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {[
          {
            label: 'TOTAL PESANAN',
            value: '357',
            growth: '↑ 4.4%',
            color: 'text-[#78350f]',
            bg: 'bg-[#fef3c7]',
            icon: '📦',
            growthColor: 'text-emerald-500',
          },

          {
            label: 'SEDANG DISEDUH',
            value: '48',
            growth: '↑ 1.2%',
            color: 'text-[#b45309]',
            bg: 'bg-[#fde68a]',
            icon: '☕',
            growthColor: 'text-emerald-500',
          },

          {
            label: 'BATAL HARI INI',
            value: '12',
            growth: '↓ 2.1%',
            color: 'text-stone-500',
            bg: 'bg-stone-100',
            icon: '🚫',
            growthColor: 'text-red-400',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="
              bg-white rounded-[30px]
              p-5 shadow-sm border border-[#f5f5f4]
              flex items-center gap-4
            "
          >
            <div
              className={`
                w-14 h-14 rounded-2xl
                flex items-center justify-center
                text-2xl shrink-0
                ${card.bg}
              `}
            >
              {card.icon}
            </div>

            <div>
              <h3 className={`text-4xl font-extrabold ${card.color}`}>
                {card.value}
              </h3>

              <p className="text-xs font-bold text-stone-400 mt-1">
                {card.label}
              </p>

              <p className={`text-[11px] mt-1 font-semibold ${card.growthColor}`}>
                {card.growth}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="
          bg-white rounded-[35px]
          shadow-sm border border-[#f5f5f4]
          overflow-hidden
        "
      >

        {/* Toolbar */}
        <div className="flex items-center justify-between p-6">

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              🔎
            </span>

            <input
              placeholder="Cari nama atau menu..."
              className="
                w-[260px]
                bg-[#fafaf9]
                border border-[#f5f5f4]
                rounded-2xl
                pl-11 pr-4 py-3
                text-sm
                focus:outline-none
                focus:border-[#d97706]
              "
            />
          </div>

          {/* Right Button */}
          <div className="flex items-center gap-3">

            <select
              className="
                bg-[#fafaf9]
                border border-[#f5f5f4]
                rounded-2xl
                px-4 py-3
                text-sm text-stone-600
                focus:outline-none
              "
            >
              <option>Semua Status</option>
            </select>

            <button
              className="
                bg-[#92400e]
                hover:bg-[#78350f]
                text-white
                px-6 py-3
                rounded-2xl
                text-sm font-bold
                shadow-lg shadow-amber-900/10
                transition-all
              "
            >
              + Pesanan Baru
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b border-[#f5f5f4]">

                {[
                  'ORDER ID',
                  'CUSTOMER',
                  'MENU',
                  'QTY',
                  'TOTAL',
                  'STATUS',
                  'AKSI',
                ].map((head) => (
                  <th
                    key={head}
                    className="
                      text-left
                      text-[11px]
                      font-extrabold
                      text-stone-400
                      tracking-[1.5px]
                      px-6 py-4
                    "
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {ORDERS.map((o) => (
                <tr
                  key={o.id}
                  className="
                    border-b border-[#fafaf9]
                    hover:bg-[#fafaf9]
                    transition-all
                    group
                  "
                >

                  {/* Order ID */}
                  <td className="px-6 py-5">
                    <span
                      className="
                        text-[10px] font-bold
                        text-[#b45309]
                        bg-[#fffbeb]
                        border border-[#fde68a]
                        px-2.5 py-1 rounded-full
                      "
                    >
                      {o.displayId}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <img
                        src={`https://picsum.photos/seed/${o.avatar}/40/40`}
                        alt={o.customer}
                        className="
                          w-10 h-10 rounded-full
                          object-cover
                        "
                      />

                      <div>
                        <p className="text-sm font-bold text-stone-800">
                          {o.customer}
                        </p>

                        <p className="text-[11px] text-stone-400">
                          {o.date}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Menu */}
                  <td className="px-6 py-5">

                   <Link to={`/products/${o.id}`}>
                      {o.item}
                    </Link>
                  </td>

                  {/* Qty */}
                  <td className="px-6 py-5">

                    <span
                      className="
                        bg-[#fafaf9]
                        border border-[#f5f5f4]
                        px-2 py-1
                        rounded-lg
                        text-xs font-bold
                        text-stone-600
                      "
                    >
                      {o.qty}x
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-5">
                    <p className="font-extrabold text-stone-900">
                      {o.total}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={o.status} />
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5">

                    <div
                      className="
                        flex items-center gap-2
                        opacity-0 group-hover:opacity-100
                        transition-all
                      "
                    >

                      <button
                        className="
                          w-8 h-8 rounded-xl
                          hover:bg-[#fef3c7]
                          text-[#b45309]
                          flex items-center justify-center
                        "
                      >
                        👁
                      </button>

                      <button
                        className="
                          w-8 h-8 rounded-xl
                          hover:bg-[#fde68a]
                          text-[#92400e]
                          flex items-center justify-center
                        "
                      >
                        ✏
                      </button>

                      <button
                        className="
                          w-8 h-8 rounded-xl
                          hover:bg-red-50
                          text-red-400
                          flex items-center justify-center
                        "
                      >
                        🗑
                      </button>
                    </div>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            border-t border-[#f5f5f4]
          "
        >

          <p className="text-xs text-stone-400">
            Menampilkan <span className="font-bold text-stone-700">1–7</span> dari{' '}
            <span className="font-bold text-stone-700">357</span> pesanan
          </p>

          <div className="flex items-center gap-2">

            {['‹', '1', '2', '3', '›'].map((p, i) => (
              <button
                key={i}
                className={`
                  w-9 h-9 rounded-xl text-sm font-bold
                  transition-all
                  ${
                    p === '1'
                      ? 'bg-[#92400e] text-white'
                      : 'text-stone-500 hover:bg-[#fafaf9]'
                  }
                `}
              >
                {p}
              </button>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}