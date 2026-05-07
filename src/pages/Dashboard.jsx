import { useState } from 'react'
import PageHeader from '../components/PageHeader'

/* ── Animation Classes ── */
const HOVER_EFFECT = "transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 cursor-default";

/* ── Helper SVG Path ── */
function makePath(values, w, h, padX = 10, padT = 10, padB = 10) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => ({
    x: padX + (i / (values.length - 1)) * (w - padX * 2),
    y: padT + (1 - (v - min) / range) * (h - padT - padB),
  }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i], mx = (p.x + c.x) / 2
    d += ` C ${mx} ${p.y} ${mx} ${c.y} ${c.x} ${c.y}`
  }
  return { d, pts }
}

/* ═══════════════════════════════════════════════
   STAT CARD (Updated with Hover Glow)
═══════════════════════════════════════════════ */
function StatCard({ icon, value, label, change, isUp, cardBg, iconBg, iconColor }) {
  return (
    <div className={`${cardBg} ${HOVER_EFFECT} rounded-[2rem] p-6 border border-white/50 flex flex-col gap-4 relative overflow-hidden group`}>
      {/* Decorative Blur Circle */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${iconBg} opacity-10 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className={`w-14 h-14 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-stone-900 tracking-tight">{value}</p>
        <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-1">{label}</p>
        <div className={`flex items-center gap-1 mt-3 text-[11px] font-bold ${isUp ? 'text-emerald-600' : 'text-stone-400'}`}>
           <span className={`px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50' : 'bg-stone-100'}`}>
            {isUp ? '↑' : '↓'} {change}
           </span>
           <span className="text-stone-400 font-medium">vs last month</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CHART ORDER (Interactive Line)
═══════════════════════════════════════════════ */
function ChartOrder() {
  const data = [200, 450, 300, 600, 400, 800, 500]
  const W = 400, H = 150
  const { d, pts } = makePath(data, W, H, 20, 20, 30)

  return (
    <div className={`bg-white rounded-[2rem] p-8 flex-1 ${HOVER_EFFECT}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-black text-stone-800">Performa Mingguan</h2>
          <p className="text-sm text-stone-400">Total cup kopi yang terjual</p>
        </div>
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"/>
            <span className="text-xs font-bold text-stone-500">Live Data</span>
        </div>
      </div>
      
      <div className="relative group/chart">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
          <path d={d} fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
          {pts.map((p, i) => (
            <g key={i} className="group/pt">
                <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#78350f" strokeWidth="3" className="transition-all duration-300 group-hover/pt:r-8 cursor-pointer" />
                <rect x={p.x - 20} y={p.y - 35} width="40" height="20" rx="6" fill="#292524" className="opacity-0 group-hover/pt:opacity-100 transition-opacity" />
                <text x={p.x} y={p.y - 21} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" className="opacity-0 group-hover/pt:opacity-100">{data[i]}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DASHBOARD MAIN PAGE
═══════════════════════════════════════════════ */
export default function Dashboard() {
  return (
    <div className="space-y-8 bg-[#faf8f5] p-6 lg:p-10 min-h-screen">
      
      {/* ── Page Header dengan Sentuhan Manusia ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Kabar Kopi Hari Ini ☕</h1>
          <p className="text-stone-500 font-medium mt-1">Semoga harimu menyenangkan, Barista! Berikut adalah ringkasan kedaimu.</p>
        </div>
        <div className="flex gap-3">
            <button className="px-5 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors shadow-sm">Unduh Laporan</button>
            <button className="px-5 py-3 bg-[#78350f] rounded-2xl text-sm font-bold text-white hover:bg-[#451a03] transition-all shadow-lg shadow-amber-900/20">Atur Menu</button>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            value="1,284" label="Cups Terjual" change="12%" isUp={true}
            cardBg="bg-white" iconBg="bg-amber-100" iconColor="text-amber-700"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>}
        />
        <StatCard 
            value="Rp 15.4M" label="Pendapatan" change="8.2%" isUp={true}
            cardBg="bg-[#fef3c7]" iconBg="bg-white" iconColor="text-amber-800"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard 
            value="456" label="Pelanggan Baru" change="4.4%" isUp={true}
            cardBg="bg-white" iconBg="bg-stone-100" iconColor="text-stone-700"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard 
            value="12" label="Pesanan Batal" change="2.1%" isUp={false}
            cardBg="bg-white" iconBg="bg-red-50" iconColor="text-red-600"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
            <ChartOrder />
            
            {/* Reviews Section */}
            <div className={`bg-white rounded-[2rem] p-8 ${HOVER_EFFECT}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-stone-800">Apa Kata Mereka?</h2>
                    <button className="text-amber-800 font-bold text-sm hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-6">
                    {[
                        { name: "Bima Arya", text: "Butterscotch Latte-nya juara! Gak terlalu manis.", time: "2 jam yang lalu", rate: 5 },
                        { name: "Siti Sarah", text: "Tempatnya cozy banget buat WFC, kopinya strong.", time: "5 jam yang lalu", rate: 4 }
                    ].map((rev, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-3xl border border-stone-50 hover:bg-amber-50/50 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden ring-2 ring-white group-hover:ring-amber-200 transition-all">
                                <img src={`https://i.pravatar.cc/150?u=${rev.name}`} alt="user" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-stone-800">{rev.name}</h4>
                                    <span className="text-[10px] text-stone-400 font-medium">• {rev.time}</span>
                                </div>
                                <p className="text-sm text-stone-600 mt-1">"{rev.text}"</p>
                                <div className="flex text-amber-500 mt-2 text-xs">{"★".repeat(rev.rate)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar dalam Content */}
        <div className="space-y-8">
            {/* Best Seller List */}
            <div className={`bg-[#78350f] text-white rounded-[2rem] p-8 shadow-xl shadow-amber-900/20 ${HOVER_EFFECT}`}>
                <h2 className="text-lg font-black mb-6">Paling Laris 🔥</h2>
                <div className="space-y-6">
                    {[
                        { title: "Butterscotch", sold: "428", img: "🍯" },
                        { title: "Americano", sold: "312", img: "☕" },
                        { title: "Caramel Macchiato", sold: "285", img: "☁️" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl bg-white/10 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{item.img}</span>
                                <div>
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-xs text-amber-200/60">{item.sold} Cup terjual</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-amber-900 transition-all">→</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coffee Fact / Human Element */}
            <div className="bg-emerald-900 text-emerald-50 rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Tips Barista</span>
                    <h3 className="text-lg font-bold mt-2">Kebersihan Mesin Espresso</h3>
                    <p className="text-sm mt-2 opacity-80 leading-relaxed">Jangan lupa flushing group head setiap setelah brewing ya, biar rasa kopi tetap clean! ✨</p>
                </div>
                <div className="absolute -bottom-6 -right-6 text-8xl opacity-10 group-hover:rotate-12 transition-transform duration-500">🍃</div>
            </div>
        </div>
      </div>

    </div>
  )
}