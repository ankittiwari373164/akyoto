'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Shield, Lock } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart`, {
      style: {
        borderRadius: '10px',
        background: '#2158e0',
        color: '#fff',
      },
    })
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group cursor-pointer h-full flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-slate-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Lock size={40} strokeWidth={1} className="text-slate-300" />
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-blue-100 shadow-sm">
              {product.category}
            </span>
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-black/70 px-4 py-2 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-amber-400 fill-current" />
            ))}
            <span className="text-xs text-slate-400 ml-1">(4.8)</span>
            {product.warranty && (
              <span className="ml-auto flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                <Shield size={10} /> {product.warranty}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-2 text-base leading-snug">
            {product.name}
          </h3>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xl font-bold text-blue-700">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.weight && (
                <span className="text-xs text-slate-400 ml-1">/ {product.weight}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white py-2 px-4 text-sm rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={15} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}