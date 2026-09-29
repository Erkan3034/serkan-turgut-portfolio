'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, BookOpen, Activity, Sparkles } from 'lucide-react'
import { supabase, safeQuery } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { FALLBACK_BLOGS } from '@/lib/fallback-data'
import Image from 'next/image'
import Link from 'next/link'

type Blog = Database['public']['Tables']['blog']['Row']

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>(FALLBACK_BLOGS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data } = await safeQuery(
          supabase.from('blog').select('*').order('created_at', { ascending: false }),
          { data: [], error: null },
          1500
        )
        if (data && data.length > 0) {
          setBlogs(data)
        } else {
          setBlogs(FALLBACK_BLOGS)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setBlogs(FALLBACK_BLOGS)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bio-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bio-primary/10 text-bio-primary text-xs md:text-sm font-semibold mb-4 border border-bio-primary/20">
              <Activity className="h-4 w-4" />
              <span>Teknik & Klinik Makaleler</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Biyomedikal Teknoloji Blogu
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Yoğun bakım ventilatörleri, kalibrasyon standartları, defibrilatör sistemleri ve klinik enstrümantasyon üzerine teknik rehberler.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-bio-primary to-bio-secondary rounded-full mx-auto mt-6"></div>
          </div>

          {/* BLOG GRID */}
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => {
                const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length
                const readTime = Math.max(1, Math.ceil(wordCount / 180))

                return (
                  <Card 
                    key={blog.id || idx} 
                    className="group flex flex-col justify-between overflow-hidden bg-white border border-slate-200/80 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div>
                      {/* Optional Cover Image */}
                      {blog.cover_image && (
                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                          <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Meta Tags */}
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-bio-primary" />
                            <span>
                              {new Date(blog.created_at).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-bio-primary" />
                            <span>{readTime} dk okuma</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-bio-primary transition-colors line-clamp-2">
                          <Link href={`/blog/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA Link */}
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Teknik Kılavuz</span>
                      <Link 
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-sm font-bold text-bio-primary hover:text-bio-primary/80 transition-colors group/link"
                      >
                        <span>Detayları İncele</span>
                        <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="max-w-md mx-auto shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-bio-primary">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Henüz Blog Yazısı Eklenmedi
                </h3>
                <p className="text-slate-500 text-sm">
                  Admin panelinden yeni makale eklendiğinde burada görüntülenecektir.
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  )
}
