'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function NavBar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuItems = [
    { label: "My Agents", href: "/agents" },
    { label: "Analytics", href: "/analytics" },
    { label: "Models", href: "/marketplace" },
    { label: "Docs", href: "/docs" },
  ]

  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-black/20 border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Home Link */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-white font-bold text-2xl flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-lg">
                AI
              </div>
              <span>Agent Hub</span>
            </Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className={`md:flex space-x-2 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center">
            <Button 
              onClick={() => router.push('/auth/signin')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 h-auto text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Connect
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-2 mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 h-auto text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
              >
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 