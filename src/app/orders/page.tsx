'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, ChevronDown, ChevronUp, MapPin, Wrench } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
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
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>My Orders</h1>
            <Link href="/track-order" className="text-primary-600 text-sm font-semibold hover:text-primary-800 flex items-center gap-1">
              <MapPin size={14} /> Track Order
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
              <Package size={56} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>No orders yet</h3>
              <p className="text-slate-500 mb-6">Your orders will appear here once you make a purchase.</p>
              <Link href="/shop"><button className="btn-primary">Start Shopping</button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Package size={22} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>
                          #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-extrabold text-slate-900 text-lg" style={{fontFamily:'Rajdhani,sans-serif'}}>₹{order.total.toLocaleString('en-IN')}</p>
                        <span className={`status-badge border text-xs ${statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-100'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      {expanded === order.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </button>

                  {expanded === order.id && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/30">
                      {order.shipping_address && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shipping Address</p>
                          <div className="bg-white rounded-xl p-4 border border-slate-100 text-sm text-slate-700">
                            <p className="font-semibold">{order.shipping_address.fullName}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}</p>
                            <p>Phone: {order.shipping_address.phone}</p>
                            {order.shipping_address.installationRequired && (
                              <p className="flex items-center gap-1.5 text-violet-600 font-medium mt-2">
                                <Wrench size={12} /> Installation requested
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order Timeline</p>
                      <div className="flex gap-2 flex-wrap">
                        {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => {
                          const currentIdx = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status)
                          const isReached = i <= currentIdx
                          return (
                            <div key={s} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${isReached ? 'bg-primary-600 text-white border-primary-700' : 'bg-white text-slate-400 border-slate-200'}`}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}