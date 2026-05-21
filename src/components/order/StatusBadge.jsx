/**
 * StatusBadge.jsx
 * Badge berwarna sesuai status pesanan
 */

export const STATUS_STYLE = {
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

export default function StatusBadge({ status }) {
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