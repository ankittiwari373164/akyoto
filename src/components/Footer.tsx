import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Shield, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight" style={{fontFamily:'Rajdhani,sans-serif'}}>AKYOTO</span>
                <span className="block text-[10px] font-semibold text-primary-400 tracking-[0.15em] uppercase -mt-1">Secure Systems</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's trusted provider of professional-grade physical security solutions. Protecting homes, businesses, and institutions since 2010.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-primary-900 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white" style={{fontFamily:'Rajdhani,sans-serif'}}>Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Security Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/track-order', label: 'Track Order' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-primary-400 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white" style={{fontFamily:'Rajdhani,sans-serif'}}>Categories</h3>
            <ul className="space-y-3">
              {[
                'CCTV / Cameras',
                'Smart Locks',
                'Alarm Systems',
                'Access Control',
                'Fire Safety',
                'Network Security',
              ].map(cat => (
                <li key={cat}>
                  <Link href={`/shop?category=${encodeURIComponent(cat)}`} className="text-slate-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-600 rounded-full group-hover:bg-primary-400 transition-colors"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-5 text-white" style={{fontFamily:'Rajdhani,sans-serif'}}>Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@akyotosecure.com" className="text-slate-400 hover:text-primary-400 text-sm transition-colors">
                  info@akyotosecure.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+91 123 456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  123, Security Plaza<br />
                  Connaught Place<br />
                  New Delhi, 110001
                </span>
              </li>
            </ul>
            <div className="mt-5 p-4 bg-primary-900/50 rounded-xl border border-primary-800">
              <p className="text-xs text-primary-300 font-semibold mb-1">Business Hours</p>
              <p className="text-xs text-slate-400">Mon–Sat: 9AM – 7PM</p>
              <p className="text-xs text-slate-400">Sun: 10AM – 4PM</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-primary-900 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            {['ISO 9001:2015 Certified', 'BIS Approved Products', 'NSIC Registered', 'Make in India Partner'].map(cert => (
              <span key={cert} className="flex items-center gap-1.5">
                <Shield size={12} className="text-primary-500" />
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-primary-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Akyoto Secure Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link href="/returns" className="hover:text-primary-400 transition-colors">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}