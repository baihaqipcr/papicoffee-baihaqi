/**
 * TableFooter.jsx
 * Footer tabel: info jumlah data + navigasi halaman
 */

// Ubah path import menjadi relative path (karena berada di folder yang sama)
import Pagination from './Pagination';

export default function TableFooter({ from = 1, to = 7, total = 357, activePage = '1' }) {
  return (
    <div
      className="
        flex items-center justify-between
        px-6 py-4
        border-t border-[#f5f5f4]
      "
    >
      <p className="text-xs text-stone-400">
        Menampilkan{' '}
        <span className="font-bold text-stone-700">{from}–{to}</span>{' '}
        dari{' '}
        <span className="font-bold text-stone-700">{total}</span>{' '}
        pesanan
      </p>

      <Pagination activePage={activePage} />
    </div>
  );
}