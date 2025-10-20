'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

type Blog = Database['public']['Tables']['blog']['Row']

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setBlogs(data || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600">
              Biyomedikal teknoloji ve sağlık inovasyonu üzerine paylaşımlar
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {blogs.length > 0 ? (
            <div className="space-y-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blog.cover_image && (
                      <div className="md:col-span-1">
                        <div className="aspect-video relative">
                          <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`${blog.cover_image ? 'md:col-span-2' : 'md:col-span-3'} p-6`}>
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-2xl mb-2">
                          <Link 
                            href={`/blog/${blog.slug}`}
                            className="hover:text-bio-primary transition-colors"
                          >
                            {blog.title}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{Math.ceil(blog.content.split(' ').length / 200)} dk okuma</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
                        </p>
                        <Link 
                          href={`/blog/${blog.slug}`}
                          className="text-bio-primary hover:text-bio-primary/80 font-medium"
                        >
                          Devamını Oku →
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Blog Yazısı Bulunamadı
                </h3>
                <p className="text-gray-500">
                  Admin panelinden yayınlandığında blog yazıları burada görüntülenecektir.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
