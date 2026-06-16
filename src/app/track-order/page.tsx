'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, XCircle, MapPin, Wrench } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
      if (error) throw error
      setOrder(data)
    } catch {
      toast.error('Order not found. Please check your Order ID.')
      setOrder(null)
    } finally { setLoading(false) }
  }

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered']
  const statusInfo: Record<string, { icon: any; label: string; color: string; desc: string }> = {
    pending: { icon: Package, label: 'Order Placed', color: 'text-blue-600', desc: 'Your order has been received and is pending confirmation.' },
    processing: { icon: Package, label: 'Processing', color: 'text-amber-600', desc: 'Your order is being prepared for dispatch.' },
    shipped: { icon: Truck, label: 'Shipped', color: 'text-purple-600', desc: 'Your order is on its way to you.' },
    delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-green-600', desc: 'Your order has been successfully delivered.' },
    cancelled: { icon: XCircle, label: 'Cancelled', color: 'text-red-600', desc: 'This order has been cancelled.' },
  }

  const currentInfo = order ? (statusInfo[order.status] || statusInfo.pending) : null
  const currentIdx = order ? statusSteps.indexOf(order.status) : -1

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-extrabold text-white mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Track Your Order</h1>
            <p className="text-primary-200 text-lg">Enter your Order ID to get real-time status updates</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Order ID</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your full Order ID"
                  required
                  className="flex-1 input-field"
                />
                <button type="submit" disabled={loading} className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50">
                  {loading ? 'Searching...' : <><Search size={18} /> Track</>}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">You can find your Order ID in your confirmation email or dashboard.</p>
            </form>

            {order && currentInfo && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Status Header */}
                <div className={`p-8 text-center border-b border-slate-100`}>
                  <currentInfo.icon className={`mx-auto ${currentInfo.color} mb-3`} size={52} />
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1" style={{fontFamily:'Rajdhani,sans-serif'}}>{currentInfo.label}</h2>
                  <p className="text-slate-500 text-sm">{currentInfo.desc}</p>
                </div>

                {/* Timeline */}
                {order.status !== 'cancelled' && (
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">Order Progress</h3>
                    <div className="relative">
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100"></div>
                      <div
                        className="absolute top-5 left-5 h-0.5 bg-primary-500 transition-all duration-500"
                        style={{ width: currentIdx >= 0 ? `${(currentIdx / (statusSteps.length - 1)) * 100}%` : '0%' }}
                      ></div>
                      <div className="relative flex justify-between">
                        {statusSteps.map((s, i) => {
                          const info = statusInfo[s]
                          const isReached = i <= currentIdx
                          const isCurrent = i === currentIdx
                          return (
                            <div key={s} className="flex flex-col items-center gap-2 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${isReached ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                                {isReached ? <CheckCircle size={18} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                              </div>
                              <span className={`text-xs font-semibold text-center ${isCurrent ? 'text-primary-700' : isReached ? 'text-slate-700' : 'text-slate-400'}`}>
                                {info.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Order Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order ID', value: order.id.substring(0, 8).toUpperCase() },
                      { label: 'Order Date', value: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                      { label: 'Total Amount', value: `₹${order.total.toLocaleString('en-IN')}` },
                      { label: 'Status', value: order.status.charAt(0).toUpperCase() + order.status.slice(1) },
                    ].map(d => (
                      <div key={d.label} className="flex justify-between text-sm">
                        <span className="text-slate-500">{d.label}</span>
                        <span className="font-semibold text-slate-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                {order.shipping_address && (
                  <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <MapPin size={12} /> Shipping Address
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
                      <p className="font-semibold">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}</p>
                      <p className="text-slate-500">Phone: {order.shipping_address.phone}</p>
                      {order.shipping_address.installationRequired && (
                        <p className="flex items-center gap-1.5 text-violet-600 font-semibold mt-2">
                          <Wrench size={12} /> Installation service requested
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}