'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, User, MapPin, Shield, Clock, ChevronRight, Wrench } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
    fetchOrders(user.id)
  }

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch { console.error('Error fetching orders') }
    finally { setLoading(false) }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-100',
    processing: 'bg-blue-50 text-blue-800 border-blue-100',
    shipped: 'bg-purple-50 text-purple-800 border-purple-100',
    delivered: 'bg-green-50 text-green-800 border-green-100',
    cancelled: 'bg-red-50 text-red-800 border-red-100',
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>My Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <Link href="/shop">
              <button className="btn-primary py-2.5 px-5 text-sm hidden md:flex items-center gap-2">
                <Package size={16} /> Shop More
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: 'Total Orders', value: orders.length, color: 'text-primary-600', bg: 'bg-primary-50' },
              { icon: Clock, label: 'Pending', value: orders.filter(o => o.status === 'pending' || o.status === 'processing').length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Shield, label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Wrench, label: 'With Installation', value: orders.filter(o => o.shipping_address?.installationRequired).length, color: 'text-violet-600', bg: 'bg-violet-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mb-0.5" style={{fontFamily:'Rajdhani,sans-serif'}}>{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>Recent Orders</h2>
                  <Link href="/orders" className="text-primary-600 text-sm font-semibold hover:text-primary-800 flex items-center gap-1">
                    View All <ChevronRight size={16} />
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package size={48} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-500 font-medium">No orders yet</p>
                    <p className="text-slate-400 text-sm mb-5">Start securing your space today!</p>
                    <Link href="/shop"><button className="btn-primary py-2.5 px-6 text-sm">Browse Products</button></Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm" style={{fontFamily:'Rajdhani,sans-serif'}}>
                              Order #{order.id.substring(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 text-sm">₹{order.total.toLocaleString('en-IN')}</span>
                            <span className={`status-badge border ${statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {order.shipping_address?.installationRequired && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 font-medium">
                            <Wrench size={12} /> Installation requested
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Account & Quick Links */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{fontFamily:'Rajdhani,sans-serif'}}>
                    {(user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{user?.user_metadata?.full_name || 'My Account'}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[160px]">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { href: '/orders', label: 'All Orders', icon: Package },
                    { href: '/track-order', label: 'Track an Order', icon: MapPin },
                    { href: '/contact', label: 'Request Service', icon: Wrench },
                  ].map(link => (
                    <Link key={link.href} href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all font-medium group">
                      <link.icon size={16} className="text-slate-400 group-hover:text-primary-600" />
                      {link.label}
                      <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-primary-500" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white">
                <Shield size={28} className="text-primary-300 mb-3" />
                <h3 className="font-bold mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>Need Help?</h3>
                <p className="text-primary-200 text-sm mb-4">Our security experts are available 24/7 for support.</p>
                <Link href="/contact">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}