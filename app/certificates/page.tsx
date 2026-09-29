'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, Award } from 'lucide-react'
import { supabase, safeQuery } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Image from 'next/image'

type Certificate = Database['public']['Tables']['certificates']['Row']

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const { data } = await safeQuery(
          supabase.from('certificates').select('*').order('issued_date', { ascending: false }),
          { data: [], error: null },
          1500
        )
        setCertificates(data || [])
      } catch (error) {
        console.error('Error fetching certificates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
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
    }
  }

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Certificates
            </h1>
            <p className="text-xl text-gray-600">
              Professional certifications and achievements in biomedical device technology
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-bio-primary rounded-lg flex items-center justify-center">
                        {isImageFile(certificate.file_url) ? (
                          <Award className="h-6 w-6 text-white" />
                        ) : (
                          <FileText className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <Button
                        onClick={() => handleDownload(certificate.file_url, certificate.title)}
                        size="sm"
                        className="bg-bio-primary hover:bg-bio-primary/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    {certificate.issued_date && (
                      <div className="flex items-center text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Issued {new Date(certificate.issued_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {certificate.description && (
                      <p className="text-gray-700 mb-4">{certificate.description}</p>
                    )}
                    
                    {/* Preview for image files */}
                    {isImageFile(certificate.file_url) && (
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <Image
                          src={certificate.file_url}
                          alt={certificate.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Kayıtlı Sertifika Bulunmuyor
                </h3>
                <p className="text-slate-500 text-sm">
                  Yönetim panelinden sertifika yüklendiğinde burada listelenecektir.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mesleki Gelişim & Standartlar */}
          <div className="mt-16">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center font-bold text-slate-900">Mesleki Gelişim & Standartlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-center max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                  Biyomedikal cihaz teknolojisi ve klinik mühendislik alanında güncel standartlar, kalibrasyon gereksinimleri ve teknik eğitimlerle sürekli gelişim önceliğimdir.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-14 h-14 bg-bio-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-1">Medikal Standartlar</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      IEC 62353, IEC 60601 ve Sağlıkta Kalite Standartlarına (SKS) uyum
                    </p>
                  </div>
                  
                  <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      <FileText className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-1">Teknik Yetkinlikler</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Mekanik ventilatör, EKG ve anestezi cihazlarında arıza tespiti ve test uzmanlığı
                    </p>
                  </div>
                  
                  <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-1">Sürekli Gelişim</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Klinik enstrümantasyon ve yeni nesil sağlık teknolojileri takibi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
