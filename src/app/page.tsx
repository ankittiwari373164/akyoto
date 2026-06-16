'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Shield, Camera, Lock, Bell, Fingerprint, Flame, Wifi,
  ChevronRight, Star, CheckCircle, Phone, ArrowRight,
  Truck, Wrench, Award, Users, Clock, Play, ChevronDown
} from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const categories = [
  { name: 'CCTV', label: 'CCTV / Cameras', icon: Camera, desc: 'HD & 4K surveillance cameras for indoor/outdoor', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', accent: 'text-blue-600' },
  { name: 'Access Control', label: 'Access Control', icon: Fingerprint, desc: 'Time-attendance & entry management systems', color: 'from-cyan-500 to-cyan-700', bg: 'bg-cyan-50', accent: 'text-cyan-600' },
  { name: 'Alarm System', label: 'Alarm Systems', icon: Bell, desc: 'Intrusion detection & alert systems', color: 'from-sky-500 to-sky-700', bg: 'bg-sky-50', accent: 'text-sky-600' },
  { name: 'Fire Alarm System', label: 'Fire Alarm System', icon: Flame, desc: 'Smoke detectors, extinguishers & suppressants', color: 'from-orange-500 to-red-600', bg: 'bg-orange-50', accent: 'text-orange-600' },
  { name: 'Networking', label: 'Networking', icon: Wifi, desc: 'Secure routers, NVRs & network infrastructure', color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', accent: 'text-violet-600' },
  { name: 'Wireless Sensors', label: 'Wireless Sensors', icon: Shield, desc: 'Motion, door & window wireless sensors', color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50', accent: 'text-indigo-600' },
]

const stats = [
  { value: '15,000+', label: 'Installations', icon: CheckCircle, color: 'text-blue-600' },
  { value: '500+', label: 'Enterprise Clients', icon: Users, color: 'text-indigo-600' },
  { value: '14 Years', label: 'In Industry', icon: Award, color: 'text-sky-600' },
  { value: '24/7', label: 'Support Available', icon: Clock, color: 'text-cyan-600' },
]

const testimonials = [
  { name: 'Rajesh Sharma', role: 'Mall Owner, Delhi', text: 'Akyoto transformed our mall security completely. Professional installation, premium products, zero issues in 2 years.', rating: 5, initial: 'R' },
  { name: 'Priya Nair', role: 'HR Manager, Bengaluru', text: 'The access control system has streamlined our office entry entirely. ROI was visible within months.', rating: 5, initial: 'P' },
  { name: 'Suresh Mehta', role: 'Homeowner, Mumbai', text: 'Excellent smart lock installation. The app is intuitive and the support team was incredibly helpful.', rating: 5, initial: 'S' },
]

const whyUs = [
  { icon: Award, title: 'Premium Brands', desc: 'Hikvision, Dahua, ZKTeco, Honeywell, Samsung and more — only verified brands.', gradient: 'from-blue-600 to-blue-800' },
  { icon: Wrench, title: 'Expert Installation', desc: 'Certified technicians ensure your system is installed and configured correctly.', gradient: 'from-indigo-600 to-indigo-800' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast delivery to all major cities with real-time tracking and careful handling.', gradient: 'from-sky-600 to-sky-800' },
  { icon: Phone, title: '24/7 Support', desc: 'Round-the-clock technical support, on-site service within 4 hours in metro areas.', gradient: 'from-cyan-600 to-cyan-800' },
]

// Counter animation hook
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView && startOnView) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration, startOnView])

  return { count, ref }
}

// Floating particle
function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-blue-400/20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// Animated number stat
function AnimatedStat({ value, label, icon: Icon, color }: { value: string; label: string; icon: any; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center group"
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 ${color.replace('text-', 'from-').replace('-600', '-100')} to-white border border-slate-100`}>
        <Icon className={`${color}`} size={26} />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black text-slate-900 mb-1 tracking-tight"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    fetchFeaturedProducts()
    // Auto-cycle categories
    const timer = setInterval(() => setActiveCategory(p => (p + 1) % categories.length), 3000)
    return () => clearInterval(timer)
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      if (error) throw error
      setFeaturedProducts(data || [])
    } catch {
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const sampleProducts: Product[] = [
    { id: '1', name: 'ProVision 4K PTZ Camera', slug: 'provision-4k-ptz', description: 'Auto-tracking 4K PTZ camera with 30x optical zoom, IR night vision up to 100m, IP67 rated.', price: 18500, image_url: '', category: 'CCTV', stock: 25, sku: 'CAM-001', weight: '1.2kg', brand: 'Hikvision', warranty: '2 Year', features: [], created_at: '', updated_at: '' },
    { id: '2', name: 'BioSecure Fingerprint Lock', slug: 'biosecure-fingerprint', description: 'Stores 200 fingerprints, RFID & PIN backup. Anti-tamper alarm, 1-year battery life.', price: 8999, image_url: '', category: 'Access Control', stock: 42, sku: 'LCK-001', weight: '800g', brand: 'Samsung', warranty: '1 Year', features: [], created_at: '', updated_at: '' },
    { id: '3', name: 'Guardian 8-Zone Alarm', slug: 'guardian-8-zone', description: '8-zone wireless alarm with GSM auto-dialer, siren, and mobile app control.', price: 12500, image_url: '', category: 'Alarm System', stock: 18, sku: 'ALM-001', weight: '600g', brand: 'DSC', warranty: '2 Year', features: [], created_at: '', updated_at: '' },
    { id: '4', name: 'FlexCard Access Controller', slug: 'flexcard-access', description: 'RFID+biometric access controller for up to 10 doors, cloud-based management.', price: 22000, image_url: '', category: 'Access Control', stock: 10, sku: 'ACC-001', weight: '1.5kg', brand: 'ZKTeco', warranty: '3 Year', features: [], created_at: '', updated_at: '' },
    { id: '5', name: 'SafeGuard Smoke Detector', slug: 'safeguard-smoke', description: 'Multi-sensor photoelectric smoke & CO detector with 85dB alarm and wireless linking.', price: 3500, image_url: '', category: 'Fire Alarm System', stock: 60, sku: 'FIR-001', weight: '200g', brand: 'Honeywell', warranty: '5 Year', features: [], created_at: '', updated_at: '' },
    { id: '6', name: 'SecureNet 16-CH NVR', slug: 'securenet-16ch', description: '16-channel 4K NVR with 6TB HDD, RAID support, remote viewing on any device.', price: 35000, image_url: '', category: 'Networking', stock: 8, sku: 'NET-001', weight: '2.8kg', brand: 'Dahua', warranty: '3 Year', features: [], created_at: '', updated_at: '' },
  ]

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : sampleProducts

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.4,
    x: (i * 8.3) % 100,
    y: (i * 13.7) % 100,
    size: 6 + (i % 3) * 6,
  }))

  return (
    <div className="overflow-x-hidden font-sans">

      {/* ═══════════════════════════════════════════
          HERO SECTION — Dark navy with grid + glow
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center overflow-hidden"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Radial glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        {/* Horizontal scan line animation */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Right visual — animated shield constellation */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] hidden lg:flex items-center justify-center"
          style={{ y: heroY }}
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[420px] h-[420px] border border-blue-500/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[320px] h-[320px] border border-blue-400/15 rounded-full"
            style={{ borderStyle: 'dashed' }}
          />

          {/* Center shield */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <div className="w-48 h-48 bg-gradient-to-br from-blue-600/30 to-blue-900/50 rounded-[40px] border border-blue-400/30 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-blue-600/20">
              <Shield size={72} className="text-blue-300" strokeWidth={1.5} />
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-[40px] border-2 border-blue-400/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Orbiting feature icons */}
          {[Camera, Lock, Bell, Fingerprint, Wifi, Flame].map((Icon, i) => {
            const angle = (i * 60 * Math.PI) / 180
            const radius = 190
            return (
              <motion.div
                key={i}
                className="absolute w-14 h-14 bg-slate-800/90 border border-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-blue-900/30"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * radius}px - 28px)`,
                  top: `calc(50% + ${Math.sin(angle) * radius}px - 28px)`,
                }}
                animate={{ y: [0, -8, 0], scale: activeCategory === i ? 1.2 : 1 }}
                transition={{
                  y: { duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' },
                  scale: { duration: 0.3 }
                }}
              >
                <Icon size={22} className={activeCategory === i ? 'text-blue-300' : 'text-slate-400'} />
              </motion.div>
            )
          })}

          {/* Connecting lines to active icon */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            {[Camera, Lock, Bell, Fingerprint, Wifi, Flame].map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180
              const radius = 190
              const cx = 50 + Math.cos(angle) * radius
              const cy = 50 + Math.sin(angle) * radius
              return activeCategory === i ? (
                <motion.line
                  key={i}
                  x1="50%" y1="50%"
                  x2={`${cx}%`} y2={`${cy}%`}
                  stroke="rgba(59,130,246,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : null
            })}
          </svg>
        </motion.div>

        {/* Hero text content */}
        <motion.div
          className="container mx-auto px-6 relative z-10"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-bold px-4 py-2.5 rounded-full mb-8 backdrop-blur-sm uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              ISO 9001:2015 Certified Security Integrator
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Securing
              <br />
              India's
              <motion.span
                className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Future, Today.
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-light"
            >
              Professional-grade physical security products — from AI-powered CCTV to biometric access control. Trusted by <span className="text-blue-300 font-semibold">15,000+ installations</span> across India.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-bold text-base py-4 px-8 rounded-xl transition-colors shadow-xl shadow-blue-600/30 flex items-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Products
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-white border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all text-base backdrop-blur-sm"
                >
                  <Phone size={18} /> Get Free Consultation
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {['Free Installation', 'Pan-India Service', '24/7 Support', 'EMI Available'].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 bg-blue-500/10 border border-blue-400/20 px-3 py-1.5 rounded-full"
                >
                  <CheckCircle size={12} className="text-green-400" /> {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs uppercase tracking-widest"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════
          STATS BAR — White with bold numbers
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 relative">
        {/* Top gradient edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <AnimatedStat key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          CATEGORIES — Card grid with hover effects
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-blue-600 font-bold text-xs tracking-[0.3em] uppercase mb-4 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Our Categories</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Complete Security
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Ecosystem</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              From perimeter to interior — every layer of your security covered with professional-grade products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop?category=${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300 rounded-2xl" />

                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <cat.icon size={26} className="text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{cat.label}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-5">{cat.desc}</p>
                      <span className={`flex items-center ${cat.accent} text-sm font-bold group-hover:translate-x-1 transition-transform`}>
                        View Products <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>

                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS — Clean white grid
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-14"
          >
            <div>
              <span className="inline-block text-blue-600 font-bold text-xs tracking-[0.3em] uppercase mb-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Top Picks</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Featured<br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Products</span>
              </h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group">
              View All
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="card animate-pulse h-96 rounded-2xl overflow-hidden border border-slate-100"
                >
                  <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                    <div className="h-5 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full" />
                    <div className="h-9 bg-slate-100 rounded-xl w-1/2 mt-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
            >
              {displayProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline py-3.5 px-10 rounded-xl font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                View All Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          WHY CHOOSE US — Dark section with cards
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-blue-400 font-bold text-xs tracking-[0.3em] uppercase mb-4 bg-blue-500/10 border border-blue-400/20 px-4 py-2 rounded-full">Why Akyoto</span>
            <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Built for
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Professionals</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              We don't just sell products — we deliver complete security solutions backed by expert support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(59,130,246,0.5)' }}
                  className="group h-full bg-slate-900 border border-slate-800 rounded-2xl p-7 transition-all duration-300 relative overflow-hidden cursor-default"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/0 transition-all duration-300" />

                  <div className={`relative w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="relative font-bold text-white text-lg mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{item.title}</h3>
                  <p className="relative text-slate-400 text-sm leading-relaxed">{item.desc}</p>

                  {/* Bottom number */}
                  <div className="absolute bottom-5 right-5 text-6xl font-black text-slate-800 group-hover:text-slate-700 transition-colors select-none" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    0{i + 1}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          TESTIMONIALS — Soft white with cards
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-80 pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-blue-600 font-bold text-xs tracking-[0.3em] uppercase mb-4 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Thousands</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.12 + j * 0.07 }}
                        viewport={{ once: true }}
                      >
                        <Star size={16} className="text-amber-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-600 leading-relaxed mb-6 italic flex-1">
                    <span className="text-blue-300 text-4xl font-serif leading-none mr-1">"</span>
                    {t.text}
                    <span className="text-blue-300 text-4xl font-serif leading-none ml-1">"</span>
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          CTA BANNER — Bold dark gradient
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-14 text-center overflow-hidden"
          >
            {/* Grid bg */}
            <div className="absolute inset-0 rounded-3xl" style={{
              backgroundImage: `linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Animated rings behind shield */}
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 -m-4 border border-blue-400/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                className="absolute inset-0 -m-8 border border-blue-400/20 rounded-full"
              />
              <Shield size={52} className="relative text-blue-300 mx-auto" strokeWidth={1.5} />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-5 relative"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Ready to Secure
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"> Your Space?</span>
            </motion.h2>

            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto relative">
              Get a free security audit and customized solution proposal for your home or business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-10 rounded-xl transition-all shadow-xl text-base"
                >
                  Get Free Consultation
                </motion.button>
              </Link>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(255,255,255,0.7)' }}
                  whileTap={{ scale: 0.97 }}
                  className="border-2 border-white/30 hover:border-white/60 text-white font-bold py-4 px-10 rounded-xl transition-all text-base backdrop-blur-sm"
                >
                  Browse Products
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}