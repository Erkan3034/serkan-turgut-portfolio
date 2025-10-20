'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experience']['Row']

export default function AdminExperiencePage() {
  const router = useRouter()
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchItems()
    }
    checkAuth()
  }, [router])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu deneyimi silmek istiyor musunuz?')) return
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchItems()
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
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
              <h1 className="text-xl font-bold text-bio-primary">Experience</h1>
            </div>
            <Button onClick={() => router.push('/admin/experience/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Experience
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-600">
              Henüz deneyim eklenmemiş.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <Card key={it.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{it.title} · {it.organization} · {it.year}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/experience/${it.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(it.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Sil
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


