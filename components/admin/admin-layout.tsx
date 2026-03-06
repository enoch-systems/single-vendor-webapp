'use client'

import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from './admin-header'
import { AdminSideMenu } from './admin-side-menu'
import { useAuth } from '@/contexts/auth-context'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export const AdminLayout = ({ children, currentPath = '' }: AdminLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (currentPath !== '/admin/login' && !loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router, currentPath])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <AdminHeader 
        currentPath={currentPath}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Menu Toggle Button - Remove since it's now in the header */}
      {/* <div className="fixed top-4 left-4 z-30 lg:hidden">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800"
        >
          <Menu size={20} className="text-gray-300" />
        </button>
      </div> */}

      {/* Admin Side Menu */}
      <AdminSideMenu 
        currentPath={currentPath}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Main Content */}
      <main className="pt-16 p-6">
        {children}
      </main>
    </div>
  )
}
