/**
 * OrderTableRow.jsx
 * Baris tabel satu pesanan lengkap
 */

import CustomerCell from './CustomerCell'
import MenuCell from './MenuCell'
// Perbaikan di baris ini: hapus "components/order/"
import QtyCell from './QtyCell'
import StatusBadge from './StatusBadge'

export default function OrderTableRow({ order }) {
  const { id, displayId, customer, item, qty, total, status, date, avatar } = order

  return (
    <tr
      className="
        border-b border-[#fafaf9]
        hover:bg-[#fafaf9]
        transition-all
        group
      "
    >
      {/* ... Sisa kode ke bawahnya sama semua dan sudah benar ... */}
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
          {displayId}
        </span>
      </td>

      {/* Customer */}
      <td className="px-6 py-5">
        <CustomerCell customer={customer} date={date} avatar={avatar} />
      </td>

      {/* Menu */}
      <td className="px-6 py-5">
        <MenuCell item={item} productId={id} />
      </td>

      {/* Qty */}
      <td className="px-6 py-5">
        <QtyCell qty={qty} />
      </td>

      {/* Total */}
      <td className="px-6 py-5">
        <p className="font-extrabold text-stone-900">{total}</p>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <StatusBadge status={status} />
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
  )
}