import { Link, useLocation } from 'react-router-dom'

/* ── Icons ─────────────────────────────────────────────── */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z" />
    </svg>
  ),

  order: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
    </svg>
  ),

  customer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 14.5-4 16 0" strokeLinecap="round" />
    </svg>
  ),

  box: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 3 7l9 5 9-5-9-5Z" />
      <path d="M3 17l9 5 9-5" />
      <path d="M3 12l9 5 9-5" />
    </svg>
  ),

  plus: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
}

/* ── Menu ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/',
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'order',
    path: '/orders',
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: 'customer',
    path: '/customers',
  },
  {
    key: 'menu',
    label: 'Menu',
    icon: 'box',
    path: '/menu',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'box',
    path: '/inventory',
  },
]

/* ── Nav Item ─────────────────────────────────────────── */
function NavItem({ item, currentPath }) {
  const active = currentPath === item.path

  return (
    <Link
      to={item.path}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl
        transition-all duration-200 group relative
        ${
          active
            ? 'bg-white text-[#78350f] shadow-md font-semibold'
            : 'text-amber-100 hover:bg-white/10'
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#f59e0b]" />
      )}

      <span
        className={`
          transition-all duration-200
          ${active ? 'text-[#92400e]' : 'text-amber-200'}
        `}
      >
        {icons[item.icon]}
      </span>

      <span className="text-sm">{item.label}</span>
    </Link>
  )
}

/* ── Sidebar ───────────────────────────────────────────── */
export default function Sidebar() {
  const location = useLocation()

  return (
    <aside
      className="
        w-[270px] min-h-screen
        bg-gradient-to-b from-[#78350f] via-[#92400e] to-[#451a03]
        text-white
        rounded-r-[40px]
        flex flex-col
        shadow-2xl
        relative
        overflow-hidden
      "
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#f59e0b]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-black/10 rounded-full blur-3xl" />

      {/* ── Logo ── */}
      <div className="relative z-10 px-7 pt-8 pb-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div
            className="
              w-12 h-12 rounded-2xl
              bg-white flex items-center justify-center
              shadow-lg
            "
          >
            <span className="text-[#78350f] font-black text-xl">
              P
            </span>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Papi Coffee
            </h1>
            <p className="text-xs text-amber-200 font-medium">
              Coffee Shop Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 flex-1 px-5">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              currentPath={location.pathname}
            />
          ))}
        </div>
      </nav>

      {/* ── Promo Card ── */}
      <div className="relative z-10 p-5">
        <div
          className="
            bg-white/10 backdrop-blur-md
            border border-white/10
            rounded-3xl
            p-5
          "
        >
          <div
            className="
              w-12 h-12 rounded-2xl
              bg-[#f59e0b]
              flex items-center justify-center
              mb-4
              text-[#451a03]
              shadow-lg
            "
          >
            {icons.plus}
          </div>

          <h3 className="font-bold text-lg mb-2">
            Tambah Menu Baru
          </h3>

          <p className="text-sm text-amber-100 leading-relaxed mb-5">
            Kelola menu kopi, stok bahan, dan pesanan pelanggan
            dengan cepat.
          </p>

          <button
            className="
              w-full py-3 rounded-2xl
              bg-[#f59e0b]
              hover:bg-[#fbbf24]
              text-[#451a03]
              font-bold text-sm
              transition-all duration-200
              active:scale-95
            "
          >
            Tambah Menu
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 px-6 pb-6">
        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-amber-200">
            © 2024 Papi Coffee
          </p>

          <p className="text-[11px] text-amber-300 mt-1">
            Brewed with ♥
          </p>
        </div>
      </div>
    </aside>
  )
}