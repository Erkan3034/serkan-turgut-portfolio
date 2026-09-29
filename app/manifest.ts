import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Serkan Turgut - Biyomedikal Cihaz Teknikeri Portfolyosu',
    short_name: 'Serkan Turgut',
    description: 'Biyomedikal cihaz teknolojisi, ventilatör bakımı ve medikal kalibrasyon uzmanı Serkan Turgut profesyonel portfolyosu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/images/favicons/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/favicons/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ],
  }
}
