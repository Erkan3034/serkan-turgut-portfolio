import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Serkan Turgut - Biyomedikal Cihaz Teknolojisi Mezunu',
  description: 'Biyomedikal cihaz teknolojisi alanındaki eğitim, projeler ve deneyimleri sergileyen portfolyo web sitesi.',
  keywords: 'biyomedikal, cihaz teknolojisi, portfolyo, mezun, mühendislik',
  authors: [{ name: 'Serkan Turgut' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Serkan Turgut - Biyomedikal Cihaz Teknolojisi Mezunu',
    description: 'Biyomedikal cihaz teknolojisi alanındaki eğitim, projeler ve deneyimleri sergileyen portfolyo web sitesi.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
