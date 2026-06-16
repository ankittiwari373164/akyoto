'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const categories = [
  { value: 'All Products',              label: 'All Products' },
  { value: 'CCTV',                      label: 'CCTV / Cameras' },
  { value: 'Alarm System',              label: 'Alarm Systems' },
  { value: 'Fire Alarm System',         label: 'Fire Alarm System' },
  { value: 'Access Control',            label: 'Access Control' },
  { value: 'Wireless Sensors',          label: 'Wireless Sensors' },
  { value: 'Guard Monitoring Solution', label: 'Guard Monitoring' },
  { value: 'Alarm Siren',               label: 'Alarm Siren' },
  { value: 'Door Bell',                 label: 'Door Bell' },
  { value: 'Networking',                label: 'Networking' },
]

const sortOptions = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name',       label: 'Name: A to Z' },
]

const priceRanges = [
  { label: 'All Prices',          min: 0,     max: Infinity },
  { label: 'Under ₹5,000',        min: 0,     max: 5000 },
  { label: '₹5,000 – ₹20,000',   min: 5000,  max: 20000 },
  { label: '₹20,000 – ₹50,000',  min: 20000, max: 50000 },
  { label: 'Above ₹50,000',       min: 50000, max: Infinity },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Products')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { filterAndSortProducts() }, [products, selectedCategory, searchQuery, sortBy, selectedPriceRange])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    const range = priceRanges[selectedPriceRange]
    filtered = filtered.filter(p => p.price >= range.min && p.price <= range.max)
    switch (sortBy) {
      case 'price-low':  filtered.sort((a, b) => a.price - b.price); break
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break
      case 'name':       filtered.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Security Products</h1>
            <p className="text-primary-200 text-lg max-w-xl mx-auto">
              Professional-grade security equipment from India's most trusted brands.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>Filters</h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                        selectedCategory === cat.value ? 'bg-primary-100 text-primary-800 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range, i) => (
                    <button key={i} onClick={() => setSelectedPriceRange(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                        selectedPriceRange === i ? 'bg-primary-100 text-primary-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategory('All Products'); setSearchQuery(''); setSelectedPriceRange(0) }}
                className="w-full btn-outline py-2.5 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search security products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 outline-none text-sm bg-slate-50 font-medium"
                >
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium bg-slate-50 hover:bg-primary-50 hover:border-primary-300 transition-colors">
                  <SlidersHorizontal size={16} /> Filters
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-500 text-sm">
                <span className="font-bold text-slate-800">{filteredProducts.length}</span> products found
                {selectedCategory !== 'All Products' && (
                  <span className="ml-1">in <span className="text-primary-700 font-semibold">
                    {categories.find(c => c.value === selectedCategory)?.label ?? selectedCategory}
                  </span></span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-96"><div className="h-56 bg-slate-100" /><div className="p-5 space-y-3"><div className="h-4 bg-slate-100 rounded" /><div className="h-3 bg-slate-100 rounded w-2/3" /></div></div>)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>No products found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return <Suspense><ShopContent /></Suspense>
}