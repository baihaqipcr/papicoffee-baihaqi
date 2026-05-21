/**
 * OrderTableBody.jsx
 * Body tabel: daftar baris pesanan
 */

import OrderTableRow from './OrderTableRow'

export default function OrderTableBody({ orders }) {
  return (
    <tbody>
      {orders.map((order) => (
        <OrderTableRow key={order.id} order={order} />
      ))}
    </tbody>
  )
}