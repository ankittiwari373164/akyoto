'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Star, Truck, Shield, Wrench, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'

const categoryEmoji: Record<string, string> = {
  'CCTV': '📷', 'Alarm System': '🚨', 'Fire Alarm System': '🔥',
  'Access Control': '🛡️', 'Wireless Sensors': '📡', 'Guard Monitoring Solution': '👁️',
  'Alarm Siren': '🔔', 'Door Bell': '🔔', 'Networking': '🌐',
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'installation'>('details')
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
      if (error) throw error
      setProduct(data)
    } catch {
      console.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(`${quantity}x ${product.name} added to cart!`, {
        icon: '🛒',
        style: { borderRadius: '10px', background: '#1e3a8a', color: '#fff' },
      })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div></div>
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Product not found</h2>
          <Link href="/shop"><button className="btn-primary">Back to Shop</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4">
        <Link href="/shop" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium text-sm mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Products
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex items-center justify-center min-h-96">
              {product.image_url ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  <Image src={product.image_url} alt={product.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-9xl mb-4">{categoryEmoji[product.category] || '🔒'}</div>
                  <span className="text-sm text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{product.category}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">{product.category}</span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-3 mb-3 leading-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>{product.name}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-accent-400 fill-current" />)}</div>
                  <span className="text-sm text-slate-500">(4.9 · 38 reviews)</span>
                  {product.brand && <span className="text-sm text-slate-500">by <span className="font-semibold text-slate-700">{product.brand}</span></span>}
                </div>

                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-4xl font-extrabold text-primary-700" style={{fontFamily:'Rajdhani,sans-serif'}}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.weight && <span className="text-slate-400 text-sm">/ {product.weight}</span>}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
                      <CheckCircle size={14} /> In Stock ({product.stock} units)
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 text-sm font-semibold px-4 py-2 rounded-full border border-red-100">Out of Stock</span>
                  )}
                  {product.warranty && (
                    <span className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full border border-primary-100">
                      <Shield size={14} /> {product.warranty} Warranty
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors">
                      <Minus size={18} />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center" style={{fontFamily:'Rajdhani,sans-serif'}}>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-11 h-11 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 transition-colors" disabled={quantity >= product.stock}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50">
                    <ShoppingCart size={20} /> Add to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </button>
                </div>
                <Link href="/contact" className="block mt-3">
                  <button className="w-full btn-outline py-3 text-sm flex items-center justify-center gap-2">
                    <Phone size={16} /> Request a Quote / Bulk Order
                  </button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'All orders' },
                  { icon: Wrench, label: 'Installation', sub: 'Available' },
                  { icon: Shield, label: 'Genuine', sub: 'Warranty' },
                ].map((f, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 text-center border border-slate-100">
                    <f.icon className="mx-auto text-primary-600 mb-2" size={22} />
                    <p className="text-xs font-bold text-slate-800">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
              {(['details', 'specs', 'installation'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-sm font-bold capitalize transition-colors ${
                    activeTab === tab ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50/50' : 'text-slate-500 hover:text-slate-700'
                  }`} style={{fontFamily:'Rajdhani,sans-serif'}}>
                  {tab === 'details' ? 'Product Details' : tab === 'specs' ? 'Specifications' : 'Installation'}
                </button>
              ))}
            </div>
            <div className="p-8">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Brand', value: product.brand || 'Professional Grade' },
                    { label: 'SKU', value: product.sku },
                    { label: 'Weight', value: product.weight || 'See packaging' },
                    { label: 'Warranty', value: product.warranty || 'Standard warranty' },
                    { label: 'Category', value: product.category },
                    { label: 'Availability', value: product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' },
                  ].map(d => (
                    <div key={d.label} className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-sm font-semibold text-slate-500">{d.label}</span>
                      <span className="text-sm font-bold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="text-slate-600 leading-relaxed">
                  <p>Detailed technical specifications are available in the product datasheet. Contact our technical team for complete specifications or a compatibility assessment for your installation.</p>
                  <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                    <p className="text-primary-800 font-semibold text-sm">Need technical help?</p>
                    <p className="text-primary-600 text-sm">Our engineers are available Mon–Sat, 9AM–7PM for pre-sales consultation.</p>
                  </div>
                </div>
              )}
              {activeTab === 'installation' && (
                <div className="space-y-4">
                  {['Free installation available for orders above ₹5,000 in metro cities.',
                    'Certified technicians complete installation within 24–48 hours of delivery.',
                    'Post-installation support and training included with every order.',
                    'Annual Maintenance Contracts (AMC) available for all product categories.'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}