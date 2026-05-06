import PageHeader from '../components/PageHeader'

/* ═══════════════════════════════════════════════
   HELPER: smooth cubic-bezier SVG path from data
═══════════════════════════════════════════════ */
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
function makeArea(linePath, pts, h, padB = 10) {
  const last = pts[pts.length - 1], first = pts[0]
  return `${linePath} L ${last.x} ${h - padB} L ${first.x} ${h - padB} Z`
}

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({ icon, value, label, change, changeDir = 'up', iconBg = 'bg-amber-100', iconColor = 'text-amber-700' }) {
  const isUp = changeDir === 'up'
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-amber-900/5 border border-amber-50">
      <div className={`w-14 h-14 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-extrabold text-stone-800 leading-tight">{value}</p>
        <p className="text-xs text-stone-500 font-medium mt-0.5">{label}</p>
        <p className={`text-[11px] font-semibold mt-1 ${isUp ? 'text-amber-600' : 'text-stone-400'}`}>
          {isUp ? '▲' : '▼'} {change}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════ */
function DonutChart({ pct, color, trackColor = '#f5f5f4', size = 72, strokeW = 10, label }) {
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const cx = size / 2, cy = size / 2

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeW}/>
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-stone-700">{pct}%</span>
        </div>
      </div>
      <p className="text-[10px] text-stone-500 font-bold mt-2">{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PIE CHARTS PANEL (BEST SELLERS)
═══════════════════════════════════════════════ */
function PieChartsPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 flex-1 min-w-0 shadow-lg shadow-amber-900/5 border border-amber-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-stone-800">Best Selling Coffees</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer hover:text-amber-700 transition-colors">
            <div className="w-3.5 h-3.5 border border-stone-300 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-600 rounded-sm"/>
            </div>
            Chart
          </label>
          <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer hover:text-amber-700 transition-colors">
            <div className="w-3.5 h-3.5 bg-amber-100 rounded-sm"/>
            Value
          </label>
        </div>
      </div>

      {/* 4 donuts using shades of Coffee/Brown */}
      <div className="flex justify-between items-center py-2">
        <DonutChart pct={42} color="#78350f" label="Latte" />          {/* Espresso / Dark Brown */}
        <DonutChart pct={28} color="#d97706" label="Butterscotch" />   {/* Caramel */}
        <DonutChart pct={18} color="#451a03" label="Americano" />      {/* Black Coffee */}
        <DonutChart pct={12} color="#84cc16" label="Pistachio" />      {/* Pistachio Green hint */}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CHART ORDER (line chart)
═══════════════════════════════════════════════ */
function ChartOrder() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const data = [180, 320, 220, 450, 380, 550, 420] // Adjusted for higher volume
  const W = 320, H = 110
  const { d, pts } = makePath(data, W, H, 14, 12, 24)
  const area = makeArea(d, pts, H, 24)
  const peak = pts.reduce((a, b) => (b.y < a.y ? b : a))

  return (
    <div className="bg-white rounded-2xl p-6 flex-1 min-w-0 shadow-lg shadow-amber-900/5 border border-amber-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-stone-800">Weekly Cup Sales</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Coffee cups sold per day</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="6" y1="1" x2="6" y2="9"/><line x1="2" y1="9" x2="10" y2="9"/>
            <polyline points="3 6 6 9 9 6"/>
          </svg>
          Export
        </button>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-1" style={{ width: '100%' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
          <defs>
            <linearGradient id="order-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.01"/>
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
            <line key={i} x1={14} y1={12 + f * 74} x2={W - 14} y2={12 + f * 74}
              stroke="#f5f5f4" strokeWidth="1"/>
          ))}
          {/* Area + line */}
          <path d={area} fill="url(#order-grad)"/>
          <path d={d} fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>
          {/* Data points */}
          {pts.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="white" stroke="#b45309" strokeWidth="2"/>
          ))}
          {/* Peak annotation */}
          <circle cx={peak.x} cy={peak.y} r="6" fill="#78350f"/>
          <circle cx={peak.x} cy={peak.y} r="3" fill="white"/>
          {/* Tooltip box */}
          <rect x={peak.x - 30} y={peak.y - 30} width="60" height="20" rx="6" fill="#451a03" className="drop-shadow-md"/>
          <text x={peak.x} y={peak.y - 16} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">550 Cups</text>
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between px-3 mt-2">
          {days.map(d => (
            <span key={d} className="text-[10px] font-medium text-stone-400">
              {d.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   TOTAL REVENUE CHART
═══════════════════════════════════════════════ */
function TotalRevenueChart() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const y2022 = [15, 28, 20, 38, 30, 45, 35, 22, 38, 28, 35, 42]
  const y2023 = [28, 18, 35, 22, 42, 32, 48, 38, 25, 42, 35, 48]
  const W = 460, H = 170

  const { d: d20, pts: pts20 } = makePath(y2022, W, H, 12, 10, 28)
  const { d: d21, pts: pts21 } = makePath(y2023, W, H, 12, 10, 28)
  const area20 = makeArea(d20, pts20, H, 28)
  const area21 = makeArea(d21, pts21, H, 28)

  const peak20 = pts20.reduce((a, b) => (b.y < a.y ? b : a))
  const peak21 = pts21.reduce((a, b) => (b.y < a.y ? b : a))

  return (
    <div className="bg-white rounded-2xl p-6 flex-1 min-w-0 shadow-lg shadow-amber-900/5 border border-amber-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-stone-800">Total Revenue</h2>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-amber-400 inline-block"/>
            <span className="text-stone-500">2022</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-amber-800 inline-block"/>
            <span className="text-stone-500">2023</span>
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
          <defs>
            {/* 2022: Light Caramel */}
            <linearGradient id="rev20-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.01"/>
            </linearGradient>
            {/* 2023: Dark Mocha */}
            <linearGradient id="rev21-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#92400e" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.01"/>
            </linearGradient>
          </defs>
          {/* Grid */}
          {['$10k','$20k','$30k','$40k'].map((l, i) => (
            <g key={i}>
              <line x1={34} y1={140 - i * 32} x2={W} y2={140 - i * 32} stroke="#f5f5f4" strokeWidth="1.5" strokeDasharray="4 4"/>
              <text x={0} y={140 - i * 32 + 4} fontSize="9" fill="#a8a29e" fontWeight="500">{l}</text>
            </g>
          ))}
          {/* Areas */}
          <path d={area20} fill="url(#rev20-g)"/>
          <path d={area21} fill="url(#rev21-g)"/>
          {/* Lines */}
          <path d={d20} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
          <path d={d21} fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Annotations */}
          {[
            { pt: peak20, val: '$36,703', color: '#f59e0b', boxColor: '#d97706' },
            { pt: peak21, val: '$52,483', color: '#78350f', boxColor: '#451a03' },
          ].map(({ pt, val, color, boxColor }, i) => (
            <g key={i}>
              <line x1={pt.x} y1={10} x2={pt.x} y2={H - 28} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
              <circle cx={pt.x} cy={pt.y} r="5" fill="white" stroke={color} strokeWidth="2"/>
              <rect x={pt.x - 24} y={pt.y - 26} width="48" height="18" rx="6" fill={boxColor} className="drop-shadow-md"/>
              <text x={pt.x} y={pt.y - 13} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{val}</text>
            </g>
          ))}
        </svg>
        {/* X labels */}
        <div className="flex justify-between px-3 mt-1">
          {months.map(m => (
            <span key={m} className="text-[10px] font-medium text-stone-400">{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CUSTOMER MAP (bar chart)
═══════════════════════════════════════════════ */
function CustomerMap() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const data = [
    { y: 62, r: 78 }, { y: 85, r: 42 }, { y: 54, r: 68 }, { y: 72, r: 88 },
    { y: 40, r: 58 }, { y: 66, r: 46 }, { y: 78, r: 52 },
  ]
  const maxVal = 100
  const W = 240, H = 120, chartH = 90, chartY = 10
  const barW = 12, gap = 4

  return (
    <div className="bg-white rounded-2xl p-6 min-w-[280px] shadow-lg shadow-amber-900/5 border border-amber-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-stone-800">Customer Map</h2>
        <div className="flex items-center gap-2">
          <select className="text-xs border border-amber-100 bg-amber-50/50 rounded-lg px-2 py-1.5 text-stone-600 focus:outline-none focus:border-amber-400 font-medium cursor-pointer">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <button className="text-stone-400 hover:text-amber-700 transition-colors">⋯</button>
        </div>
      </div>

      {/* Y labels + bars */}
      <div className="flex gap-2">
        {/* Y axis */}
        <div className="flex flex-col justify-between text-[10px] font-medium text-stone-400 pr-1 pb-5" style={{ height: H }}>
          {[80, 60, 40, 20, 0].map(v => <span key={v}>{v}</span>)}
        </div>

        {/* Bar chart */}
        <div className="flex-1 relative" style={{ height: H }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-stone-100"
              style={{ top: (1 - f) * (H - 20) + 'px' }}/>
          ))}

          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="relative z-10">
            {data.map((d, i) => {
              const centerX = (i + 0.5) * (W / data.length)
              const yH = (d.y / maxVal) * chartH
              const rH = (d.r / maxVal) * chartH
              const x1 = centerX - barW - gap / 2
              const x2 = centerX + gap / 2
              return (
                <g key={i}>
                  {/* Amber for New Customer */}
                  <rect x={x1} y={chartY + chartH - yH} width={barW} height={yH} rx="4" fill="#d97706" className="hover:opacity-80 transition-opacity cursor-pointer"/>
                  {/* Espresso for Old Customer */}
                  <rect x={x2} y={chartY + chartH - rH} width={barW} height={rH} rx="4" fill="#451a03" className="hover:opacity-80 transition-opacity cursor-pointer"/>
                </g>
              )
            })}
          </svg>

          {/* X labels */}
          <div className="flex justify-around text-[10px] font-medium text-stone-400 mt-1">
            {days.map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 justify-center text-xs font-medium text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-600 inline-block shadow-sm"/>New Customer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-950 inline-block shadow-sm"/>Old Customer
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   REVIEW CARD
═══════════════════════════════════════════════ */
function ReviewCard({ name, date, text, rating, foodImg, avatarSeed }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex gap-4 min-w-0 border border-amber-50 shadow-md shadow-amber-900/5 hover:shadow-lg hover:shadow-amber-900/10 transition-shadow">
      <img
        src={`https://picsum.photos/seed/${avatarSeed}/48/48`}
        alt={name}
        className="w-12 h-12 rounded-full object-cover shrink-0 ring-4 ring-amber-50"
        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${name}&size=48&background=fef3c7&color=b45309` }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-stone-800">{name}</p>
            <p className="text-[11px] font-medium text-stone-400 mt-0.5">{date}</p>
          </div>
          <img
            src={`https://picsum.photos/seed/${foodImg}/70/70`}
            alt="coffee"
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm"
          />
        </div>
        <p className="text-xs text-stone-600 leading-relaxed mt-3 line-clamp-3 font-medium">
          "{text}"
        </p>
        <div className="flex items-center gap-2 mt-3 bg-amber-50 w-fit px-2.5 py-1 rounded-lg">
          <div className="flex text-amber-500 text-xs">
            {'★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            <span className={rating === '5.0' ? "text-amber-500" : "text-amber-200"}>★</span>
          </div>
          <span className="text-xs font-bold text-amber-800">{rating}</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════ */
const reviews = [
  {
    name: 'Bima', date: '2 days ago', rating: '5.0',
    text: 'Butterscotch Latte-nya Papi Coffee juara banget! Manisnya pas, rasa kopinya tetep berasa tebal dan wangi karamelnya dapet banget.',
    avatarSeed: 'Bima', foodImg: 'latteart'
  },
  {
    name: 'Siti Sarah', date: '1 week ago', rating: '4.0',
    text: 'Americano di sini emang beda, roasting beans-nya dapet banget aroma fruity dan acidity-nya seimbang. Cocok buat kerja pagi.',
    avatarSeed: 'Siti', foodImg: 'americano'
  },
  {
    name: 'Arsyad', date: '3 weeks ago', rating: '5.0',
    text: 'Baru pertama nyobain Pistachio Latte. Unik banget rasanya! Creamy, nutty, dan kopinya smooth parah di tenggorokan.',
    avatarSeed: 'Arsyad', foodImg: 'pistachiocoffee'
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-full bg-[#faf8f5] p-4 sm:p-6 rounded-3xl">

      {/* ── Page Header ── */}
      <PageHeader
        title="Dashboard Papi Coffee"
        subtitle="Hi, Barista. Welcome back to Papi Coffee Admin!"
        showFilter={true}
        filterLabel="Filter Periode"
        filterSub="This Month"
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="6" width="20" height="16" rx="4"/>
              <path d="M4 10h20M9 14h2M13 14h6M9 17h4"/>
            </svg>
          }
          value="1,284"
          label="Cups Sold"
          change="+4.4 (12%) total"
          changeDir="up"
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          icon={
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 14l5 5L22 8"/>
              <rect x="3" y="3" width="22" height="22" rx="6" opacity="0.2"/>
            </svg>
          }
          value="856"
          label="Dine-in Orders"
          change="+8.4 (20%) total"
          changeDir="up"
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
        <StatCard
          icon={
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="14" cy="14" r="9"/>
              <line x1="14" y1="10" x2="14" y2="14"/>
              <circle cx="14" cy="17" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          }
          value="12"
          label="Waste/Cancelled"
          change="-2.1 (-2.2%) total"
          changeDir="down"
          iconBg="bg-stone-200"
          iconColor="text-stone-600"
        />
        <StatCard
          icon={
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="8" width="20" height="14" rx="4"/>
              <path d="M9 8V6a5 5 0 0110 0v2"/>
              <circle cx="14" cy="15" r="3"/>
              <line x1="14" y1="18" x2="14" y2="20"/>
            </svg>
          }
          value="$15.4k"
          label="Total Revenue"
          change="+1.2 (3.10%) total"
          changeDir="up"
          iconBg="bg-[#451a03]"
          iconColor="text-white"
        />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PieChartsPanel />
        <ChartOrder />
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="flex gap-5 flex-col xl:flex-row">
        <TotalRevenueChart />
        <CustomerMap />
      </div>

      {/* ── Customer Reviews ── */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-900/5 border border-amber-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-stone-800">Customer Review</h2>
            <p className="text-[12px] font-medium text-stone-400 mt-0.5">What people say about our brews.</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white border border-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-50 transition-all text-sm shadow-sm">‹</button>
            <button className="w-9 h-9 rounded-full bg-[#78350f] border border-[#78350f] text-white flex items-center justify-center hover:bg-[#451a03] transition-all text-sm shadow-sm shadow-amber-900/30">›</button>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  )
}