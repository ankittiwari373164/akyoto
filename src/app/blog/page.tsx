'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, User, ArrowRight, Shield, BookOpen, TrendingUp, Rss } from 'lucide-react'
import { supabase } from '@/lib/supabase'

/* ─── CSS injected once at module level — no Framer needed for repeating loops ─── */
const GLOBAL_STYLES = `
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(20800%); }
  }
  @keyframes float-y {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-12px) rotate(4deg); }
  }
  @keyframes float-y-neg {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-12px) rotate(-4deg); }
  }
  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.08); }
  }
  .scanline {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    animation: scanline linear infinite;
    top: 0;
  }
  .float-even { animation: float-y ease-in-out infinite; }
  .float-odd  { animation: float-y-neg ease-in-out infinite; }
  .pulse-icon { animation: pulse-scale ease-in-out infinite; }
`

const samplePosts = [
  { id: '1', title: '10 Signs Your CCTV System Needs Upgrading', slug: 'upgrade-cctv-system', excerpt: 'Outdated surveillance systems leave you vulnerable. Here are the warning signs and what to do about them.', author: 'Akyoto Security Team', created_at: new Date().toISOString(), category: 'CCTV' },
  { id: '2', title: 'Smart Locks vs Traditional Locks: A Complete Guide', slug: 'smart-locks-vs-traditional', excerpt: 'Is a smart lock right for your home or business? We break down the pros, cons, costs, and security trade-offs.', author: 'Akyoto Security Team', created_at: new Date(Date.now() - 86400000).toISOString(), category: 'Smart Locks' },
  { id: '3', title: 'How to Design a Layered Security System', slug: 'layered-security-design', excerpt: 'Perimeter, interior, and digital protection — how to build a truly comprehensive security setup for any facility.', author: 'Security Consultant', created_at: new Date(Date.now() - 172800000).toISOString(), category: 'Planning' },
  { id: '4', title: 'Fire Safety Compliance for Indian Businesses', slug: 'fire-safety-compliance-india', excerpt: 'NBC 2016 and local fire NOC requirements explained. Ensure your premises are fully compliant and protected.', author: 'Akyoto Security Team', created_at: new Date(Date.now() - 259200000).toISOString(), category: 'Fire Safety' },
  { id: '5', title: 'Access Control 101: Everything You Need to Know', slug: 'access-control-guide', excerpt: 'From basic RFID systems to biometric multi-factor solutions — a complete overview for business owners.', author: 'Security Consultant', created_at: new Date(Date.now() - 345600000).toISOString(), category: 'Access Control' },
  { id: '6', title: 'Top Security Mistakes Homeowners Make', slug: 'home-security-mistakes', excerpt: 'Even well-intentioned homeowners overlook these critical security gaps. Learn how to avoid them.', author: 'Akyoto Security Team', created_at: new Date(Date.now() - 432000000).toISOString(), category: 'Home Security' },
]

const categoryConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'CCTV':           { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500' },
  'Smart Locks':    { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  dot: 'bg-indigo-500' },
  'Planning':       { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  dot: 'bg-violet-500' },
  'Fire Safety':    { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  dot: 'bg-orange-500' },
  'Access Control': { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',    dot: 'bg-cyan-500' },
  'Home Security':  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
}

const heroGradients: Record<string, string> = {
  'CCTV':           'from-blue-900 to-blue-700',
  'Smart Locks':    'from-indigo-900 to-indigo-700',
  'Planning':       'from-violet-900 to-violet-700',
  'Fire Safety':    'from-orange-900 to-red-700',
  'Access Control': 'from-cyan-900 to-cyan-700',
  'Home Security':  'from-emerald-900 to-emerald-700',
}

/* Scan durations vary per card so they don't sync-blink */
const SCAN_DURATIONS = ['3.1s', '4.3s', '3.7s', '5.1s', '4.0s', '3.5s']

function ReadingTime({ text }: { text: string }) {
  const words = text.split(' ').length
  const mins = Math.max(1, Math.ceil(words / 200))
  return <span>{mins} min read</span>
}

function CardNumber({ n }: { n: number }) {
  return (
    <div
      className="absolute bottom-4 right-5 text-7xl font-black text-slate-100 select-none leading-none pointer-events-none"
      style={{ fontFamily: 'Rajdhani, sans-serif' }}
    >
      {String(n).padStart(2, '0')}
    </div>
  )
}

/* Pure CSS scan-line — no Framer motion, no re-render flicker */
function HeroImageBlock({ category, index }: { category: string; index: number }) {
  const grad = heroGradients[category] || 'from-slate-900 to-slate-700'
  const duration = SCAN_DURATIONS[index % SCAN_DURATIONS.length]
  return (
    <div className={`relative h-52 bg-gradient-to-br ${grad} overflow-hidden flex items-center justify-center`}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* CSS-only scan line — stable, no rerenders */}
      <div className="scanline" style={{ animationDuration: duration }} />

      {/* Icon — only whileHover, no looping animate */}
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative z-10">
        <Shield size={52} className="text-white/25" strokeWidth={1} />
      </motion.div>

      {/* Corner fold */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute -top-2 -right-2 w-20 h-6 bg-white/10 rotate-45 transform origin-bottom-left" />
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '20%'])

  useEffect(() => {
    /* Inject CSS once */
    if (!document.getElementById('blog-anim-styles')) {
      const tag = document.createElement('style')
      tag.id = 'blog-anim-styles'
      tag.textContent = GLOBAL_STYLES
      document.head.appendChild(tag)
    }
    const fetchPosts = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setPosts([]); setLoading(false); return }
        const { data, error } = await supabase
          .from('blog_posts').select('*').eq('published', true)
          .order('created_at', { ascending: false })
        if (error) { setPosts([]) } else { setPosts(data || []) }
      } catch { setPosts([]) }
      finally { setLoading(false) }
    }
    fetchPosts()
  }, [])

  const displayPosts = posts.length > 0 ? posts : samplePosts
  const featuredPost = displayPosts[0]
  const restPosts = displayPosts.slice(1)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative bg-slate-950 py-28 overflow-hidden">
        {/* Parallax grid — uses style prop only (no duplicate) */}
        <motion.div
          style={{
            y: heroY,
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-72 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Floating icons — CSS animation, not Framer loops */}
        {([BookOpen, TrendingUp, Rss, Shield] as const).map((Icon, i) => (
          <div
            key={i}
            className={`absolute opacity-10 pointer-events-none ${i % 2 === 0 ? 'float-even' : 'float-odd'}`}
            style={{
              left: `${15 + i * 22}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDuration: `${4 + i * 0.8}s`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <Icon size={40} className="text-blue-300" strokeWidth={1} />
          </div>
        ))}

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-blue-300 text-xs font-bold tracking-[0.25em] uppercase bg-blue-500/10 border border-blue-400/25 px-5 py-2.5 rounded-full mb-7 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Knowledge Hub
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-6xl md:text-8xl font-black text-white mb-5 leading-[0.92] tracking-tight"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Security
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Insights.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed font-light"
            >
              Expert guides, industry news, and best practices for keeping your home and business safe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-8 mt-10"
            >
              {[
                { label: 'Articles', value: `${displayPosts.length}+` },
                { label: 'Categories', value: '6' },
                { label: 'Monthly Readers', value: '5K+' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{s.value}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>


      {/* ══════════════════════════════════════
          FEATURED POST
      ══════════════════════════════════════ */}
      {!loading && featuredPost && (
        <section className="py-14 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Featured Article</span>
              <div className="h-px flex-1 bg-slate-100" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link href={`/blog/${featuredPost.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="group grid md:grid-cols-2 bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/80 hover:border-transparent transition-all duration-300"
                >
                  {/* Image side */}
                  <div className={`relative min-h-[280px] bg-gradient-to-br ${heroGradients[featuredPost.category] || 'from-slate-900 to-blue-900'} overflow-hidden`}>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                    {/* CSS-only scan on featured too */}
                    <div className="scanline" style={{ animationDuration: '4.5s' }} />
                    {/* Shield — only whileHover, no looping animate */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield size={100} className="text-white/15" strokeWidth={1} />
                    </div>
                    {featuredPost.category && (() => {
                      const cfg = categoryConfig[featuredPost.category] || { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30', dot: 'bg-white' }
                      return (
                        <div className="absolute top-5 left-5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {featuredPost.category}
                          </span>
                        </div>
                      )
                    })()}
                    <div className="absolute bottom-5 left-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Featured</span>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="p-10 flex flex-col justify-center relative">
                    <CardNumber n={1} />
                    <div className="flex items-center text-xs text-slate-400 mb-5 gap-4 relative z-10">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-blue-400" />
                        {new Date(featuredPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User size={11} className="text-blue-400" />
                        {featuredPost.author || 'Akyoto Team'}
                      </span>
                    </div>
                    <h2
                      className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight relative z-10"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-7 relative z-10">{featuredPost.excerpt}</p>
                    <span className="flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all relative z-10">
                      Read Full Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════
          POSTS GRID
      ══════════════════════════════════════ */}
      <section className="py-6 pb-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Articles</span>
            <div className="h-px flex-1 bg-slate-100" />
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-50" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-slate-100 rounded-full w-1/4" />
                    <div className="h-5 bg-slate-100 rounded-full w-5/6" />
                    <div className="h-4 bg-slate-100 rounded-full" />
                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
            >
              {restPosts.map((post, i) => {
                const cfg = categoryConfig[post.category] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' }
                return (
                  <motion.article
                    key={post.id}
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <motion.div
                        whileHover={{ y: -6 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                        className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/70 hover:border-transparent transition-shadow duration-300 h-full flex flex-col cursor-pointer"
                      >
                        {/* Image — pure CSS scan, stable */}
                        <HeroImageBlock category={post.category} index={i} />

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1 relative">
                          <CardNumber n={i + 2} />

                          <div className="flex items-center justify-between mb-4 relative z-10">
                            {post.category && (
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {post.category}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 font-medium">
                              <ReadingTime text={post.excerpt || ''} />
                            </span>
                          </div>

                          <div className="flex items-center text-xs text-slate-400 mb-3 gap-4 relative z-10">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} className="text-blue-400" />
                              {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User size={11} className="text-blue-400" />
                              {post.author || 'Akyoto Team'}
                            </span>
                          </div>

                          <h2
                            className="font-black text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug text-lg relative z-10"
                            style={{ fontFamily: 'Rajdhani, sans-serif' }}
                          >
                            {post.title}
                          </h2>

                          <p className="text-slate-500 text-sm line-clamp-2 flex-1 leading-relaxed mb-5 relative z-10">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                            <span className="flex items-center gap-1.5 text-blue-600 text-sm font-bold">
                              Read Article
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, j) => (
                                <div key={j} className={`h-1 rounded-full transition-all duration-500 ${j === 0 ? 'w-6 bg-blue-500' : 'w-2 bg-slate-200 group-hover:bg-blue-200'}`} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={`h-0.5 bg-gradient-to-r ${heroGradients[post.category] || 'from-blue-600 to-blue-800'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      </motion.div>
                    </Link>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* CSS-floating Rss icons — no Framer loops */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`absolute opacity-5 pointer-events-none ${i % 2 === 0 ? 'float-even' : 'float-odd'}`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${25 + (i % 2) * 50}%`,
              animationDuration: `${5 + i * 1.5}s`,
              animationDelay: `${i * 0.9}s`,
            }}
          >
            <Rss size={50} className="text-blue-300" strokeWidth={1} />
          </div>
        ))}

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* CSS pulsing icon */}
            <div
              className="pulse-icon w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-7"
              style={{ animationDuration: '3s' }}
            >
              <Rss size={28} className="text-blue-400" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Stay Ahead of
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"> Threats</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              Get monthly security tips and product updates delivered to your inbox.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-xl text-slate-900 outline-none text-sm bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg"
              />
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-7 rounded-xl transition-all text-sm shadow-xl shadow-blue-600/30 whitespace-nowrap"
              >
                Subscribe →
              </motion.button>
            </motion.div>

            <p className="text-slate-600 text-xs mt-5 flex items-center justify-center gap-1.5">
              <Shield size={11} className="text-slate-500" />
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}