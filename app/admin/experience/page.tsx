'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Edit, Trash2, Calendar, Building2 } from 'lucide-react'
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
      console.error('Deneyimler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu deneyim kaydını silmek istediğinize emin misiniz?')) return
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchItems()
    } catch (error) {
      console.error('Deneyim silinirken hata:', error)
    }
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
              <h1 className="text-xl font-bold text-bio-primary">Deneyim Yönetimi</h1>
            </div>
            <Button onClick={() => router.push('/admin/experience/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Deneyim Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center text-slate-600">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-bio-primary">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz Deneyim Eklenmemiş</h3>
              <p className="text-slate-500 text-sm mb-6">CV deneyimlerinizi timeline sayfasına eklemek için oluşturun.</p>
              <Button onClick={() => router.push('/admin/experience/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Deneyim Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <Card key={it.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-slate-900">{it.title}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-bio-primary font-semibold">{it.organization}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mb-2 font-medium">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-bio-primary" />
                        <span>{it.year}</span>
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{it.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/experience/${it.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1 text-bio-primary" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(it.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
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
