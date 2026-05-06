import { useState } from 'react'

/* ── Icon helpers ──────────────────────────────────── */
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="7" cy="7" r="5" />
        <line x1="11" y1="11" x2="14.5" y2="14.5" />
    </svg>
)
const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M9 1.5a5.5 5.5 0 00-5.5 5.5v3L2 12h14l-1.5-2V7A5.5 5.5 0 009 1.5z" />
        <path d="M7 12v.5a2 2 0 004 0V12" />
    </svg>
)
const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M16 2H2a1 1 0 00-1 1v9a1 1 0 001 1h3.5l3.5 2.5 3.5-2.5H16a1 1 0 001-1V3a1 1 0 00-1-1z" />
        <line x1="5" y1="7" x2="13" y2="7" />
        <line x1="5" y1="10" x2="10" y2="10" />
    </svg>
)
const OrderIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
)
const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="9" cy="9" r="3" />
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.2 3.2l1.4 1.4M13.4 13.4l1.4 1.4M3.2 14.8l1.4-1.4M13.4 4.6l1.4-1.4" />
    </svg>
)

/* ── Badge wrapper ─────────────────────────────────── */
function IconBtn({ children, badgeColor = null, badgeText = '' }) {
    return (
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors">
            {children}
            {badgeColor && (
                <span
                    className={`absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-white ${badgeColor}`}
                    style={{ fontSize: '9px' }}
                >
                    {badgeText}
                </span>
            )}
        </button>
    )
}

export default function Header() {
    const [search, setSearch] = useState('')

    return (
        <header className="h-20 bg-white border-b border-stone-100 flex items-center gap-4 px-8 shrink-0 shadow-sm z-10 relative">

            {/* Title / Mobile Brand (Opsional, jika sidebar disembunyikan di mobile) */}
            <div className="lg:hidden font-bold text-[#78350f] text-xl mr-2">
                Papi Coffee
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md relative hidden md:block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Cari pesanan atau menu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] focus:bg-white transition-all placeholder:text-stone-400 text-stone-700"
                />
            </div>

            <div className="flex-1" />

            {/* Icon buttons */}
            <div className="flex items-center gap-1.5">
                <IconBtn badgeColor="bg-red-500" badgeText="2"><BellIcon /></IconBtn>
                <IconBtn badgeColor="bg-[#d97706]" badgeText="5"><OrderIcon /></IconBtn>
                <IconBtn><ChatIcon /></IconBtn>
                <IconBtn><SettingsIcon /></IconBtn>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-stone-200 mx-2" />

            {/* User */}
            <button className="flex items-center gap-3 hover:bg-stone-50 p-1.5 rounded-xl transition-colors text-left">
                <div className="hidden sm:block text-right">
                    <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Barista</p>
                    <p className="text-sm font-bold text-stone-800 leading-tight">Baihaqi</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97706] to-[#78350f] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden ring-2 ring-white">
                    <img
                        src="https://generationiron.com/wp-content/uploads/2021/08/header-22-1024x543.jpg"
                        alt="Baihaqi"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                    />
                    B
                </div>
            </button>
        </header>
    )
}