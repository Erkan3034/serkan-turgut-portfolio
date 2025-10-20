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

export default function AdminProjectEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubLink, setGithubLink] = useState('')
  const [liveDemo, setLiveDemo] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/admin/login')
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (data) {
        setTitle(data.title)
        setDescription(data.description)
        setGithubLink(data.github_link || '')
        setLiveDemo(data.live_demo || '')
        setTags((data.tags || []).join(', '))
      }
      setIsLoading(false)
    }
    if (id) run()
  }, [id, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const { error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          github_link: githubLink || null,
          live_demo: liveDemo || null,
          tags: tagsArray,
        })
        .eq('id', id)
      if (error) throw error
      router.push('/admin/projects')
    } catch (e) {
      console.error('Error updating project:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Bu projeyi silmek istiyor musunuz?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) router.push('/admin/projects')
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
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/projects')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Projelere Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Projeyi Düzenle</h1>
            </div>
            <Button variant="outline" className="text-red-600" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Sil
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proje Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub Link</Label>
                  <Input id="github" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="live">Canlı Demo</Label>
                  <Input id="live" value={liveDemo} onChange={(e) => setLiveDemo(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-bio-primary hover:bg-bio-primary/90">
              <Save className="h-4 w-4 mr-2" /> Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


