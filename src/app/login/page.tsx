'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password })
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email, password: formData.password,
          options: { data: { full_name: formData.fullName } }
        })
        if (error) throw error
        if (data.user) {
          await supabase.from('user_profiles').insert({ id: data.user.id, full_name: formData.fullName })
        }
        toast.success('Account created successfully!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-dark-800 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl"></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield size={26} className="text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>AKYOTO</span>
              <span className="block text-[10px] font-semibold text-primary-400 tracking-[0.15em] uppercase -mt-1">Secure Systems</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-primary-300 text-sm">
            {isLogin ? 'Sign in to manage your orders' : 'Join thousands of secured homes & businesses'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-primary-900/60 border border-primary-700/40 rounded-xl p-1 mb-6 backdrop-blur-sm">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-300 hover:text-white'}`} style={{fontFamily:'Rajdhani,sans-serif'}}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-300 hover:text-white'}`} style={{fontFamily:'Rajdhani,sans-serif'}}>
            Register
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-primary-200 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required={!isLogin} placeholder="Your full name" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-primary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all text-sm" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-primary-200 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-primary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-primary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-primary-300 hover:text-white transition-colors">Forgot password?</a>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-900/50 flex items-center justify-center gap-2 disabled:opacity-50 mt-2" style={{fontFamily:'Rajdhani,sans-serif'}}>
              {loading ? 'Please wait...' : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-primary-400 mt-5">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}