'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

type Blog = Database['public']['Tables']['blog']['Row']

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .eq('slug', params.slug)
          .single()

        if (error) throw error
        setBlog(data)
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.slug])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Post Not Found</h2>
              <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
              <Link href="/blog">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Blog Post */}
          <Card className="overflow-hidden">
            {blog.cover_image && (
              <div className="aspect-video relative">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl md:text-4xl mb-4">{blog.title}</CardTitle>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
          </Card>

          {/* Related Posts or Call to Action */}
          <div className="mt-16">
            <Card className="bg-bio-accent">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-bio-text mb-4">
                  Enjoyed This Post?
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay updated with my latest thoughts on biomedical technology and healthcare innovation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/blog">
                    <Button variant="outline">
                      Read More Posts
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="bg-bio-primary hover:bg-bio-primary/90">
                      Get In Touch
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
