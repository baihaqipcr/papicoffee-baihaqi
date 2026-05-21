/**
 * OrderTableHeader.jsx
 * Header kolom tabel pesanan
 */

const COLUMNS = ['ORDER ID', 'CUSTOMER', 'MENU', 'QTY', 'TOTAL', 'STATUS', 'AKSI']

export default function OrderTableHeader() {
  return (
    <thead>
      <tr className="border-b border-[#f5f5f4]">
        {COLUMNS.map((head) => (
          <th
            key={head}
            className="
              text-left
              text-[11px]
              font-extrabold
              text-stone-400
              tracking-[1.5px]
              px-6 py-4
            "
          >
            {head}
          </th>
        ))}
      </tr>
    </thead>
  )
}