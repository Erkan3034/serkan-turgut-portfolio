/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
let supabaseHost = ''
try {
  if (supabaseUrl) supabaseHost = new URL(supabaseUrl).hostname
} catch {}

const nextConfig = {
  // Enable static export only when explicitly requested (e.g., for production builds)
  ...(isStaticExport ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    domains: [
      ...(supabaseHost ? [supabaseHost] : []),
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
