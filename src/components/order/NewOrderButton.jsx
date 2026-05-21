/**
 * NewOrderButton.jsx
 * Tombol untuk membuat pesanan baru
 */

export default function NewOrderButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
  )
}