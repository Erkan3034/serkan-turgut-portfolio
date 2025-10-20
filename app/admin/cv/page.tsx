'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type CvFile = Database['public']['Tables']['cv_files']['Row']

export default function AdminCVPage() {
  const router = useRouter()
  const [files, setFiles] = useState<CvFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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
      console.error('Error loading CV files:', e)
    } finally {
      setLoading(false)
    }
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileInputRef.current?.files?.[0]) return
    const file = fileInputRef.current.files[0]
    setUploading(true)
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
      await fetchFiles()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (e) {
      console.error('Upload failed:', e)
    } finally {
      setUploading(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return
    const { error } = await supabase.from('cv_files').delete().eq('id', id)
    if (!error) await fetchFiles()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bio-accent">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">CV Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload new CV</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpload} className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="cv">Select file (PDF recommended)</Label>
                <Input id="cv" type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" className="mt-1" />
              </div>
              <Button type="submit" disabled={uploading} className="bg-bio-primary hover:bg-bio-primary/90">
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          {files.length === 0 ? (
            <Card><CardContent className="p-6 text-gray-600">Henüz CV dosyası yüklenmemiş.</CardContent></Card>
          ) : (
            files.map(f => (
              <Card key={f.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <a href={f.file_url} target="_blank" rel="noreferrer" className="text-bio-primary underline">
                    {f.title}
                  </a>
                  <Button variant="outline" className="text-red-600" onClick={() => onDelete(f.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


