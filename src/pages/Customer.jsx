/**
 * Customer.jsx — Halaman Customer
 */

import { useState } from 'react'
import PageHeader from '../components/PageHeader'
// 1. Import data dari file JSON yang baru dibuat
import CUSTOMERS from './customers.json'

/* TOP CUSTOMERS (by orders) */
const TOP = [...CUSTOMERS].sort((a, b) => b.orders - a.orders).slice(0, 4)

function CustomerCard({ c }) {
  const isActive = c.status === 'Active'
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="relative shrink-0">
        <img
          src={`https://picsum.photos/seed/${c.seed}/48/48`}
          alt={c.name}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.name}&size=48` }}
        />
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
          ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-green-600 transition-colors">
          {c.name}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{c.city}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-extrabold text-gray-800">{c.orders}</p>
        <p className="text-[10px] text-gray-400 font-medium">orders</p>
      </div>
    </div>
  )
}

function CustomerTableRow({ c }) {
  const isActive = c.status === 'Active'
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={`https://picsum.photos/seed/${c.seed}/40/40`}
              alt={c.name}
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-100"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.name}&size=40` }}
            />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
              ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{c.name}</p>
            <p className="text-xs text-gray-400">{c.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{c.city}</td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm font-semibold text-gray-800">{c.orders}</span>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{c.spent}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
          ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {c.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{c.joined}</td>
      <td className="px-4 py-3">
        <button className="text-gray-400 hover:text-gray-600 text-lg">⋯</button>
      </td>
    </tr>
  )
}

export default function Customer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* Memanggil PageHeader dengan 3 Props yang diminta */}
      <PageHeader
        title="Customer"
        breadcrumb={['Dashboard', 'Management', 'Customer']} // Contoh menggunakan Array
      >
        {/* Ini adalah prop "children" (Tombol akan otomatis ditaruh di sebelah kanan header) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#78350f] hover:bg-[#451a03] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-[#78350f]/30 hover:shadow-md flex items-center gap-2"
        >
          <span>+</span> Add Customer
        </button>
      </PageHeader>

      {/* Top Customers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {TOP.map(c => <CustomerCard key={c.id} c={c} />)}
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-lg font-bold text-gray-800">{CUSTOMERS.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Customers</span>
              <span className="text-lg font-bold text-green-600">
                {CUSTOMERS.filter(c => c.status === 'Active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Customers</span>
              <span className="text-lg font-bold text-gray-500">
                {CUSTOMERS.filter(c => c.status === 'Inactive').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-lg font-bold text-gray-800">
                {CUSTOMERS.reduce((sum, c) => sum + c.orders, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* All Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">All Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Spent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CUSTOMERS.map(c => <CustomerTableRow key={c.id} c={c} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}