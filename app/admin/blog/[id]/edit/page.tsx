'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type Blog = Database['public']['Tables']['blog']['Row']

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
})

type BlogForm = z.infer<typeof blogSchema>

interface BlogEditPageProps {
  params: {
    id: string
  }
}

export default function BlogEditPage({ params }: BlogEditPageProps) {
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [coverImage, setCoverImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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
    checkAuth()
  }, [router, params.id])

  const fetchBlog = async () => {
    if (params.id === 'new') {
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('blog')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setBlog(data)
      setCoverImage(data.cover_image || '')
      setValue('title', data.title)
      setValue('excerpt', data.excerpt || '')
      setValue('content', data.content)
    } catch (error) {
      console.error('Error fetching blog:', error)
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
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: BlogForm) => {
    setIsSaving(true)
    try {
      const slug = params.id === 'new' ? generateSlug(data.title) : (blog?.slug || generateSlug(data.title))
      const blogData: any = {
        title: data.title,
        content: data.content,
        slug,
        cover_image: coverImage,
      }

      if (params.id === 'new') {
        const { error } = await supabase
          .from('blog')
          .insert([blogData])

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog')
          .update(blogData)
          .eq('id', params.id)

        if (error) throw error
      }

      await router.push('/admin/blog')
      if (typeof window !== 'undefined') {
        alert(params.id === 'new' ? 'Post created.' : 'Post updated.')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      if (typeof window !== 'undefined') {
        alert('Error saving blog. Ayrıntılar için konsolu kontrol edin.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bio-accent">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/blog')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">
                {params.id === 'new' ? 'Create New Post' : 'Edit Post'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  className="mt-1"
                  placeholder="Enter post title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
                {title && (
                  <p className="text-sm text-gray-500 mt-1">
                    Slug: {generateSlug(title)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  className="mt-1"
                  rows={3}
                  placeholder="Brief description of the post"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="mt-1"
                  rows={15}
                  placeholder="Write your post content here..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cover-image">Upload Cover Image</Label>
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    className="mt-1"
                  />
                  {isUploading && (
                    <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                  )}
                </div>

                {coverImage && (
                  <div className="mt-4">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/blog')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-bio-primary hover:bg-bio-primary/90"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {params.id === 'new' ? 'Create Post' : 'Update Post'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
