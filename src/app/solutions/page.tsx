import { Shield, Bell, Camera, Lock, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Shield,
      title: 'Alarm Systems',
      description: 'Wireless security alarm systems with GSM & WiFi connectivity, SMS alerts, and mobile app control.',
      features: ['GSM/WiFi Connectivity', 'Mobile App Control', 'SMS Alerts', '90dB Siren'],
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
    },
    {
      icon: Bell,
      title: 'Fire Alarm Systems',
      description: 'Complete fire detection and alarm systems with smoke sensors, manual call points, and emergency response.',
      features: ['Smoke Detection', '110dB Alarm', 'Manual Call Points', 'Backup Battery'],
      image: 'https://images.unsplash.com/photo-1614933512173-3a34c51eb7ac?w=600',
    },
    {
      icon: Camera,
      title: 'CCTV Surveillance',
      description: 'High-definition surveillance cameras with night vision, motion detection, and remote viewing.',
      features: ['HD Recording', 'Night Vision', 'Remote Access', 'Motion Detection'],
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600',
    },
    {
      icon: Lock,
      title: 'Access Control',
      description: 'Biometric and card-based access control systems for secure entry management.',
      features: ['Biometric Access', 'RFID Cards', 'Time Attendance', 'Remote Control'],
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600',
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'Integrate security with home automation for lights, locks, and climate control.',
      features: ['Voice Control', 'Scheduling', 'Scene Creation', 'Mobile App'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    },
    {
      icon: Users,
      title: 'Guard Monitoring',
      description: 'Advanced guard patrol management systems with RFID tracking and real-time reporting.',
      features: ['RFID Tracking', 'Live Monitoring', 'Route Planning', 'Performance Reports'],
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Security Solutions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Comprehensive security systems for homes, offices, and commercial properties
          </p>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                    <solution.icon className="text-primary-600" size={32} />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">{solution.title}</h2>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/shop">
                    <button className="btn-primary">
                      View Products
                    </button>
                  </Link>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl h-96 flex items-center justify-center">
                    <solution.icon size={150} className="text-primary-600 opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Need a Custom Solution?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our security experts will design a customized system based on your specific requirements
          </p>
          <Link href="/contact">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Request Consultation
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}