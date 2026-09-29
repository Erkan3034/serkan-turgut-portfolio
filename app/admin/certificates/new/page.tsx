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

export default function AdminCertificateNewPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [issuedDate, setIssuedDate] = useState('')

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
      const { error } = await supabase.from('certificates').insert([
        { title, description: description || null, file_url: fileUrl, issued_date: issuedDate || null }
      ])
      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/certificates')
      }, 1000)
    } catch (err) {
      console.error('Sertifika kaydedilirken hata:', err)
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
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/certificates')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sertifika Listesine Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Yeni Sertifika Ekle</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sertifika Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Sertifika / Belge Adı</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="mt-1" 
                  placeholder="Örn: Biyomedikal Cihaz Kalibrasyonu Eğitimi"
                  required 
                />
              </div>
              <div>
                <Label htmlFor="desc">Açıklama / Veren Kurum</Label>
                <Textarea 
                  id="desc" 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-1" 
                  placeholder="Eğitim kapsamı ve sertifikayı düzenleyen kuruluş..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file">Dosya / Belge URL veya Görsel Linki</Label>
                  <Input 
                    id="file" 
                    value={fileUrl} 
                    onChange={(e) => setFileUrl(e.target.value)} 
                    className="mt-1" 
                    placeholder="https://... veya /dosya.pdf"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="date">Veriliş Tarihi</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={issuedDate} 
                    onChange={(e) => setIssuedDate(e.target.value)} 
                    className="mt-1" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Sertifika başarıyla eklendi! Yönlendiriliyorsunuz...</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/certificates')}
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
                  Sertifikayı Kaydet
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
