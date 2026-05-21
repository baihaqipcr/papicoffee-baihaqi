/**
 * CustomerCell.jsx
 * Sel tabel: avatar, nama, dan tanggal pelanggan
 */

export default function CustomerCell({ customer, date, avatar }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={`https://picsum.photos/seed/${avatar}/40/40`}
        alt={customer}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div>
        <p className="text-sm font-bold text-stone-800">
          {customer}
        </p>

        <p className="text-[11px] text-stone-400">
          {date}
        </p>
      </div>
    </div>
  )
}