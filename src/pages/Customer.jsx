/**
 * Customer.jsx — Halaman Customer (Talent Style)
 */

import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CUSTOMERS from './customers.json'

// Komponen Card Utama yang meniru gaya "Talent Page" pada gambar
function CustomerTalentCard({ c }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-transparent hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden">
      {/* Menu Dots di pojok kanan atas */}
      <button className="absolute top-6 right-6 text-gray-300 hover:text-purple-600 transition-colors">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Avatar dengan Badge Rating */}
      <div className="relative mb-4 mt-2">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-50 group-hover:ring-purple-100 transition-all duration-500 transform group-hover:scale-105">
          <img
            src={`https://picsum.photos/seed/${c.seed}/150/150`}
            alt={c.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${c.name}&background=f3e8ff&color=a855f7&size=150` }}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-orange-200">
          <span className="text-xs">★</span> 4.5
        </div>
      </div>

      {/* Identitas */}
      <h3 className="text-lg font-black text-gray-800 mb-0.5 group-hover:text-purple-700 transition-colors">{c.name}</h3>
      <p className="text-xs font-bold text-gray-400 mb-2">@{c.name.toLowerCase().replace(/\s/g, '')}</p>
      
      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-wider">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {c.city}, Indonesia
      </div>

      {/* Deskripsi Singkat */}
      <p className="text-[11px] text-gray-400 leading-relaxed mb-6 px-2 line-clamp-2">
        Pelanggan setia Papi Coffee yang menyukai varian Arabica dan sering menghabiskan waktu untuk bekerja.
      </p>

      {/* Stats Progress Bar (Gaya Bar Chart di Gambar) */}
      <div className="w-full space-y-3 mb-2">
        <StatBar label="Loyalty" value={85} color="bg-purple-600" />
        <StatBar label="Visit Frequency" value={60} color="bg-purple-600" />
        <StatBar label="Satisfaction" value={92} color="bg-purple-600" />
      </div>
    </div>
  )
}

function StatBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{label}</span>
        <span className="text-[10px] font-black text-gray-800">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function Customer() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-6 bg-[#f8f9fd] min-h-screen p-2">
      {/* Page Header sesuai style gambar */}
      <PageHeader title="Customers" />

      {/* Search & Filter Bar (Identik dengan Gambar) */}
      <div className="bg-white rounded-[2rem] p-4 shadow-sm flex flex-wrap items-center gap-4 border border-gray-50">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl text-gray-400">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          <span className="text-sm font-bold text-gray-800">Around You</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
        
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search by name, city or any keywords..." 
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-gray-300"
          />
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5h14.5M3 9.5h14.5M3 14.5h14.5" /></svg>
          <span className="text-sm font-black text-gray-800 uppercase tracking-wider">Filter</span>
        </button>

        <button className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-8 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm font-black uppercase tracking-widest">Find</span>
        </button>
      </div>

      {/* Stats & Quick Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-800">Showing {CUSTOMERS.length} Customers</h2>
          <p className="text-xs font-bold text-gray-400">Based on your preferences</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-purple-200 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />
            </div>
            <span className="text-xs font-black text-gray-800 uppercase">Fulltime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-purple-200" />
            <span className="text-xs font-black text-gray-400 uppercase">Freelance</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase">Details</span>
            <div className="w-8 h-4 bg-gray-200 rounded-full relative">
              <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Card Style dari referensi gambar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {CUSTOMERS.slice(0, 10).map(c => (
          <CustomerTalentCard key={c.id} c={c} />
        ))}
      </div>

      {/* Pagination Gaya Gambar */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-4 px-4">
        <p className="text-sm font-bold text-gray-400">Showing 10 from {CUSTOMERS.length} data</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white rounded-xl text-purple-600 font-bold text-sm shadow-sm hover:bg-purple-50 transition-colors">« Previous</button>
          {[1, 2, 3, 4].map(num => (
            <button 
              key={num} 
              className={`w-10 h-10 rounded-xl text-sm font-black transition-all
                ${num === 3 ? 'bg-[#4338ca] text-white shadow-lg shadow-indigo-200 scale-110' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
            >
              {num}
            </button>
          ))}
          <button className="px-4 py-2 bg-white rounded-xl text-purple-600 font-bold text-sm shadow-sm hover:bg-purple-50 transition-colors">Next »</button>
        </div>
      </div>
    </div>
  )
}