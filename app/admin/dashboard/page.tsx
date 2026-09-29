'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  Award, 
  User, 
  MessageSquare,
  LogOut,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  blogCount: number
  experienceCount: number
  certificateCount: number
  messageCount: number
  cvCount: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    blogCount: 0,
    experienceCount: 0,
    certificateCount: 0,
    messageCount: 0,
    cvCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchStats()
    }
    checkAuth()
  }, [router])

  const fetchStats = async () => {
    try {
      const [
        blogResult,
        experienceResult,
        certificateResult,
        messageResult,
        cvResult
      ] = await Promise.all([
        supabase.from('blog').select('id', { count: 'exact', head: true }),
        supabase.from('experience').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('cv_files').select('id', { count: 'exact', head: true })
      ])

      setStats({
        blogCount: blogResult.count || 0,
        experienceCount: experienceResult.count || 0,
        certificateCount: certificateResult.count || 0,
        messageCount: messageResult.count || 0,
        cvCount: cvResult.count || 0,
      })
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
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
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-bio-primary">Yönetim Paneli</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Siteyi Görüntüle
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1.5" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Hoş Geldiniz!</h2>
          <p className="text-slate-600 text-sm sm:text-base">Portfolyo içeriğinizi ve gelen mesajları buradan yönetebilirsiniz.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500">Blog Yazıları</CardTitle>
              <FileText className="h-4 w-4 text-bio-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.blogCount}</div>
              <p className="text-xs text-slate-500 mt-0.5">Yayınlanan makale</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500">Deneyimler</CardTitle>
              <Calendar className="h-4 w-4 text-bio-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.experienceCount}</div>
              <p className="text-xs text-slate-500 mt-0.5">İş & eğitim kaydı</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500">Sertifikalar</CardTitle>
              <Award className="h-4 w-4 text-bio-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.certificateCount}</div>
              <p className="text-xs text-slate-500 mt-0.5">Kayıtlı sertifika</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500">Gelen Mesajlar</CardTitle>
              <MessageSquare className="h-4 w-4 text-bio-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.messageCount}</div>
              <p className="text-xs text-slate-500 mt-0.5">İletişim formu</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500">CV Dosyaları</CardTitle>
              <User className="h-4 w-4 text-bio-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.cvCount}</div>
              <p className="text-xs text-slate-500 mt-0.5">Yüklenen PDF</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-bio-primary" />
                Blog Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Yeni blog yazısı ekleyin, mevcut makaleleri güncelleyin veya silin.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => router.push('/admin/blog')}>
                  Yazıları Yönet
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/admin/blog/new')}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Yeni Yazı
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-bio-primary" />
                Deneyim Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                İş deneyimlerinizi ve eğitim bilgilerinizi timeline üzerinde güncelleyin.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => router.push('/admin/experience')}>
                  Deneyimleri Yönet
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/admin/experience/new')}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Yeni Deneyim
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="h-5 w-5 mr-2 text-bio-primary" />
                Sertifika Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Mesleki sertifikalarınızı ve teknik eğitim belgelerinizi yükleyin.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => router.push('/admin/certificates')}>
                  Sertifikaları Yönet
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/admin/certificates/new')}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Sertifika Ekle
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-bio-primary" />
                CV Yönetimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Yeni güncel PDF özgeçmiş dosyanızı yükleyin ve güncelleyin.
              </p>
              <Button size="sm" onClick={() => router.push('/admin/cv')}>
                CV Dosyalarını Yönet
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-5 w-5 mr-2 text-bio-primary" />
                Hakkımda Metni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Ana sayfadaki ve CV sayfasındaki biyomedikal hakkımda metnini düzenleyin.
              </p>
              <Button size="sm" onClick={() => router.push('/admin/about')}>
                Hakkımda'yı Düzenle
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="h-5 w-5 mr-2 text-bio-primary" />
                Gelen Mesajlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                İletişim formundan gönderilen mesajları okuyun ve inceleyin.
              </p>
              <Button size="sm" onClick={() => router.push('/admin/messages')}>
                Mesajları Gör ({stats.messageCount})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
