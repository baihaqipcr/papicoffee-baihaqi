import { Link, useLocation } from 'react-router-dom'

/* ── Icons ─────────────────────────────────────────────── */
const icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  order: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="2" width="12" height="12" rx="2"/>
      <line x1="5" y1="6" x2="11" y2="6"/>
      <line x1="5" y1="9" x2="9"  y2="9"/>
    </svg>
  ),
  customer: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="5" r="3"/>
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
    </svg>
  ),
  box: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 4l6-2 6 2v8l-6 2-6-2V4z"/>
      <polyline points="8 2 8 14"/>
      <polyline points="14 6 8 10 2 6"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="8" cy="8" r="7"/>
      <line x1="8" y1="4" x2="8" y2="8"/>
      <line x1="8" y1="10" x2="8" y2="10"/>
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="5 3 9 7 5 11"/>
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="7" y1="2" x2="7" y2="12"/>
      <line x1="2" y1="7" x2="12" y2="7"/>
    </svg>
  ),
}

/* ── Nav groups ────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: 'Main Menu',
    items: [
      { key: 'dashboard', label: 'Dashboard',  icon: 'dashboard', routable: true, path: '/' },
      { key: 'orders',    label: 'Orders',     icon: 'order',     routable: true, path: '/orders' },
      { key: 'customers', label: 'Customers',  icon: 'customer',  routable: true, path: '/customers' },
    ],
  },
  {
    label: 'Management',
    items: [
      { key: 'menu',      label: 'Menu Management', icon: 'box',  routable: true, path: '/menu' },
      { key: 'inventory', label: 'Inventory',       icon: 'box',  routable: true, path: '/inventory' },
    ],
  },
]

/* ── Badge colors per key (Disesuaikan tema hangat) ────── */
const BADGES = {
  order:    { count: 5,  color: 'bg-red-600'    }, // Merah untuk alert pesanan
  customer: { count: 2,  color: 'bg-[#d97706]'  }, // Amber untuk notif
  chat:     { count: 12, color: 'bg-[#b45309]'  }, // Cokelat terang
}

/* ── Single nav button ─────────────────────────────────── */
function NavItem({ item, currentPath }) {
  const isActive  = currentPath === item.path
  const badge     = BADGES[item.key]

  return (
    <Link
      to={item.path || '#'}
      title={item.label}
      className={`
        group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200 text-left
        ${isActive
          ? 'bg-[#78350f] text-white shadow-md shadow-amber-900/30' // Espresso background
          : 'text-stone-500 hover:bg-amber-50 hover:text-stone-800' // Hover cokelat muda
        }
      `}
    >
      {/* Active left bar */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400/80 rounded-full" />
      )}

      {/* Icon */}
      <span className={`w-4 h-4 shrink-0 transition-transform duration-200
        ${isActive ? 'text-amber-100' : 'text-stone-400 group-hover:text-[#92400e] group-hover:scale-110'}`}>
        {icons[item.icon]}
      </span>

      {/* Label */}
      <span className="flex-1 truncate">{item.label}</span>

      {/* Badge */}
      {badge && !isActive && (
        <span className={`${badge.color} text-white text-[10px] font-bold
          min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1`}>
          {badge.count}
        </span>
      )}

      {/* Chevron for routable pages */}
      {item.routable && !isActive && (
        <span className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100
          transition-all duration-200 group-hover:translate-x-0.5">
          {icons.chevron}
        </span>
      )}
    </Link>
  )
}

/* ── Sidebar ─────────────────────────────────────────────── */
export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-amber-100 shrink-0">

      {/* ── Logo ── */}
      <div className="px-6 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#d97706] to-[#78350f] rounded-xl flex items-center justify-center shadow-sm shadow-amber-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-amber-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-800 tracking-tight">Papi Coffee</span>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Dashboard</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto space-y-5 mt-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {/* Group label */}
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3.5 mb-1.5">
              {group.label}
            </p>

            {/* Items */}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.key}
                  item={item}
                  currentPath={location.pathname}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Promo card ── */}
      <div className="mx-3 mb-4 bg-gradient-to-br from-[#92400e] to-[#451a03] rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-amber-900/10">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500 rounded-full opacity-20 blur-sm" />
        <div className="absolute -bottom-6 -left-4 w-16 h-16 bg-[#78350f] rounded-full opacity-50" />

        <div className="relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-amber-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5h14l-4.091-4.191A2.25 2.25 0 0110.5 8.818V3.104a.75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium leading-relaxed text-amber-50 mb-4 opacity-90">
            Kelola menu kopi dan pesanan dengan mudah melalui dashboard Papi Coffee.
          </p>
          <button className="w-full bg-[#f59e0b] text-stone-900 text-xs font-bold py-2.5 rounded-xl
            hover:bg-[#fbbf24] active:scale-95 transition-all duration-150
            flex items-center justify-center gap-1.5 shadow-sm">
            {icons.plus}
            Tambah Menu
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-5 border-t border-amber-50 pt-4">
        <p className="text-[10px] text-stone-400 font-semibold">Papi Coffee Admin</p>
        <p className="text-[10px] text-stone-400 mt-0.5">© 2024 Papi Coffee</p>
        <p className="text-[10px] text-stone-400 mt-1.5 flex items-center gap-1">
          Brewed with <span className="text-amber-600">♥</span>
        </p>
      </div>

    </aside>
  )
}