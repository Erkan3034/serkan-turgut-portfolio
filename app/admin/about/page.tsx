'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const aboutSchema = z.object({
  content: z.string().min(1, 'Content is required'),
})

type AboutForm = z.infer<typeof aboutSchema>

export default function AdminAboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema),
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchAbout()
    }
    checkAuth()
  }, [router])

  const fetchAbout = async () => {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setValue('content', data.content)
      }
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: AboutForm) => {
    setIsSaving(true)
    try {
      // Check if about record exists
      const { data: existing } = await supabase
        .from('about')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('about')
          .update({ content: data.content, updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new record
        const { error } = await supabase
          .from('about')
          .insert([{ content: data.content }])

        if (error) throw error
      }

      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving about:', error)
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
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">About Section Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="mt-1"
                  rows={20}
                  placeholder="Write your about content here. You can use HTML tags for formatting..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  You can use HTML tags for formatting. For example: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: watch('content') || '<p class="text-gray-500">Preview will appear here...</p>' 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
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
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
