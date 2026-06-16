'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
          if (error) throw error
          setPost(data)
        } catch { console.log('Post not found') }
        finally { setLoading(false) }
      }
      fetchPost()
    }
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>

  if (!post) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Post not found</h2>
        <Link href="/blog"><button className="btn-primary">Back to Blog</button></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-950 to-primary-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 relative max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary-300 hover:text-white font-medium text-sm mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center text-primary-300 text-sm mb-4 gap-6">
              <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><User size={14} />{post.author || 'Akyoto Team'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>{post.title}</h1>
            {post.excerpt && <p className="text-primary-200 text-lg leading-relaxed">{post.excerpt}</p>}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
            <motion.article
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12"
            >
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary-600 prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.article>

            <aside className="lg:col-span-1 space-y-5">
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white sticky top-28">
                <Shield size={28} className="text-primary-300 mb-3" />
                <h3 className="font-bold mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>Need Expert Advice?</h3>
                <p className="text-primary-200 text-sm mb-4 leading-relaxed">Our security consultants are ready to help you choose the right solution.</p>
                <Link href="/contact">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                    Contact Us
                  </button>
                </Link>
              </div>
              <div className="text-center">
                <Link href="/blog">
                  <button className="btn-outline py-2.5 px-5 text-sm">All Articles</button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}