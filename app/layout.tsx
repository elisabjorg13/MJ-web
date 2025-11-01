import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

// Configure body font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

// Configure custom font for headings
export const monumentGrotesk = localFont({
  src: '../public/fonts/ABCMonumentGroteskMono-Regular.otf',
  display: 'swap',
  variable: '--font-monument',
})

export const metadata: Metadata = {
  title: 'MJ',
  description: 'A simple white page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${monumentGrotesk.variable}`}>{children}</body>
    </html>
  )
}

