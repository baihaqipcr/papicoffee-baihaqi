/**
 * SummaryCard.jsx
 * Kartu ringkasan statistik pesanan
 */

export default function SummaryCard({ label, value, growth, color, bg, icon, growthColor }) {
  return (
    <div
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
          ${bg}
        `}
      >
        {icon}
      </div>

      <div>
        <h3 className={`text-4xl font-extrabold ${color}`}>
          {value}
        </h3>

        <p className="text-xs font-bold text-stone-400 mt-1">
          {label}
        </p>

        <p className={`text-[11px] mt-1 font-semibold ${growthColor}`}>
          {growth}
        </p>
      </div>
    </div>
  )
}