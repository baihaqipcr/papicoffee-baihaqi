import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

// Kamu HARUS punya data ini lagi di sini atau di-export dari file lain
const ORDERS = [
  { id: '#ORD-001', customer: 'Jons Sena', item: 'Pistachio Latte', qty: 2, total: 'Rp 85.000', status: 'Delivered', date: '12 Jan 2025', avatar: 'jons', desc: 'Kopi susu dengan rasa kacang pistachio yang gurih.' },
  { id: '#ORD-002', customer: 'Sofia Amalia', item: 'Caramel Latte', qty: 1, total: 'Rp 45.000', status: 'On Process', date: '12 Jan 2025', avatar: 'sofia', desc: 'Perpaduan espresso dan karamel manis yang lembut.' },
  // ... tambahkan yang lain jika perlu
];

export default function ProductDetail() {
  const { id } = useParams();
  
  // Mencari data yang cocok (kita tambahkan '#' lagi karena di URL sudah kita buang)
  const product = ORDERS.find((o) => o.id.replace('#', '') === id);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">⚠️ Pesanan Tidak Ditemukan</h2>
        <p className="text-stone-500 mb-4">ID {id} tidak ada dalam database Papi Coffee.</p>
        <Link to="/orders" className="text-amber-800 font-bold underline">Kembali ke Daftar</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white rounded-[3rem] shadow-2xl border border-amber-50">
      <Link to="/orders" className="text-sm text-stone-400 hover:text-amber-800 mb-6 block">← Kembali ke Daftar</Link>
      
      <div className="flex items-center gap-6 mb-8">
        <img 
          src={`https://i.pravatar.cc/150?u=${product.avatar}`} 
          className="w-24 h-24 rounded-full border-4 border-amber-100 shadow-sm"
          alt={product.customer}
        />
        <div>
          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-widest">
            {product.id}
          </span>
          <h1 className="text-3xl font-black text-stone-800 mt-2">{product.item}</h1>
          <p className="text-stone-500 font-medium">Customer: {product.customer}</p>
        </div>
      </div>

      <div className="space-y-4 border-t border-stone-50 pt-6">
        <div className="flex justify-between">
          <span className="text-stone-400 font-bold uppercase text-[11px]">Status</span>
          <span className="font-bold text-amber-700">{product.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400 font-bold uppercase text-[11px]">Jumlah</span>
          <span className="font-bold text-stone-800">{product.qty}x</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400 font-bold uppercase text-[11px]">Total Bayar</span>
          <span className="font-black text-xl text-stone-900">{product.total}</span>
        </div>
      </div>

      <div className="mt-8 p-6 bg-stone-50 rounded-3xl">
        <h3 className="text-xs font-black text-stone-400 uppercase mb-2">Catatan Pesanan</h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          {product.desc || "Tidak ada deskripsi tambahan untuk pesanan ini."}
        </p>
      </div>
    </div>
  );
}