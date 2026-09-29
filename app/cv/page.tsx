'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, ExternalLink } from 'lucide-react'
import { supabase, safeQuery } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type CVFile = Database['public']['Tables']['cv_files']['Row']
type About = Database['public']['Tables']['about']['Row']

export default function CVPage() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([])
  const [about, setAbout] = useState<About | null>(null)

  const defaultCvUrl = '/Serkan_Turgut_CV.pdf'

  useEffect(() => {
    async function fetchData() {
      try {
        const [cvRes, aboutRes] = await Promise.all([
          safeQuery(
            supabase.from('cv_files').select('*').order('uploaded_at', { ascending: false }),
            { data: [], error: null }
          ),
          safeQuery(
            supabase.from('about').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
            { data: null, error: null }
          ),
        ])

        if (cvRes.data) setCvFiles(cvRes.data)
        if (aboutRes.data) setAbout(aboutRes.data)
      } catch (error) {
        console.error('Error fetching CV data:', error)
      }
    }

    fetchData()
  }, [])

  const handleDownload = async (fileUrl: string, title: string) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading file:', error)
      window.open(fileUrl, '_blank')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-bio-accent py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Özgeçmiş (CV)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Biyomedikal cihaz teknolojisi, deneyim ve yetkinliklerime ait güncel özgeçmişimi aşağıdan görüntüleyebilir veya indirebilirsiniz.
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {/* Embedded Primary CV Viewer & Actions */}
          <Card className="shadow-lg border overflow-hidden mb-12">
            <CardHeader className="bg-white border-b py-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-bio-primary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg md:text-xl font-bold text-bio-text">
                    Serkan Turgut - Özgeçmiş
                  </CardTitle>
                  <p className="text-sm text-gray-500">Biyomedikal Cihaz Teknikeri</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  <a href={defaultCvUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Yeni Sekmede Aç
                  </a>
                </Button>
                <Button
                  onClick={() => handleDownload(defaultCvUrl, 'Serkan_Turgut_CV')}
                  size="sm"
                  className="flex-1 sm:flex-initial bg-bio-primary hover:bg-bio-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF İndir
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-gray-100">
              <div className="w-full h-[650px] md:h-[800px]">
                <iframe
                  src={`${defaultCvUrl}#view=FitH`}
                  title="Serkan Turgut CV Görüntüleyici"
                  className="w-full h-full border-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional CV Files from Database (if any) */}
          {cvFiles.length > 0 && (
            <div className="space-y-4 mb-12">
              <h2 className="text-2xl font-bold text-bio-text">Diğer CV Dosyaları</h2>
              <div className="space-y-4">
                {cvFiles.map((cv) => (
                  <Card key={cv.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-bio-primary/10 text-bio-primary rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{cv.title}</CardTitle>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>Yüklenme: {new Date(cv.uploaded_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(cv.file_url, cv.title)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          İndir
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hakkımda Bölümü */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Hakkımda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {about?.content ? (
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />
                ) : (
                  <p className="text-gray-700">
                    Biyomedikal Cihaz Teknolojisi mezunuyum. Tıbbi cihazların bakımı, onarımı, kalibrasyonu ve sağlık teknolojileri alanında çözümler üretmekteyim.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
