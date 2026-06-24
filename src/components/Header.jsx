import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Icon helpers ──────────────────────────────────── */
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
)

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const BellIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeJoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const ChatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeJoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
    </svg>
)

/* ── Badge wrapper ─────────────────────────────────── */
function IconBtn({ children, badgeText = null }) {
    return (
        <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm text-stone-600 hover:bg-stone-50 transition-all border border-stone-100">
            {children}
            {badgeText && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#78350f] text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
                    {badgeText}
                </span>
            )}
        </button>
    )
}

export default function Header() {
    const [search, setSearch] = useState('')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession()
            setUser(data?.session?.user ?? null)
        }

        loadSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener?.subscription?.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login', { replace: true })
    }

    return (
        <header className="h-20 bg-[#f4f4f5] flex items-center justify-between px-8 shrink-0 relative">
            
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-stone-200 rounded-lg transition-colors">
                    <MenuIcon />
                </button>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Dashboard</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl px-12">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search something here..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-6 pr-12 py-3 text-sm bg-[#e5e7eb] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:bg-white transition-all placeholder:text-stone-500 text-stone-700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#d97706]">
                        <SearchIcon />
                    </span>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <IconBtn badgeText="18"><ChatIcon /></IconBtn>
                    <IconBtn badgeText="52"><BellIcon /></IconBtn>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#78350f] shadow-sm transition hover:bg-[#f59e0b]/10"
                >
                    Logout
                </button>

                <button className="flex items-center gap-3 hover:bg-white/50 p-1.5 pr-3 rounded-full transition-all">
                    <div className="w-12 h-12 rounded-full bg-stone-300 border-2 border-white shadow-sm overflow-hidden shrink-0">
                        <img
                            src="https://generationiron.com/wp-content/uploads/2021/08/header-22-1024x543.jpg"
                            alt={user?.email ?? 'Papi Coffee'}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none' }}
                        />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-stone-900 leading-none mb-1">{user?.email ?? 'Barista'}</p>
                        <p className="text-[12px] text-stone-500 font-medium leading-none">{user ? 'Signed in' : 'Guest'}</p>
                    </div>
                </button>
            </div>
        </header>
    )
}