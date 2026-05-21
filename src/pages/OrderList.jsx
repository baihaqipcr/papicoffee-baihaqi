/**
 * OrderList.jsx — Coffee Shop Theme Version
 * Komponen utama halaman daftar pesanan.
 * Semua sub-komponen diimpor dari /src/components/order/
 */

import PageHeader from '../components/PageHeader'
import SummaryCards from '../components/order/SummaryCards'
import TableToolbar from '../components/order/TableToolbar'
import OrderTableHeader from '../components/order/OrderTableHeader'
import OrderTableBody from '../components/order/OrderTableBody'
import TableFooter from '../components/order/TableFooter'

const ORDERS = [
  { id: 1, displayId: '#ORD-001', customer: 'Jons Sena',        item: 'Pistachio Latte',        qty: 2, total: 'Rp 85.000',  status: 'Delivered',  date: '12 Jan 2025', avatar: 'jons'  },
  { id: 2, displayId: '#ORD-002', customer: 'Sofia Amalia',      item: 'Caramel Latte',          qty: 1, total: 'Rp 45.000',  status: 'On Process', date: '12 Jan 2025', avatar: 'sofia' },
  { id: 3, displayId: '#ORD-003', customer: 'Budi Santoso',      item: 'Kopapi Susu',            qty: 3, total: 'Rp 120.000', status: 'Delivered',  date: '11 Jan 2025', avatar: 'budi'  },
  { id: 4, displayId: '#ORD-004', customer: 'Anandreansyah',     item: 'Macchiato',              qty: 1, total: 'Rp 75.000',  status: 'Cancelled',  date: '11 Jan 2025', avatar: 'anand' },
  { id: 5, displayId: '#ORD-005', customer: 'Rina Kusuma',       item: 'Matcha Latte XL',        qty: 2, total: 'Rp 56.000',  status: 'On Process', date: '10 Jan 2025', avatar: 'rina'  },
  { id: 6, displayId: '#ORD-006', customer: 'Doni Prasetyo',     item: 'Vanilla Latte',          qty: 4, total: 'Rp 96.000',  status: 'Delivered',  date: '10 Jan 2025', avatar: 'doni'  },
  { id: 7, displayId: '#ORD-007', customer: 'Mega Wulandari',    item: 'Red Velvet Frappuccino', qty: 1, total: 'Rp 65.000',  status: 'Delivered',  date: '09 Jan 2025', avatar: 'mega'  },
]

export default function OrderList() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Daftar Pesanan Papi Coffee"
        subtitle="Pantau dan siapkan kopi terbaik untuk pelangganmu hari ini."
        showFilter={true}
        filterLabel="Rentang Waktu"
        filterSub="Januari 2025"
      />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Table */}
      <div
        className="
          bg-white rounded-[35px]
          shadow-sm border border-[#f5f5f4]
          overflow-hidden
        "
      >
        {/* Toolbar */}
        <TableToolbar />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <OrderTableHeader />
            <OrderTableBody orders={ORDERS} />
          </table>
        </div>

        {/* Footer */}
        <TableFooter from={1} to={7} total={357} activePage="1" />
      </div>

    </div>
  )
}