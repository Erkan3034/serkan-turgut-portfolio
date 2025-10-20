import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Serkan Turgut - Biomedical Device Technology Graduate',
  description: 'Portfolio website showcasing education, projects, and experience in biomedical device technology.',
  keywords: 'biomedical, device technology, portfolio, graduate, engineering',
  authors: [{ name: 'Serkan Turgut' }],
  openGraph: {
    title: 'Serkan Turgut - Biomedical Device Technology Graduate',
    description: 'Portfolio website showcasing education, projects, and experience in biomedical device technology.',
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
