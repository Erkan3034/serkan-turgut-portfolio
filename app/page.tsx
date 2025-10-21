'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, GraduationCap, Briefcase, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type About = Database['public']['Tables']['about']['Row']
type Blog = Database['public']['Tables']['blog']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Certificate = Database['public']['Tables']['certificates']['Row']

export default function HomePage() {
  const [about, setAbout] = useState<About | null>(null)
  const [blogCount, setBlogCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch about content
        const { data: aboutData } = await supabase
          .from('about')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        // Fetch counts for conditional navigation
        const [blogResult, projectResult, certificateResult] = await Promise.all([
          supabase.from('blog').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('certificates').select('id', { count: 'exact', head: true })
        ])

        setAbout(aboutData)
        setBlogCount(blogResult.count || 0)
        setProjectCount(projectResult.count || 0)
        setCertificateCount(certificateResult.count || 0)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout 
      showBlog={blogCount > 0} 
      showProjects={projectCount > 0} 
      showCertificates={certificateCount > 0}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bio-accent to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-bio-text mb-6">
                Merhaba, Ben{' '}
                <span className="text-bio-primary">Serkan Turgut</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Biyomedikal Cihaz Teknolojisi mezunu, yenilikçi sağlık çözümleri geliştirmeye tutkulu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-bio-primary hover:bg-bio-primary/90">
                  <Download className="mr-2 h-5 w-5" />
                  CV İndir
                </Button>
                {projectCount > 0 && (
                  <Button asChild variant="outline" size="lg">
                    <a href="/projects">Projeleri Görüntüle</a>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-bio-primary to-bio-secondary rounded-full flex items-center justify-center">
                <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/images/profile.png" 
                    alt="Serkan Turgut" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to graduation cap icon if image not found
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                  <GraduationCap className="h-32 w-32 text-bio-primary hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bio-text mb-4">
              Neden Biyomedikal Teknoloji?
            </h2>
            <div className="w-24 h-1 bg-bio-primary mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                {about?.content && about.content.trim().length > 0 ? (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Hakkımda içeriği admin panelinden yapılandırıldıktan sonra burada görüntülenecektir.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills & Highlights */}
      <section className="py-20 bg-bio-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-bio-text mb-4">
              Yetenekler & Uzmanlık Alanları
            </h2>
            <div className="w-24 h-1 bg-bio-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-bio-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Eğitim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Biyomedikal cihaz teknolojisi, tıbbi enstrümantasyon ve sağlık hizmetleri inovasyonu konularında kapsamlı eğitim.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Tıbbi Cihazlar</Badge>
                  <Badge variant="secondary">Biyomedikal Mühendislik</Badge>
                  <Badge variant="secondary">Ekip Çalışması</Badge>
                  <Badge variant="secondary">Takım yönetimi</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-bio-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Deneyim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tıbbi ekipmanlar, cihaz testleri ve sağlık teknolojisi uygulamaları konularında pratik deneyim.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Cihaz Testleri</Badge>
                  <Badge variant="secondary">Kalite Güvencesi</Badge>
                  <Badge variant="secondary">Tıbbi Görüntüleme Teknikleri</Badge>
                  <Badge variant="secondary">Algoritma Geliştirme ve Programlama</Badge>
                  <Badge variant="secondary">Elektronik</Badge>

                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-bio-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Teknik Beceriler</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Biyomedikal mühendisliği alanında edindiğim teorik bilgileri, pratik uygulamalarla birleştirdiğim temel yetkinlikler ve kullandığım araçlar.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">C++</Badge>
                  <Badge variant="secondary">Elektronik Devre Tasarımı</Badge>
                  <Badge variant="secondary">Devre Analizi</Badge>
                  <Badge variant="secondary">Tıbbi Görüntüleme Prensipleri</Badge>
                  <Badge variant="secondary">Mikrodenetleyiciler</Badge>
                  <Badge variant="secondary">Kalibrasyon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-bio-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bağlantı Kurmaya Hazır mısınız?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Biyomedikal teknolojinin sağlık sonuçlarını nasıl iyileştirebileceğini konuşalım.
          </p>
          <a href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-bio-primary hover:bg-gray-100">
              İletişime Geç
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  )
}
