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
  description: 'Split is a workout tracker web application.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

      <body
        className={`${outfit.className} w-full flex flex-col items-center min-h-[120vh] bg-gray-950 overflow-x-hidden text-gray-100 px-3 scroll-smooth`}
      >
        <AuthProvider>
          <ToastContext />
          <Navbar />
          <main className="w-full max-w-[1200px] flex justify-center my-12">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
