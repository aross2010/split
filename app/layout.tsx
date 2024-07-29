import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import AuthProvider from './context/AuthContext'
import ToastContext from './context/ToastContext'
import Navbar from './components/navbar'
import Footer from './components/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Split',
  description:
    'Split is a minimalistic workout tracker to help you stay on track with your fitness goals.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} w-full flex flex-col items-center min-h-[120vh] bg-gray-950 text-gray-50 px-3 scroll-smooth`}
      >
        <AuthProvider>
          <ToastContext />
          <Navbar />
          <main className="w-full max-w-[1200px] mt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
