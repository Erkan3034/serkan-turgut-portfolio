'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const aboutSchema = z.object({
  content: z.string().min(1, 'Hakkımda metni gereklidir'),
})

type AboutForm = z.infer<typeof aboutSchema>

export default function AdminAboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

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
        setValue('content', (data as any).content || '')
      }
    } catch (error) {
      console.error('Hakkımda metni yüklenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: AboutForm) => {
    setIsSaving(true)
    setSavedSuccess(false)
    try {
      const { data: existing } = await supabase
        .from('about')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existing) {
        const { error } = await supabase
          .from('about')
          .update({ content: data.content, updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('about')
          .insert([{ content: data.content }])

        if (error) throw error
      }

      setSavedSuccess(true)
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Hakkımda metni kaydedilirken hata:', error)
    } finally {
      setIsSaving(false)
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
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kontrol Paneline Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Hakkımda Metni Yönetimi</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Hakkımda Bölümü İçeriği</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Detaylı İçerik (HTML destekli)</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  className="mt-2 font-mono text-sm leading-relaxed"
                  rows={16}
                  placeholder="Hakkımda içeriğinizi buraya yazın..."
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  İçerikte &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; gibi HTML etiketlerini kullanabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Canlı Önizleme */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-700">Canlı Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: watch('content') || '<p class="text-slate-400">Önizleme burada görünecektir...</p>' 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Hakkımda metni başarıyla kaydedildi. Yönlendiriliyorsunuz...</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
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
                  Kaydediliyor...
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
