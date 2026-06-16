'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Award, Users, CheckCircle, Camera, Lock, Bell } from 'lucide-react'

const values = [
  { icon: Shield, title: 'Security First', desc: 'Every product we sell is vetted for reliability and professional-grade performance.' },
  { icon: Target, title: 'Precision Solutions', desc: 'We tailor every security system to the exact needs of each client.' },
  { icon: Award, title: 'Certified Excellence', desc: 'ISO 9001:2015 certified with BIS approved product lines throughout.' },
  { icon: Users, title: 'Client-Centric', desc: 'From SMEs to enterprises — we serve every client with equal dedication.' },
]

const milestones = [
  { year: '2010', event: 'Founded in New Delhi as a CCTV installation company' },
  { year: '2013', event: 'Expanded to access control and alarm systems' },
  { year: '2016', event: 'Achieved ISO 9001:2015 certification' },
  { year: '2019', event: 'Launched pan-India operations with 20+ service centers' },
  { year: '2022', event: 'Crossed 10,000 successful installations' },
  { year: '2024', event: 'Launched e-commerce platform for direct product sales' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 to-primary-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-primary-300 text-xs font-bold tracking-widest uppercase bg-primary-800/60 border border-primary-600/40 px-4 py-2 rounded-full mb-5">
              Our Story
            </span>
            <h1 className="text-5xl font-extrabold text-white mb-5" style={{fontFamily:'Rajdhani,sans-serif'}}>
              About Akyoto Secure
            </h1>
            <p className="text-primary-200 text-lg max-w-2xl mx-auto leading-relaxed">
              For 14 years, we've been India's trusted partner in physical security — protecting homes, businesses, and critical infrastructure with professional-grade solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-slate-50 bg-grid">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600 text-xs font-bold tracking-widest uppercase">Who We Are</span>
              <h2 className="text-4xl font-extrabold mt-2 mb-6 leading-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>
                India's Trusted Security Integrator
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5">
                Akyoto Secure Systems is a New Delhi-based security solutions provider with over 14 years of field experience. We specialize in designing, supplying, and installing comprehensive physical security systems for residential, commercial, and industrial clients.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                Our team of certified engineers and security consultants works with India's most reputed brands — Hikvision, Dahua, ZKTeco, Honeywell, Samsung, and more — to deliver solutions that meet each client's unique requirements.
              </p>
              <p className="text-slate-600 leading-relaxed">
                From a single smart lock installation to a 200-camera enterprise deployment, we bring the same dedication, expertise, and attention to detail to every project.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                {['15,000+ Installations', '500+ Enterprise Clients', '20+ Service Centers', '24/7 Support'].map(item => (
                  <span key={item} className="flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full border border-primary-100">
                    <CheckCircle size={14} className="text-primary-600" /> {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20 rounded-3xl"></div>
                <div className="relative">
                  <Shield size={48} className="text-primary-300 mb-6" />
                  <h3 className="text-2xl font-bold mb-4" style={{fontFamily:'Rajdhani,sans-serif'}}>Our Mission</h3>
                  <p className="text-primary-200 leading-relaxed mb-6">
                    To make professional-grade security accessible to every home and business in India — through superior products, expert installation, and unwavering support.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[Camera, Lock, Bell, Users].map((Icon, i) => (
                      <div key={i} className="bg-primary-800/60 rounded-xl p-4 border border-primary-700/40">
                        <Icon size={22} className="text-primary-300 mb-2" />
                        <p className="text-xs text-primary-200 font-medium">
                          {['CCTV Systems', 'Smart Locks', 'Alarm Systems', 'Access Control'][i]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-xs font-bold tracking-widest uppercase">What Drives Us</span>
            <h2 className="section-title mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-5 shadow-md">
                  <v.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2" style={{fontFamily:'Rajdhani,sans-serif'}}>{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <span className="text-primary-600 text-xs font-bold tracking-widest uppercase">Our Journey</span>
            <h2 className="section-title mt-2">14 Years of Excellence</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-primary-100"></div>
            <div className="space-y-8">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-6"
                  >
                    {/* Left slot */}
                    <div className="flex-1 flex justify-end">
                      {isLeft ? (
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm w-full">
                          <p className="text-sm font-bold text-primary-700 mb-1" style={{fontFamily:'Rajdhani,sans-serif'}}>{m.year}</p>
                          <p className="text-sm text-slate-600">{m.event}</p>
                        </div>
                      ) : <div />}
                    </div>

                    {/* Centre dot */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center z-10 flex-shrink-0 shadow-md">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>

                    {/* Right slot */}
                    <div className="flex-1">
                      {!isLeft ? (
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm w-full">
                          <p className="text-sm font-bold text-primary-700 mb-1" style={{fontFamily:'Rajdhani,sans-serif'}}>{m.year}</p>
                          <p className="text-sm text-slate-600">{m.event}</p>
                        </div>
                      ) : <div />}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}