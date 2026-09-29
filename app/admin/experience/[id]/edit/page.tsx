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

export function generateStaticParams() {
  return []
}

export default function AdminExperienceEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/admin/login')
      const { data } = await supabase.from('experience').select('*').eq('id', id).maybeSingle()
      if (data) {
        setTitle(data.title)
        setOrganization(data.organization)
        setYear(data.year)
        setDescription(data.description)
      }
      setIsLoading(false)
    }
    if (id) run()
  }, [id, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccess(false)
    setErrorText('')
    try {
      const { error } = await supabase
        .from('experience')
        .update({ title, organization, year, description })
        .eq('id', id)
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/experience')
      }, 1000)
    } catch (err: any) {
      console.error('Deneyim güncellenirken hata:', err)
      setErrorText(err.message || 'Deneyim güncellenirken veritabanı hatası oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Bu deneyim kaydını silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (!error) router.push('/admin/experience')
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/experience')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Deneyim Listesine Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Deneyimi Düzenle</h1>
            </div>
            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Sil
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Deneyim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Pozisyon / Unvan</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="org">Kurum / Şirket</Label>
                  <Input id="org" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="year">Dönem / Yıl</Label>
                  <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} className="mt-1" required />
                </div>
              </div>
              <div>
                <Label htmlFor="desc">Açıklama & Sorumluluklar</Label>
                <Textarea id="desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" required />
              </div>
            </CardContent>
          </Card>

          {errorText && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm font-semibold">
              <span>⚠️ {errorText}</span>
            </div>
          )}

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
              onClick={() => router.push('/admin/experience')}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
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
