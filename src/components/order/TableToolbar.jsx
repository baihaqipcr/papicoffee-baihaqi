/**
 * TableToolbar.jsx
 * Toolbar tabel: search, filter status, dan tombol pesanan baru
 */

// Perbaikan di baris ini: hapus "components/"
import SearchInput from './SearchInput'
import StatusFilter from './StatusFilter'
import NewOrderButton from './NewOrderButton'

export default function TableToolbar({ onNewOrder }) {
  return (
    <div className="flex items-center justify-between p-6">
      <SearchInput />

      <div className="flex items-center gap-3">
        <StatusFilter />
        <NewOrderButton onClick={onNewOrder} />
      </div>
    </div>
  )
}