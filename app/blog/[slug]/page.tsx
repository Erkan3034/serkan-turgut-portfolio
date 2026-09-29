import { Layout } from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Activity, 
  FileText, 
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { FALLBACK_BLOGS } from '@/lib/fallback-data'
import Image from 'next/image'
import Link from 'next/link'

export function generateStaticParams() {
  return FALLBACK_BLOGS.map((post) => ({
    slug: post.slug,
  }))
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let blog: any = null

  try {
    const { data } = await supabase
      .from('blog')
      .select('*')
      .eq('slug', params.slug)
      .maybeSingle()
    
    if (data) {
      blog = data
    }
  } catch (err) {
    console.error('Supabase blog fetch note:', err)
  }

  if (!blog) {
    blog = FALLBACK_BLOGS.find((b) => b.slug === params.slug) || null
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-20">
          <Card className="max-w-md w-full shadow-lg border-slate-200">
            <CardContent className="p-8 sm:p-10 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Makale Bulunamadı</h2>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.
              </p>
              <Button asChild className="bg-bio-primary hover:bg-bio-primary/90 text-white font-semibold w-full">
                <Link href="/blog" className="inline-flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tüm Blog Yazılarına Dön
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Calculate read time
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 180))

  // Find other related articles
  const otherPosts = FALLBACK_BLOGS.filter((b) => b.slug !== blog.slug).slice(0, 3)

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-sm font-semibold text-bio-primary hover:text-bio-primary/80 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Tüm Blog Yazılarına Dön
            </Link>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link href="/" className="hover:text-slate-800">Ana Sayfa</Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link href="/blog" className="hover:text-slate-800">Blog</Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-slate-700 truncate max-w-[200px]">{blog.title}</span>
            </div>
          </div>

          {/* ARTICLE HERO / HEADER */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bio-primary/10 text-bio-primary text-xs font-semibold mb-4 border border-bio-primary/20">
              <Activity className="h-3.5 w-3.5" />
              <span>Biyomedikal & Klinik Mühendislik</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-bio-primary to-emerald-400 flex items-center justify-center text-white font-bold shadow-inner">
                  ST
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base">Serkan Turgut</div>
                  <div className="text-xs text-slate-500">Biyomedikal Cihaz Teknikeri</div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-bio-primary" />
                  <span>
                    {new Date(blog.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-bio-primary" />
                  <span>{readTime} dk okuma</span>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image if available */}
          {blog.cover_image && (
            <div className="aspect-video relative rounded-2xl overflow-hidden mb-10 shadow-lg border border-slate-200">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt / Executive Summary Callout */}
          {blog.excerpt && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50/50 border-l-4 border-bio-primary p-6 rounded-r-2xl mb-10 shadow-sm">
              <div className="flex items-center gap-2 text-bio-primary font-bold text-sm uppercase tracking-wider mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Özet & Klinik Odak</span>
              </div>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed italic">
                "{blog.excerpt}"
              </p>
            </div>
          )}

          {/* MAIN ARTICLE CONTENT */}
          <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 md:p-12 mb-12">
            <div 
              className="prose prose-slate prose-lg max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-bio-primary
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5
                prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6
                prose-li:text-slate-700 prose-li:my-1.5
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-blockquote:border-l-bio-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* AUTHOR BIO CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-14">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-bio-primary to-emerald-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
                ST
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Serkan Turgut</h3>
                  <Badge className="bg-bio-primary/20 text-emerald-300 border border-emerald-400/30 text-xs">
                    Biyomedikal Teknikeri
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Ventilatör sistemleri, hasta başı monitörleri, anestezi iş istasyonları ve klinik cihazların elektriksel güvenlik & kalibrasyon süreçlerinde saha deneyimine sahip biyomedikal tekniker.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Button asChild size="sm" className="bg-bio-primary hover:bg-bio-primary/90 text-white font-semibold shadow">
                    <Link href="/cv">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Özgeçmişi İncele
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white">
                    <Link href="/contact">
                      <MessageSquare className="h-4 w-4 mr-1.5" />
                      İletişime Geç
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED POSTS SECTION */}
          {otherPosts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Diğer Biyomedikal Makaleleri
                </h3>
                <Link href="/blog" className="text-sm font-semibold text-bio-primary hover:underline">
                  Tümünü Gör →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-slate-200/90 rounded-2xl flex flex-col justify-between overflow-hidden bg-white">
                    <CardContent className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="text-xs text-bio-primary font-semibold mb-2">
                          {new Date(post.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base leading-snug mb-3 line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-bio-primary transition-colors">
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-bio-primary hover:text-bio-primary/80 inline-flex items-center mt-auto"
                      >
                        Yazıyı Oku →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
