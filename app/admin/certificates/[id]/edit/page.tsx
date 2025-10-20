'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminCertificateEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [issuedDate, setIssuedDate] = useState('')

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/admin/login')
      const { data } = await supabase.from('certificates').select('*').eq('id', id).maybeSingle()
      if (data) {
        setTitle(data.title)
        setDescription(data.description || '')
        setFileUrl(data.file_url)
        setIssuedDate((data.issued_date as any) || '')
      }
      setIsLoading(false)
    }
    if (id) run()
  }, [id, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('certificates')
        .update({ title, description: description || null, file_url: fileUrl, issued_date: issuedDate || null })
        .eq('id', id)
      if (error) throw error
      router.push('/admin/certificates')
    } catch (err) {
      console.error('Error updating certificate:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Delete this item?')) return
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (!error) router.push('/admin/certificates')
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/certificates')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Certificates
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Edit Certificate</h1>
            </div>
            <Button variant="outline" className="text-red-600" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file">File URL</Label>
                  <Input id="file" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="date">Issued Date</Label>
                  <Input id="date" type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-bio-primary hover:bg-bio-primary/90">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


