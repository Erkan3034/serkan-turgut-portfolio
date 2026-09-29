'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, Trash2, FileText, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type CvFile = Database['public']['Tables']['cv_files']['Row']

export default function AdminCVPage() {
  const router = useRouter()
  const [files, setFiles] = useState<CvFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/admin/login')
      await fetchFiles()
    }
    run()
  }, [router])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_files')
        .select('*')
        .order('uploaded_at', { ascending: false })
      if (error) throw error
      setFiles(data || [])
    } catch (e) {
      console.error('CV dosyaları yüklenirken hata:', e)
    } finally {
      setLoading(false)
    }
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileInputRef.current?.files?.[0]) return
    const file = fileInputRef.current.files[0]
    setUploading(true)
    setSuccess(false)
    try {
      const ext = file.name.split('.').pop()
      const path = `cv/${Date.now()}.${ext}`
      const { data: storageData, error: stErr } = await supabase.storage
        .from('files')
        .upload(path, file, { upsert: false, cacheControl: '3600' })
      if (stErr) throw stErr
      const { data: publicUrl } = supabase.storage.from('files').getPublicUrl(storageData.path)
      const { error: dbErr } = await supabase.from('cv_files').insert([
        { title: file.name, file_url: publicUrl.publicUrl }
      ])
      if (dbErr) throw dbErr
      setSuccess(true)
      await fetchFiles()
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error('Yükleme başarısız:', e)
    } finally {
      setUploading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Bu CV dosyasını silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('cv_files').delete().eq('id', id)
    if (!error) await fetchFiles()
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kontrol Paneline Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">CV Dosyası Yönetimi</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Yeni Güncel CV Yükle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpload} className="space-y-4">
              <div>
                <Label htmlFor="cv">PDF Özgeçmiş Dosyası Seçin</Label>
                <Input id="cv" type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" className="mt-1" />
              </div>

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Yeni CV dosyası başarıyla yüklendi!</span>
                </div>
              )}

              <Button type="submit" disabled={uploading} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
                {uploading ? 'Yükleniyor...' : (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> 
                    Dosyayı Yükle
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Yüklü CV Dosyaları</h2>
          {files.length === 0 ? (
            <Card className="border-slate-200"><CardContent className="p-6 text-slate-500 text-center">Henüz CV dosyası yüklenmemiş.</CardContent></Card>
          ) : (
            files.map(f => (
              <Card key={f.id} className="border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bio-primary/10 text-bio-primary rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{f.title}</div>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(f.uploaded_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={f.file_url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Görüntüle
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(f.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
