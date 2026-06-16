import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Akyoto Secure | Professional Security Solutions India',
  description: 'India\'s trusted provider of professional-grade physical security products — CCTV, smart locks, alarm systems, access control, fire safety, and network security.',
  keywords: 'CCTV cameras, security systems, smart locks, alarm systems, access control, fire safety, India security products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}