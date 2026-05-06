// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar tetap ada di sini */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* 👇 Halaman seperti Dashboard, Orders, dll akan dirender di sini */}
          <Outlet /> 
        </main>
      </div>
    </div>
  )
}