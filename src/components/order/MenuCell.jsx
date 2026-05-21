/**
 * MenuCell.jsx
 * Sel tabel: link nama menu dengan efek hover animasi
 */

import { Link } from 'react-router-dom'

export default function MenuCell({ item, productId }) {
  return (
    <Link
      to={`/products/${productId}`}
      className="
        group inline-flex items-center gap-2
        text-[#8b4513] hover:text-[#6f360f]
        font-semibold transition-all duration-200
      "
    >
      <span
        className="
          relative
          after:absolute after:left-0 after:-bottom-1
          after:h-[2px] after:w-0
          after:bg-[#8b4513]
          after:transition-all after:duration-300
          group-hover:after:w-full
        "
      >
        {item}
      </span>

      <span
        className="
          opacity-0 -translate-x-1
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-200
          text-sm
        "
      >
        ☕
      </span>
    </Link>
  )
}