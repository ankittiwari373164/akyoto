'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, ShoppingCart, User, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.getTotalItems())

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: LayoutGrid },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { href: '/contact', label: 'Contact', icon: Phone },
    { href: '/login', label: 'Account', icon: User },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? 'text-primary-900' : 'text-slate-400'}
                />
                {typeof badge === 'number' && badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-primary-900 text-white text-[10px] leading-[16px] text-center font-semibold">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-primary-900' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-900" />
              )}
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for iOS devices */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  )
}