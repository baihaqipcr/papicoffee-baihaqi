/**
 * SummaryCards.jsx
 * Grid tiga kartu ringkasan statistik pesanan
 */

// Perbaikan di baris ini: hapus "components/" karena berada di folder yang sama
import SummaryCard from './SummaryCard'

const SUMMARY_DATA = [
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
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {SUMMARY_DATA.map((card, i) => (
        <SummaryCard key={i} {...card} />
      ))}
    </div>
  )
}