'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type Blog = Database['public']['Tables']['blog']['Row']

const blogSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'İçerik zorunludur'),
})

type BlogForm = z.infer<typeof blogSchema>

export default function BlogEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [coverImage, setCoverImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  })

  const title = watch('title')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchBlog()
    }
    if (id) checkAuth()
  }, [id, router])

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (data) {
        setBlog(data)
        setCoverImage(data.cover_image || '')
        setValue('title', data.title)
        setValue('excerpt', data.excerpt || '')
        setValue('content', data.content)
      }
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog-covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setCoverImage(data.publicUrl)
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: BlogForm) => {
    setIsSaving(true)
    setSuccess(false)
    try {
      const slug = blog?.slug || generateSlug(data.title)
      const blogData: any = {
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        slug,
        cover_image: coverImage || null,
      }

      const { error } = await supabase
        .from('blog')
        .update(blogData)
        .eq('id', id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/blog')
      }, 1000)
    } catch (error) {
      console.error('Blog güncellenirken hata:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return
    try {
      const { error } = await supabase.from('blog').delete().eq('id', id)
      if (!error) router.push('/admin/blog')
    } catch (err) {
      console.error('Silme hatası:', err)
    }
  }

  if (isLoading) {
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
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/blog')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Blog Listesine Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Blog Yazısını Düzenle</h1>
            </div>
            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Yazıyı Sil
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Makale Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  {...register('title')}
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
                {blog?.slug && (
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Mevcut URL (Slug): /{blog.slug}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Kısa Özet (Excerpt)</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  className="mt-1"
                  rows={3}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Makale İçeriği (HTML destekli)</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="mt-1 font-mono text-sm leading-relaxed"
                  rows={16}
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                )}
              </div>

              <div>
                <Label>Kapak Görseli</Label>
                <div className="mt-1 flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={isUploading}
                  />
                  {isUploading && <span className="text-xs text-slate-500">Yükleniyor...</span>}
                </div>
                {coverImage && (
                  <div className="mt-2 text-xs text-emerald-600 font-medium">
                    ✓ Kapak görseli: {coverImage}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Değişiklikler başarıyla kaydedildi! Yönlendiriliyorsunuz...</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/blog')}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Güncelleniyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Değişiklikleri Kaydet
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
