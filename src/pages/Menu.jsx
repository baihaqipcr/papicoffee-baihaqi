/**
 * Menu.jsx — Halaman Menu Papi Coffee
 * Menampilkan katalog makanan dan minuman dengan desain kartu yang elegan
 * Menggunakan shadcn/ui components
 */

import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MENU_ITEMS from './menu.json'

/* ── Menu Card Component ── */
function MenuCard({ item }) {
  const getCategoryColor = () => {
    switch(item.category) {
      case 'Kopi':
        return 'bg-amber-100 text-amber-800'
      case 'Minuman':
        return 'bg-blue-100 text-blue-800'
      case 'Makanan':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = () => {
    switch(item.category) {
      case 'Kopi':
        return (
          <svg className="w-16 h-16 text-amber-700 opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3v6c0 2.21 1.791 4 4 4h10c2.209 0 4-1.79 4-4V3H3zm12 10H7c-2.209 0-4 1.791-4 4v3h16v-3c0-2.209-1.791-4-4-4z" />
          </svg>
        )
      case 'Minuman':
        return (
          <svg className="w-16 h-16 text-blue-600 opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v8c0 1.105.895 2 2 2h10c1.105 0 2-.895 2-2v-8h2V9H3v4zm2-2h12V3H5v8z" />
          </svg>
        )
      case 'Makanan':
        return (
          <svg className="w-16 h-16 text-orange-600 opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.5 14h1v-3h-1v3zm4-5h1V5h-1v4zm-8 1h1V8h-1v2zM3 3h18v4H3V3zm0 6h18v10H3V9z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-lg hover:border-amber-200 transition-all duration-300 group overflow-hidden flex flex-col h-full">
      {/* Image Placeholder dengan Icon */}
      <div className="w-full h-40 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300 relative overflow-hidden">
        <div className="text-center">
          {getCategoryIcon()}
        </div>
      </div>

      <CardContent className="flex-grow pt-5">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${getCategoryColor()}`}>
            {item.category}
          </span>
        </div>

        {/* Nama Item */}
        <h3 className="text-lg font-black text-gray-800 mb-2 group-hover:text-amber-800 transition-colors line-clamp-2">
          {item.name}
        </h3>

        {/* Deskripsi */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </CardContent>

      {/* Price & Add Button - Footer */}
      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-2xl font-black text-amber-800">
          {item.price}
        </span>
        <Button 
          size="icon" 
          variant="secondary"
          className="bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white"
        >
          +
        </Button>
      </CardFooter>
    </Card>
  )
}

/* ── Filter Tabs ── */
function FilterTab({ label, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? 'default' : 'outline'}
      className={active ? 'bg-amber-700 hover:bg-amber-800' : ''}
    >
      {label}
    </Button>
  )
}

/* ── Main Component ── */
export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  // ── useEffect 1: Load kategori dari localStorage saat component mount ──
  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedMenuCategory')
    if (savedCategory) {
      setSelectedCategory(savedCategory)
    }
  }, [])

  // ── useEffect 2: Simpan kategori ke localStorage ketika kategori berubah ──
  useEffect(() => {
    localStorage.setItem('selectedMenuCategory', selectedCategory)
  }, [selectedCategory])

  // ── useEffect 3: Update document title berdasarkan kategori yang dipilih ──
  useEffect(() => {
    if (selectedCategory === 'Semua') {
      document.title = 'Menu - Papi Coffee'
    } else {
      document.title = `Menu ${selectedCategory} - Papi Coffee`
    }
  }, [selectedCategory])

  const categories = ['Semua', 'Kopi', 'Minuman', 'Makanan']
  const filteredItems = selectedCategory === 'Semua' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Menu Papi Coffee"
        subtitle="Nikmati koleksi pilihan kopi, minuman, dan makanan lezat kami."
      />

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map(cat => (
          <FilterTab
            key={cat}
            label={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg font-semibold">
            Tidak ada item di kategori ini
          </p>
        </div>
      )}
    </div>
  )
}
