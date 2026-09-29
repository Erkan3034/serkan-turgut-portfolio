import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serkanturgut.com'

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Serkan Turgut | Biyomedikal Cihaz Teknikeri - Medikal Servis & Kalibrasyon',
    template: '%s | Serkan Turgut - Biyomedikal Cihaz Teknikeri',
  },
  description: 'Biyomedikal Cihaz Teknikeri Serkan Turgut. Mekanik ventilatör sistemleri (Biyovent vb.), EKG, hasta başı monitörleri, medikal kalibrasyon, koruyucu bakım ve hastane klinik mühendislik teknik servis hizmetleri.',
  keywords: [
    'Serkan Turgut',
    'Biyomedikal Cihaz Teknikeri',
    'Biyomedikal Teknikeri',
    'Biyomedikal Mühendislik',
    'Mekanik Ventilatör Servisi',
    'Biyovent Ventilatör Bakımı',
    'Tıbbi Cihaz Kalibrasyonu',
    'Medikal Cihaz Tamiri',
    'EKG Cihazı Kalibrasyonu',
    'Hasta Başı Monitör Bakımı',
    'Hastane Biyomedikal Servisi',
    'Klinik Mühendislik',
    'İstanbul Biyomedikal Cihaz Servisi',
    'Biyomedikal Teknik Servis',
    'Tıbbi Cihaz Arıza Tespiti',
    'Elektriksel Güvenlik Testleri Medikal'
  ],
  authors: [{ name: 'Serkan Turgut', url: siteUrl }],
  creator: 'Serkan Turgut',
  publisher: 'Serkan Turgut',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: '80d55b9dc9e0283b',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Serkan Turgut | Biyomedikal Cihaz Teknikeri & Kalibrasyon Uzmanı',
    description: 'Biyomedikal cihaz bakımı, ventilatör onarımı ve medikal kalibrasyon süreçlerinde güvenilir teknik servis portfolyosu.',
    url: siteUrl,
    siteName: 'Serkan Turgut Portfolyo',
    locale: 'tr_TR',
    type: 'profile',
    firstName: 'Serkan',
    lastName: 'Turgut',
    gender: 'male',
    images: [
      {
        url: '/images/profile.png',
        width: 800,
        height: 800,
        alt: 'Serkan Turgut - Biyomedikal Cihaz Teknikeri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serkan Turgut | Biyomedikal Cihaz Teknikeri',
    description: 'Biyomedikal cihaz bakımı, ventilatör ve medikal kalibrasyon uzmanı.',
    images: ['/images/profile.png'],
    creator: '@serkanturgut',
  },
  icons: {
    icon: [
      { url: '/images/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/images/favicons/favicon.ico',
    apple: [
      { url: '/images/favicons/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Structured Schema for Google Rich Snippets
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Serkan Turgut',
    jobTitle: 'Biyomedikal Cihaz Teknikeri',
    url: siteUrl,
    image: `${siteUrl}/images/profile.png`,
    sameAs: [
      'https://www.linkedin.com/in/serkan-turgut-9668b9237/',
      'https://github.com/Erkan3034',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'İstanbul Gedik Üniversitesi',
    },
    knowsAbout: [
      'Biyomedikal Cihaz Teknolojisi',
      'Mekanik Ventilatörler',
      'Biyovent Sistemleri',
      'Elektrokardiyografi (EKG)',
      'Hasta Başı Monitörleri',
      'Medikal Kalibrasyon Standartları',
      'Klinik Mühendislik',
      'Tıbbi Cihaz Arıza Analizi & Bakım-Onarım'
    ],
    description: 'Biyomedikal cihazların bakım, onarım, kalibrasyon ve klinik teknik servis süreçlerinde uzmanlaşmış Biyomedikal Cihaz Teknikeri.',
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Serkan Turgut Portfolyo',
    url: siteUrl,
    description: 'Serkan Turgut - Biyomedikal Cihaz Teknikeri Resmi Portfolyo ve Blog Sitesi',
    inLanguage: 'tr-TR',
    author: {
      '@type': 'Person',
      name: 'Serkan Turgut',
    },
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Serkan Turgut - Biyomedikal Teknik Servis & Danışmanlık',
    image: `${siteUrl}/images/profile.png`,
    url: siteUrl,
    telephone: '+905511794711',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    areaServed: 'Türkiye',
    serviceType: [
      'Biyomedikal Cihaz Bakımı',
      'Mekanik Ventilatör Kalibrasyonu',
      'EKG Cihazı Teknik Servisi',
      'Tıbbi Cihaz Koruyucu Bakım ve Arıza Tespiti'
    ],
  }

  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
