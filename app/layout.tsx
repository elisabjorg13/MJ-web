import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from './components/Navbar'

// Configure body font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

// Configure custom font for headings
const monumentGrotesk = localFont({
  src: '../public/fonts/ABCMonumentGroteskMono-Regular.otf',
  display: 'swap',
  variable: '--font-monument',
})

// Configure font for logo
const abcSynt = localFont({
  src: '../public/fonts/ABCSynt-Regular.otf',
  display: 'swap',
  variable: '--font-synt',
})

export const metadata: Metadata = {
  title: 'Magnús Jóhann',
  description: 'artist, composer & producer',
  icons: {
    icon: '/images/MJ_Favicon.jpg',
    shortcut: '/images/MJ_Favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${monumentGrotesk.variable} ${abcSynt.variable}`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}

