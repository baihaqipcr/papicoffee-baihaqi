/**
 * StatusFilter.jsx
 * Dropdown filter berdasarkan status pesanan
 */

export default function StatusFilter() {
  return (
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
  )
}