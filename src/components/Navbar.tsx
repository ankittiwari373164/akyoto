'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, Shield, Search, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setMounted(true)
    checkUser()
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      authListener.subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="flex items-center gap-2 text-primary-200">
            <Shield size={12} /> Trusted Security Solutions Since 2010
          </span>
          <div className="flex items-center gap-6 text-primary-200">
            <a href="tel:+911234567890" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={12} />+91-9650715739
            </a>
            <span>Free Installation on Orders Above ₹10,000</span>
          </div>
        </div>
      </div>

      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-blue-900/8' : 'shadow-sm'} border-b border-slate-100`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-18 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-primary-400/40 transition-shadow">
                  <Shield size={22} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full badge-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-extrabold text-primary-900 tracking-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>AKYOTO</span>
                <span className="block text-[10px] font-semibold text-primary-500 tracking-[0.15em] uppercase -mt-1">Secure Systems</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-slate-600 hover:text-primary-700 font-medium text-sm rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Link href="/shop" className="hidden md:flex p-2.5 hover:bg-primary-50 rounded-lg transition-colors text-slate-500 hover:text-primary-600">
                <Search size={20} />
              </Link>

              <Link href="/cart" className="relative p-2.5 hover:bg-primary-50 rounded-lg transition-colors text-slate-500 hover:text-primary-600">
                <ShoppingCart size={20} />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="p-2.5 hover:bg-primary-50 rounded-lg transition-colors text-slate-500 hover:text-primary-600">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/orders" className="flex items-center px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      My Orders
                    </Link>
                    <Link href="/track-order" className="flex items-center px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors">
                      Track Order
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <button className="btn-primary py-2 px-5 text-sm hidden md:flex">
                    Login
                  </button>
                </Link>
              )}

              <button
                className="md:hidden p-2.5 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-2 text-slate-700 hover:text-primary-600 font-medium text-sm rounded-lg hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/dashboard" className="block py-3 px-2 text-slate-700 hover:text-primary-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link href="/orders" className="block py-3 px-2 text-slate-700 hover:text-primary-600 font-medium text-sm" onClick={() => setIsOpen(false)}>My Orders</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left py-3 px-2 text-red-600 font-medium text-sm">Logout</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full btn-primary mt-3 py-3">Login / Register</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}