'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Shield, Search, Phone, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import { categories } from '@/lib/categories'

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
            <a href="tel:+919650715739" className="flex items-center gap-1 hover:text-white transition-colors">
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
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/akyoto-logo.png"
                alt="Akyoto Secure Systems"
                width={160}
                height={46}
                priority
                className="h-11 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-slate-600 hover:text-white font-medium text-sm rounded-lg hover:bg-primary-500 transition-all duration-200"
              >
                Home
              </Link>

              {/* Products — mega menu opens on hover, closes on hover-out (no click needed) */}
              <div className="relative group">
                <Link
                  href="/shop"
                  className="px-4 py-2 text-slate-600 hover:text-white font-medium text-sm rounded-lg hover:bg-primary-500 transition-all duration-200 inline-block"
                >
                  Products
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="w-[640px] bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-6">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover/item:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                              <Icon size={17} className="text-blue-600" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 leading-tight">{cat.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Browse the full catalogue</span>
                      <Link href="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        View All Products <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {navLinks.filter(l => l.href !== '/').map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-slate-600 hover:text-white font-medium text-sm rounded-lg hover:bg-primary-500 transition-all duration-200"
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
              <Link
                href="/"
                className="block py-3 px-2 text-slate-700 hover:text-primary-600 font-medium text-sm rounded-lg hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block py-3 px-2 text-slate-700 hover:text-primary-600 font-medium text-sm rounded-lg hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <div className="pl-4 mb-2 grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="block py-1.5 text-xs text-slate-500 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              {navLinks.filter(l => l.href !== '/').map((link) => (
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
