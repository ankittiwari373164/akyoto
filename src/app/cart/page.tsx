'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

const categoryEmoji: Record<string, string> = {
  'CCTV / Cameras': '📷', 'Smart Locks': '🔐', 'Alarm Systems': '🚨',
  'Access Control': '🛡️', 'Fire Safety': '🔥', 'Network Security': '📡',
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={72} className="mx-auto text-slate-200 mb-5" />
          <h2 className="text-3xl font-bold mb-3" style={{fontFamily:'Rajdhani,sans-serif'}}>Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add security products to get started!</p>
          <Link href="/shop"><button className="btn-primary py-3 px-8">Browse Products</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8" style={{fontFamily:'Rajdhani,sans-serif'}}>Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                  >
                    <div className="flex gap-5">
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-primary-50 flex-shrink-0 flex items-center justify-center">
                        {item.product.image_url ? (
                          <div className="relative w-full h-full">
                            <Image src={item.product.image_url} alt={item.product.name} fill className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-4xl">{categoryEmoji[item.product.category] || '🔒'}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-3 mb-1">
                          <div>
                            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{item.product.category}</span>
                            <Link href={`/product/${item.product.slug}`}>
                              <h3 className="font-bold text-slate-900 hover:text-primary-700 transition-colors leading-snug" style={{fontFamily:'Rajdhani,sans-serif'}}>
                                {item.product.name}
                              </h3>
                            </Link>
                            {item.product.brand && <p className="text-xs text-slate-400 mt-0.5">{item.product.brand}</p>}
                          </div>
                          <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-1 py-1 border border-slate-100">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500">
                              <Minus size={15} />
                            </button>
                            <span className="font-bold text-slate-900 w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500">
                              <Plus size={15} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-extrabold text-primary-700" style={{fontFamily:'Rajdhani,sans-serif'}}>
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-400">₹{item.product.price.toLocaleString('en-IN')} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold text-slate-900 mb-6" style={{fontFamily:'Rajdhani,sans-serif'}}>Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-semibold">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-primary-700" style={{fontFamily:'Rajdhani,sans-serif'}}>₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full btn-primary py-4 text-base group">
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="w-full btn-outline mt-3 py-3 text-sm">Continue Shopping</button>
                </Link>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Truck size={13} className="text-primary-500" /> Free shipping on all orders
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield size={13} className="text-primary-500" /> Installation available across India
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}