'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Truck, Lock, Shield, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '',
    city: '', state: '', pincode: '', paymentMethod: 'cod',
    installationRequired: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to place an order')
        router.push('/login')
        return
      }
      const shippingAddress = {
        fullName: formData.fullName, email: formData.email, phone: formData.phone,
        address: formData.address, city: formData.city, state: formData.state, pincode: formData.pincode,
        installationRequired: formData.installationRequired,
      }
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id, total: getTotalPrice(), status: 'pending', shipping_address: shippingAddress,
      }).select().single()
      if (orderError) throw orderError
      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map(item => ({ order_id: order.id, product_id: item.product.id, quantity: item.quantity, price: item.product.price }))
      )
      if (itemsError) throw itemsError
      clearCart()
      toast.success('Order placed successfully! We will contact you shortly.')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null
  if (items.length === 0) { router.push('/cart'); return null }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8" style={{fontFamily:'Rajdhani,sans-serif'}}>Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Shipping */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Truck size={20} className="text-primary-600" />
                    </div>
                    <h2 className="text-xl font-bold" style={{fontFamily:'Rajdhani,sans-serif'}}>Shipping Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="input-field resize-none" placeholder="House/Flat no., Street, Area..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">State *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} required className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">PIN Code *</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required pattern="[0-9]{6}" className="input-field" placeholder="6-digit PIN code" />
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2 mt-2">
                      <input type="checkbox" name="installationRequired" id="installation" checked={formData.installationRequired} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-primary-600" />
                      <label htmlFor="installation" className="text-sm text-slate-700 cursor-pointer">
                        <span className="font-semibold">Request Installation Service</span>
                        <span className="block text-slate-500 text-xs mt-0.5">Our technician will contact you to schedule installation after delivery.</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-primary-600" />
                    </div>
                    <h2 className="text-xl font-bold" style={{fontFamily:'Rajdhani,sans-serif'}}>Payment Method</h2>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-primary-200 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="accent-primary-600 w-4 h-4" />
                      <div>
                        <p className="font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when you receive the product</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl cursor-pointer opacity-50">
                      <input type="radio" name="paymentMethod" value="online" disabled className="w-4 h-4" />
                      <div>
                        <p className="font-semibold text-slate-900">Online Payment (UPI / Cards)</p>
                        <p className="text-xs text-slate-500">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50">
                  <Lock size={18} />
                  {loading ? 'Placing Order...' : 'Place Order Securely'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                <h2 className="text-lg font-bold mb-5" style={{fontFamily:'Rajdhani,sans-serif'}}>Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-slate-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-semibold">₹{getTotalPrice().toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Shipping</span><span className="font-semibold text-green-600">FREE</span></div>
                  <div className="flex justify-between font-bold text-lg border-t border-slate-100 pt-2 mt-1">
                    <span>Total</span>
                    <span className="text-primary-700" style={{fontFamily:'Rajdhani,sans-serif'}}>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {['GST included in price', 'Secure checkout', 'Free installation on orders ₹5k+'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle size={12} className="text-green-500" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}