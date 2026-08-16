'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, Award, Wrench, Truck, Phone, ChevronLeft, ChevronRight, Bell, CheckCircle,
} from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { categories } from '@/lib/categories'
import ProductCard from '@/components/ProductCard'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1800&q=80',
    title: 'One-stop whole home security & safety solutions',
    text: 'Whole-home intelligent alarm, gas, smoke and fire detection — engineered as one integrated safety system for homes and businesses across India.',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=80',
    title: 'Smart alarms, safeguarding your safety',
    text: 'From gas and carbon monoxide detection to composite alarms — a full catalogue of certified life-safety devices in one place.',
  },
  {
    image: 'https://images.unsplash.com/photo-1558002038-bb0237f4e204?auto=format&fit=crop&w=1800&q=80',
    title: 'Wireless, intelligent, always connected',
    text: 'App-controlled sensors and doorbells that keep you informed the moment something needs your attention.',
  },
]

const testimonials = [
  { name: 'Rajesh Sharma', role: 'Mall Owner, Delhi', text: 'Akyoto transformed our mall security completely. Professional installation, premium products, zero issues in 2 years.', rating: 5 },
  { name: 'Priya Nair', role: 'HR Manager, Bengaluru', text: 'The access control system has streamlined our office entry entirely. ROI was visible within months.', rating: 5 },
  { name: 'Suresh Mehta', role: 'Homeowner, Mumbai', text: 'Excellent smart lock installation. The app is intuitive and the support team was incredibly helpful.', rating: 5 },
]

const whyUs = [
  { icon: Award, title: 'Premium Brands', desc: 'Hikvision, Dahua, ZKTeco, Honeywell, Samsung and more — only verified brands.' },
  { icon: Wrench, title: 'Expert Installation', desc: 'Certified technicians ensure your system is installed and configured correctly.' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast delivery to all major cities with real-time tracking and careful handling.' },
  { icon: Phone, title: '24/7 Support', desc: 'Round-the-clock technical support, on-site service within 4 hours in metro areas.' },
]

// Deep-dive content for the category spotlight section — why each category
// matters, where it's typically used, and the case for considering it.
const categorySpotlights: Record<string, { why: string; uses: string[] }> = {
  'security-alarm-system': {
    why: 'The first line of defence against break-ins. A monitored alarm system deters intruders before they get in, and alerts you and your security team the moment a door, window, or motion zone is breached.',
    uses: ['Homes and apartments left unattended for long hours', 'Retail stores and showrooms after closing time', 'Offices, warehouses and factory perimeters'],
  },
  'gas-alarm': {
    why: 'LPG and piped gas leaks are silent until they aren\u2019t. A gas alarm detects a leak within seconds of it starting, giving you time to ventilate and shut off supply before it becomes a fire or explosion risk.',
    uses: ['Residential and commercial kitchens', 'Restaurants and hostel mess kitchens', 'Industrial units storing or piping LPG/PNG'],
  },
  'carbon-monoxide-alarm': {
    why: 'Carbon monoxide has no smell, colour or taste — by the time you notice symptoms, exposure is often already dangerous. A CO alarm is the only reliable way to catch it early.',
    uses: ['Homes with gas heaters, geysers or generators', 'Basements and enclosed parking areas', 'Hotels and guesthouses with in-room heating'],
  },
  'smoke-alarm': {
    why: 'Fire spreads fast, but smoke travels faster. A smoke alarm buys you the critical extra minutes needed to evacuate safely and call for help before flames take hold.',
    uses: ['Bedrooms, hallways and staircases', 'Commercial buildings and office floors', 'Server rooms and electrical panel areas'],
  },
  'composite-alarm': {
    why: 'One device, multiple hazards. Composite alarms combine smoke, heat and sometimes gas sensing in a single unit — simpler to install and maintain than running separate systems for each risk.',
    uses: ['Smaller homes and apartments wanting full coverage', 'Rental properties needing quick, low-cost compliance', 'Utility rooms with mixed fire and gas risk'],
  },
  'audible-and-visual-alarm': {
    why: 'An alert only works if someone notices it. Sirens and strobes make sure an alarm is impossible to miss — even in a noisy factory floor or for someone who is hearing-impaired.',
    uses: ['Warehouses and manufacturing floors', 'Buildings with hearing-impaired occupants', 'Outdoor perimeters where visible deterrence matters'],
  },
  'wireless-intelligent-doorbell': {
    why: 'See and speak to whoever is at your door from anywhere, before you open it. It\u2019s one of the simplest upgrades for both everyday convenience and deterring porch theft or unwanted visitors.',
    uses: ['Homes wanting to screen visitors remotely', 'Gated communities and independent houses', 'Small offices and clinics with walk-in visitors'],
  },
  'door-magnet-sensor': {
    why: 'The most fundamental building block of any alarm system — a magnetic contact instantly knows the moment a door or window is opened, whether you\u2019re home, at work, or away.',
    uses: ['Entry doors, windows and balcony access points', 'Cabinets and drawers storing valuables', 'Server racks and restricted-access cupboards'],
  },
  'intelligent-single-product': {
    why: 'Not every device fits a single category — access control, networking gear and standalone smart devices still need to work together. This is where they come in, tying the rest of your system into one ecosystem.',
    uses: ['Biometric and RFID access control at entry points', 'Networking hardware for connected security systems', 'Standalone smart devices for specific site needs'],
  },
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [showcaseIndex, setShowcaseIndex] = useState(0)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(9)
      if (error) throw error
      setFeaturedProducts(data || [])
    } catch {
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-sans bg-white">

      {/* ═══════════════════════════════════════════
          HERO — working slider: auto-advances, dots + arrows
          (matches pgstgroup.com's home banner)
      ═══════════════════════════════════════════ */}
      <section className="relative h-[560px] md:h-[640px] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroSlides[slide].image}')` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/45 to-slate-900/10" />

        <div className="container mx-auto px-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                {heroSlides[slide].title}
              </h1>
              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                {heroSlides[slide].text}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <button className="btn-primary">Learn More</button>
                </Link>
                <Link href="/contact">
                  <button className="bg-white/10 border border-white/40 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-white/20 transition-colors text-sm backdrop-blur-sm">
                    Get a Consultation
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / next arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Clickable dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORY ICON ROW — circular icons over label
          (matches PGST's "Our Products" icon strip)
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">Everything you need to secure a home or business, in one catalogue.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-blue-100 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors shadow-sm">
                      <Icon size={26} className="text-blue-600" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-slate-700 text-center leading-tight">{cat.name}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT SHOWCASE — big preview + thumbnail grid selector
          (matches PGST's PG-107 / PG-108 / PG-A04 model picker)
      ═══════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14 max-w-xl mx-auto">
              <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 block">Explore</span>
              <h2 className="section-title mb-0">Pick a model to explore</h2>
            </div>

            {(() => {
              const showcaseProducts = featuredProducts.slice(0, 6)
              const activeIndex = Math.min(showcaseIndex, showcaseProducts.length - 1)
              return (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-stretch">
                  {/* Big preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 flex flex-col h-full">
                    <div className="relative flex-1 min-h-[280px] flex items-center justify-center mb-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showcaseProducts[activeIndex]?.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          {showcaseProducts[activeIndex]?.image_url ? (
                            <img
                              src={showcaseProducts[activeIndex].image_url}
                              alt={showcaseProducts[activeIndex].name}
                              className="max-h-64 object-contain"
                            />
                          ) : (
                            <div className="w-40 h-40 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                              <Bell size={48} strokeWidth={1} className="text-slate-300" />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{showcaseProducts[activeIndex]?.name}</h3>
                    <p className="text-slate-500 text-sm mb-5 line-clamp-2">{showcaseProducts[activeIndex]?.description}</p>
                    <Link href={`/product/${showcaseProducts[activeIndex]?.slug}`}>
                      <button className="btn-primary">Learn More</button>
                    </Link>
                  </div>

                  {/* Thumbnail grid — 2 columns x 3 rows, stretched to fill the same height/width as the preview panel */}
                  <div className="grid grid-cols-2 grid-rows-3 gap-4 h-full">
                    {showcaseProducts.map((product, i) => (
                      <button
                        key={product.id}
                        onMouseEnter={() => setShowcaseIndex(i)}
                        onClick={() => setShowcaseIndex(i)}
                        className={`w-full h-full bg-white border rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all text-center ${
                          i === activeIndex ? 'border-blue-500 shadow-md shadow-blue-100' : 'border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-16 object-contain" />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-slate-50 flex items-center justify-center">
                            <Bell size={22} strokeWidth={1.5} className="text-slate-300" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-slate-600 line-clamp-1">{product.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS — soft lavender tint (on-theme, not stark white)
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-primary-100">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 block">Shop</span>
              <h2 className="section-title mb-0">Featured Products</h2>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="h-56 bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                    <div className="h-5 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 font-medium">No products added yet. Add products from the admin panel to feature them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY US — light blue-tinted band, icon + text
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-blue-50/60">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 block">Why Akyoto</span>
            <h2 className="section-title mb-0">Built on trust and precision</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {whyUs.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-5 mx-auto shadow-sm">
                    <Icon size={22} className="text-blue-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORY SPOTLIGHT — deep dive per category:
          why it matters + where it's used, alternating layout
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 block">Know Your Options</span>
            <h2 className="section-title mb-4">Every category, and why it matters</h2>
            <p className="section-subtitle">A closer look at what each category covers, where it's typically used, and why it's worth considering for your property.</p>
          </div>

          <div className="space-y-16">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              const spotlight = categorySpotlights[cat.slug]
              if (!spotlight) return null
              const reversed = i % 2 === 1
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i !== categories.length - 1 ? 'pb-16 border-b border-slate-100' : ''}`}
                >
                  {/* Icon panel */}
                  <div className={`${reversed ? 'lg:order-2' : ''}`}>
                    <div className="bg-primary-50/60 border border-primary-100 rounded-2xl p-12 flex items-center justify-center h-full min-h-[240px]">
                      <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Icon size={40} className="text-blue-600" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Text panel */}
                  <div className={`${reversed ? 'lg:order-1' : ''}`}>
                    <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-2 block">
                      Category {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{cat.name}</h3>
                    <p className="text-slate-600 leading-relaxed mb-5">{spotlight.why}</p>

                    <p className="text-sm font-semibold text-slate-800 mb-3">Commonly used in:</p>
                    <ul className="space-y-2 mb-6">
                      {spotlight.uses.map((use) => (
                        <li key={use} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      Shop {cat.name} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — plain white cards
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 block">Testimonials</span>
            <h2 className="section-title mb-0">Trusted by thousands</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="border border-slate-100 rounded-xl p-8 h-full flex flex-col hover:shadow-lg hover:shadow-blue-100/50 transition-shadow"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 flex-1 text-sm">{t.text}</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — solid blue band (PGST's "Learn More" style)
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
            Ready to secure your space?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Get a free security audit and customised solution proposal for your home or business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-white text-blue-700 font-semibold py-3.5 px-9 rounded-full hover:bg-blue-50 transition-colors text-sm">
                Get Free Consultation
              </button>
            </Link>
            <Link href="/shop">
              <button className="border border-white/50 text-white font-semibold py-3.5 px-9 rounded-full hover:bg-white/10 transition-colors text-sm">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
