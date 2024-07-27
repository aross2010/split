import type { Metadata } from 'next'
import { Inter, Prompt } from 'next/font/google'
import './globals.css'
import AuthProvider from './context/AuthContext'
import ToastContext from './context/ToastContext'
import Navbar from './components/navbar'
import Footer from './components/footer'

const inter = Inter({ subsets: ['latin'] })

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
        className={`${inter.className} w-full flex flex-col items-center  bg-gray-950 text-gray-50 font-medium px-3`}
      >
        <AuthProvider>
          <ToastContext />
          <Navbar />
          <main className="w-full max-w-[1200px] min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
