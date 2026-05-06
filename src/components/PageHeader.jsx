/**
 * PageHeader — Reusable page title + subtitle + optional filter + breadcrumb + children
 *
 * Props:
 *   title       string  — Main page title
 *   subtitle    string  — Subtitle / greeting text
 *   showFilter  bool    — Show the filter period button
 *   filterLabel string  — Filter button label (default: "Filter Periode")
 *   filterSub   string  — Filter date range subtitle
 *   breadcrumb  string|array — Breadcrumb navigation (string or array of strings)
 *   children    node    — Additional elements like buttons
 */

import React, { useState } from 'react'

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="1" y="2.5" width="12" height="10" rx="1.5" />
    <line x1="1" y1="5.5" x2="13" y2="5.5" />
    <line x1="4" y1="1" x2="4" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
  </svg>
)
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="3 5 7 9 11 5" />
  </svg>
)

export default function PageHeader({
  title = 'Dashboard',
  subtitle = '',
  showFilter = true,
  filterLabel = 'Filter Periode',
  filterSub = '17 April 2020 – 21 May 2020',
  breadcrumb,
  children,
}) {
  const [open, setOpen] = useState(false)

  // Fungsi bantuan untuk me-render breadcrumb (mendukung String atau Array)
  const renderBreadcrumb = () => {
    if (!breadcrumb) return null;

    // Jika breadcrumb berupa Array (contoh: ['Dashboard', 'Customer'])
    if (Array.isArray(breadcrumb)) {
      return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1 font-medium">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              <span className={index === breadcrumb.length - 1 ? 'text-gray-800' : 'hover:text-green-500 cursor-pointer transition-colors'}>
                {item}
              </span>
              {/* Menampilkan pemisah "/" kecuali pada item terakhir */}
              {index < breadcrumb.length - 1 && <span className="text-gray-300">/</span>}
            </React.Fragment>
          ))}
        </nav>
      );
    }

    // Jika breadcrumb hanya berupa String biasa (contoh: "Dashboard / Customer")
    return <p className="text-sm text-gray-500 mb-1 font-medium">{breadcrumb}</p>;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
      {/* Bagian Kiri: Breadcrumb & Title */}
      <div>
        {renderBreadcrumb()}
        <h1 className="text-2xl font-extrabold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Bagian Kanan: Children (Tombol Add, Filter, dll) */}
      {(children || showFilter) && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
          {showFilter && (
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 hover:border-green-400 hover:text-green-600 transition-all shadow-sm"
            >
              <span className="text-blue-500"><CalendarIcon /></span>
              <div className="text-left">
                <div className="font-semibold text-gray-700">{filterLabel}</div>
                <div className="text-gray-400 text-[10px]">{filterSub}</div>
              </div>
              <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>
                <ChevronIcon />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}