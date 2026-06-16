'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Shield, Zap } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

const categoryIcons: Record<string, string> = {
  'CCTV / Cameras': '📷',
  'Smart Locks': '🔐',
  'Alarm Systems': '🚨',
  'Access Control': '🛡️',
  'Fire Safety': '🔥',
  'Networking / WiFi Security': '📡',
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#1e3a8a',
        color: '#fff',
      },
    })
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <Link href={`/product/${product.slug}`}>
        <div className="card group cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-primary-50">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {categoryIcons[product.category] || '🔒'}
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary-100 shadow-sm">
                {product.category}
              </span>
            </div>
            {product.stock < 5 && product.stock > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Only {product.stock} left
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-bold bg-black/60 px-4 py-2 rounded-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-accent-400 fill-current" />
              ))}
              <span className="text-xs text-slate-400 ml-1">(4.8)</span>
              {product.warranty && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-primary-600 font-medium">
                  <Shield size={10} /> {product.warranty}
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-primary-700 transition-colors line-clamp-2 text-base leading-snug" style={{fontFamily:'Rajdhani,sans-serif'}}>
              {product.name}
            </h3>

            <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-2xl font-bold text-primary-700" style={{fontFamily:'Rajdhani,sans-serif'}}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.weight && (
                  <span className="text-xs text-slate-400 ml-1">/ {product.weight}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={15} />
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}