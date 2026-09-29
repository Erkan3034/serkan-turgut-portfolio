'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, Edit, Trash2, Award, Calendar, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Certificate = Database['public']['Tables']['certificates']['Row']

export default function AdminCertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchCertificates()
    }
    checkAuth()
  }, [router])

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCertificates(data || [])
    } catch (error) {
      console.error('Sertifikalar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sertifikayı silmek istediğinize emin misiniz?')) return
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchCertificates()
    } catch (error) {
      console.error('Sertifika silinirken hata:', error)
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
              <h1 className="text-xl font-bold text-bio-primary">Sertifika Yönetimi</h1>
            </div>
            <Button onClick={() => router.push('/admin/certificates/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Sertifika Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {certificates.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center text-slate-600">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-bio-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz Sertifika Eklenmemiş</h3>
              <p className="text-slate-500 text-sm mb-6">Mesleki eğitim belgelerinizi ve sertifikalarınızı yükleyin.</p>
              <Button onClick={() => router.push('/admin/certificates/new')} className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Sertifika Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certificates.map((c) => (
              <Card key={c.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 mb-1">{c.title}</CardTitle>
                      {c.issued_date && (
                        <div className="flex items-center text-xs text-slate-500 mb-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-bio-primary" />
                          <span>Veriliş Tarihi: {new Date(c.issued_date).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      {c.description && <p className="text-sm text-slate-600 mt-1 leading-relaxed">{c.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {c.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(c.file_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Belgeyi Aç
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/certificates/${c.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1 text-bio-primary" />
                        Düzenle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
