'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, Shield, Wrench, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success("Message sent! We'll respond within 24 hours.")
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' })
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-950 to-primary-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-primary-300 text-xs font-bold tracking-widest uppercase bg-primary-800/60 border border-primary-600/40 px-4 py-2 rounded-full mb-5">Get in Touch</span>
            <h1 className="text-5xl font-extrabold text-white mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Contact Us</h1>
            <p className="text-primary-200 text-lg max-w-xl mx-auto">Have a project in mind? Need a quote? We're here to help with all your security needs.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h2 className="text-2xl font-extrabold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>How to Reach Us</h2>
              {[
                { icon: Mail, label: 'Email', value: 'info@akyotosecure.com', sub: 'We respond within 24 hours', href: 'mailto:info@akyotosecure.com' },
                { icon: Phone, label: 'Phone', value: '+91 123 456 7890', sub: 'Mon–Sat, 9AM – 7PM', href: 'tel:+911234567890' },
                { icon: MapPin, label: 'Address', value: '123, Security Plaza, Connaught Place, New Delhi 110001', sub: 'Visit us anytime during business hours', href: '#' },
                { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9AM – 7PM', sub: 'Sun: 10AM – 4PM', href: '#' },
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-start gap-4 bg-slate-50 hover:bg-primary-50 rounded-2xl p-5 border border-slate-100 hover:border-primary-200 transition-all group">
                  <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                    <item.icon size={20} className="text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-semibold text-slate-900 text-sm">{item.value}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </a>
              ))}

              {/* Quick Services */}
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Quick Services</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, label: 'Free Security Audit', desc: 'For commercial clients' },
                    { icon: Wrench, label: 'Emergency Repair', desc: '4-hr response in metros' },
                    { icon: MessageSquare, label: 'Technical Support', desc: '24/7 via WhatsApp' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <s.icon size={16} className="text-primary-300 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{s.label}</p>
                        <p className="text-xs text-primary-300">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6" style={{fontFamily:'Rajdhani,sans-serif'}}>Send a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject *</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="input-field">
                      <option value="general">General Inquiry</option>
                      <option value="quote">Request a Quote</option>
                      <option value="installation">Installation Request</option>
                      <option value="support">Technical Support</option>
                      <option value="complaint">Complaint / Feedback</option>
                      <option value="bulk">Bulk / Enterprise Order</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="input-field resize-none" placeholder="Tell us about your security requirements, project details, or questions..." />
                  </div>
                </div>
                <div className="mt-5 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-xs text-primary-700">
                    For urgent support, call us directly at <strong>+91 123 456 7890</strong> or WhatsApp us. We typically respond to form enquiries within 24 business hours.
                  </p>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary mt-5 py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50">
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900" style={{fontFamily:'Rajdhani,sans-serif'}}>Find Us</h2>
                <p className="text-slate-500 text-sm">123, Security Plaza, Connaught Place, New Delhi 110001</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm w-full" style={{ height: '450px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.201692761016!2d77.2265771!3d28.5035789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa53f7b4f2b7f2e9%3A0x1a333b330c2787d7!2sAkyoto%20Security%20Solutions!5e0!3m2!1sen!2sin!4v1780741501063!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Akyoto Security Solutions location on Google Maps"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}