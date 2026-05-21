/**
 * QtyCell.jsx
 * Sel tabel: badge jumlah item yang dipesan
 */

export default function QtyCell({ qty }) {
  return (
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
      {qty}x
    </span>
  )
}