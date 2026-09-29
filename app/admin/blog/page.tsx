'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  ArrowLeft,
  FileText
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Blog = Database['public']['Tables']['blog']['Row']

export default function AdminBlogPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchBlogs()
    }
    checkAuth()
  }, [router])

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (error) {
      console.error('Blog yazıları yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('blog')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchBlogs()
    } catch (error) {
      console.error('Yazı silinirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bio-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kontrol Paneline Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Blog Yönetimi</h1>
            </div>
            <Button onClick={() => router.push('/admin/blog/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Makale Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Card key={blog.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-slate-900 mb-1">{blog.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-bio-primary" />
                          <span>{new Date(blog.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-slate-50 font-mono">/{blog.slug}</Badge>
                      </div>
                      {blog.excerpt && (
                        <p className="text-slate-600 text-xs line-clamp-2">{blog.excerpt}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.slug}`)}
                        title="Sitede Görüntüle"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Görüntüle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/blog/${blog.id}/edit`)}
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4 mr-1 text-bio-primary" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-bio-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Henüz Blog Yazısı Bulunmuyor
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Yeni bir teknik makale veya rehber yayınlamak için ilk yazınızı oluşturun.
              </p>
              <Button onClick={() => router.push('/admin/blog/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                İlk Yazıyı Oluştur
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
