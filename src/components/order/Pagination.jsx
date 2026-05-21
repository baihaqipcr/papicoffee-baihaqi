/**
 * Pagination.jsx
 * Tombol navigasi halaman tabel
 */

const PAGES = ['‹', '1', '2', '3', '›']

export default function Pagination({ activePage = '1' }) {
  return (
    <div className="flex items-center gap-2">
      {PAGES.map((p, i) => (
        <button
          key={i}
          className={`
            w-9 h-9 rounded-xl text-sm font-bold
            transition-all
            ${p === activePage
              ? 'bg-[#92400e] text-white'
              : 'text-stone-500 hover:bg-[#fafaf9]'
            }
          `}
        >
          {p}
        </button>
      ))}
    </div>
  )
}