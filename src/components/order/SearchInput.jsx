/**
 * SearchInput.jsx
 * Input pencarian nama atau menu
 */

export default function SearchInput() {
  return (
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
  )
}