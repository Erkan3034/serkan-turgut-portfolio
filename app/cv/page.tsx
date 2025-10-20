'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type CVFile = Database['public']['Tables']['cv_files']['Row']
type About = Database['public']['Tables']['about']['Row']

export default function CVPage() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([])
  const [loading, setLoading] = useState(true)
  const [about, setAbout] = useState<About | null>(null)

  useEffect(() => {
    async function fetchCVFiles() {
      try {
        const { data, error } = await supabase
          .from('cv_files')
          .select('*')
          .order('uploaded_at', { ascending: false })

        if (error) throw error
        setCvFiles(data || [])
      } catch (error) {
        console.error('Error fetching CV files:', error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchAbout() {
      try {
        const { data } = await supabase
          .from('about')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (data) setAbout(data)
      } catch (e) {
        console.error('Error fetching about for CV:', e)
      }
    }

    fetchCVFiles()
    fetchAbout()
  }, [])

  const handleDownload = async (fileUrl: string, title: string) => {
    try {
      // For public files, we can directly download
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
    }
  }

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
    <Layout>
      <div className="min-h-screen bg-bio-accent py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Özgeçmiş
            </h1>
            <p className="text-xl text-gray-600">
              Eğitim ve niteliklerim hakkında detaylar için en güncel özgeçmişimi indirebilirsiniz
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {cvFiles.length > 0 ? (
            <div className="space-y-6">
              {cvFiles.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-bio-primary rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{cv.title}</CardTitle>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Yüklenme Tarihi: {new Date(cv.uploaded_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(cv.file_url, cv.title)}
                        className="bg-bio-primary hover:bg-bio-primary/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF İndir
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  CV Bulunamadı
                </h3>
                <p className="text-gray-500">
                  Admin panelinden yüklendiğinde CV dosyaları burada görünecek.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <div className="mt-16">
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
                    Hakkımda içeriği admin panelinden güncellendiğinde burada gösterilecektir.
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
