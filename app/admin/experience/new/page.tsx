'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminExperienceNewPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/admin/login')
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccess(false)
    try {
      const { error } = await supabase.from('experience').insert([{ title, organization, year, description }])
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/experience')
      }, 1000)
    } catch (err) {
      console.error('Deneyim kaydedilirken hata:', err)
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/experience')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Deneyim Listesine Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Yeni Deneyim Ekle</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Deneyim & Kurum Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Pozisyon / Unvan</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1" 
                  placeholder="Örn: Biyomedikal Cihaz Teknikeri / Stajyer"
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="org">Kurum / Şirket / Üniversite</Label>
                  <Input 
                    id="org" 
                    value={organization} 
                    onChange={(e) => setOrganization(e.target.value)} 
                    className="mt-1" 
                    placeholder="Örn: Teknomedikal Biyomedikal Hizmetleri"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="year">Dönem / Yıl</Label>
                  <Input 
                    id="year" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    className="mt-1" 
                    placeholder="Örn: 2024 - Devam Ediyor"
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="desc">Açıklama & Sorumluluklar</Label>
                <Textarea 
                  id="desc" 
                  rows={6} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-1" 
                  placeholder="Üzerinde çalışılan tıbbi cihazlar, kalibrasyon süreçleri ve yapılan görevler..."
                  required 
                />
              </div>
            </CardContent>
          </Card>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Deneyim başarıyla eklendi! Yönlendiriliyorsunuz...</span>
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
                  Deneyimi Kaydet
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
