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
    icon: [
      { url: '/images/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/images/favicons/favicon.ico',
    apple: [
      { url: '/images/favicons/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/images/favicons/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/images/favicons/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/images/favicons/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/images/favicons/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/images/favicons/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/images/favicons/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/images/favicons/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/images/favicons/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/favicons/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
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
