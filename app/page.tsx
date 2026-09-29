'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Loader2, 
  Activity, 
  HeartPulse, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Wrench,
  FileText
} from 'lucide-react'
import { supabase, safeQuery } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { FALLBACK_BLOGS, FALLBACK_ABOUT } from '@/lib/fallback-data'

type About = Database['public']['Tables']['about']['Row']
type Blog = Database['public']['Tables']['blog']['Row']
type Certificate = Database['public']['Tables']['certificates']['Row']
type CVFile = Database['public']['Tables']['cv_files']['Row']

export default function HomePage() {
  const router = useRouter()
  const [about, setAbout] = useState<About | null>(FALLBACK_ABOUT)
  const [latestCV, setLatestCV] = useState<CVFile | null>(null)
  const [blogCount, setBlogCount] = useState(FALLBACK_BLOGS.length)
  const [certificateCount, setCertificateCount] = useState(0)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutRes, cvRes, blogResult, certificateResult] = await Promise.all([
          safeQuery(
            supabase.from('about').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
            { data: null, error: null }
          ),
          safeQuery(
            supabase.from('cv_files').select('*').order('uploaded_at', { ascending: false }).limit(1).maybeSingle(),
            { data: null, error: null }
          ),
          safeQuery(
            supabase.from('blog').select('id', { count: 'exact', head: true }),
            { count: 0, data: null, error: null }
          ),
          safeQuery(
            supabase.from('certificates').select('id', { count: 'exact', head: true }),
            { count: 0, data: null, error: null }
          ),
        ])

        if (aboutRes.data && (aboutRes.data as any).content) setAbout(aboutRes.data as any)
        if (cvRes.data) setLatestCV(cvRes.data as any)
        if (blogResult.count && blogResult.count > 0) setBlogCount(blogResult.count)
        if (certificateResult.count && certificateResult.count > 0) setCertificateCount(certificateResult.count)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleDownloadCV = async () => {
    setDownloading(true)
    const fileUrl = latestCV?.file_url || '/Serkan_Turgut_CV.pdf'
    const fileName = latestCV?.title || 'Serkan_Turgut_CV'

    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading CV:', error)
      window.open(fileUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Layout
      showBlog={blogCount > 0}
      showCertificates={certificateCount > 0}
    >
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50/40 py-16 md:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bio-primary/10 text-bio-primary text-xs md:text-sm font-semibold mb-6 border border-bio-primary/20 shadow-sm">
                <Stethoscope className="h-4 w-4" />
                <span>Biyomedikal Cihaz Teknikeri</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Merhaba, Ben <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-primary to-emerald-600">
                  Serkan Turgut
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Mekanik ventilatörler, hasta başı monitörleri, EKG sistemleri ve klinik enstrümantasyon üzerinde periyodik bakım, kalibrasyon ve arıza tespiti konularında uzman teknik profesyonel.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-bio-primary hover:bg-bio-primary/90 text-white font-bold shadow-md shadow-bio-primary/20 px-7 transition-all">
                  <Link href="/cv" className="inline-flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    CV'mi Görüntüle
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="border-2 border-slate-300 text-slate-800 hover:border-bio-primary hover:text-bio-primary hover:bg-bio-primary/5 font-semibold px-6">
                  <Link href="/experience" className="inline-flex items-center">
                    Deneyimleri İncele
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Quick Trust Badges */}
              <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>2+ Yıl Saha & Teknik Servis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Ventilatör & EKG Uzmanlığı</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Medikal Kalibrasyon</span>
                </div>
              </div>
            </div>

            {/* Right Profile Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-bio-primary to-emerald-400 opacity-25 blur-lg"></div>
                
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-br from-bio-primary to-bio-secondary shadow-2xl">
                  <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center border-4 border-white">
                    <img 
                      src="/images/profile.png" 
                      alt="Serkan Turgut - Biyomedikal Cihaz Teknikeri" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) nextElement.style.display = 'block';
                      }}
                    />
                    <GraduationCap className="h-32 w-32 text-bio-primary hidden" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION (HAKKIMDA) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Hakkımda & Çalışma Disiplinim
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Sağlık teknolojilerinde yüksek güvenilirlik ve hasta güvenliği odaklı teknik servis yaklaşımı.
            </p>
            <div className="w-20 h-1 bg-bio-primary mx-auto mt-4 rounded-full"></div>
          </div>
          
          <Card className="border border-slate-200/80 shadow-md rounded-2xl overflow-hidden bg-slate-50/40">
            <CardContent className="p-6 sm:p-10">
              {about?.content && about.content.trim().length > 0 ? (
                <div 
                  className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <p>Hakkımda içeriği admin panelinden güncellendiğinde burada gösterilecektir.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CORE CLINICAL & TECHNICAL SKILLS */}
      <section className="py-16 md:py-24 bg-slate-50/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Yetkinlikler & Uzmanlık Alanları
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Teorik biyomedikal mühendisliği temeli ve klinik saha tecrübesi
            </p>
            <div className="w-20 h-1 bg-bio-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Yaşam Destek & Ventilatör */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 text-center">
                <div className="w-14 h-14 bg-teal-50 text-bio-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <Activity className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Yaşam Destek Cihazları</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Mekanik ventilatör sistemleri (Biyovent vb.), anestezi cihazları, ekspirasyon valfleri ve gaz mikserleri üzerinde uzmanlık.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Ventilatörler</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Anestezi Sistemleri</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Akış Sensörleri</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">PEEP Kontrolü</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Kardiyak & Hasta Takip */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 text-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <HeartPulse className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Kardiyak & Takip Sistemleri</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Elektrokardiyografi (EKG), hasta başı çok parametreli monitörler, SpO2 ve NIBP modüllerinin periyodik test ve arıza onarımı.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">EKG Cihazları</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Hasta Monitörleri</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Defibrilatörler</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">İnfüzyon Pompaları</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Kalibrasyon & Saha Servis */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Kalibrasyon & Kalite</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Fonksiyonel doğrulama testleri, elektriksel güvenlik kontrolleri, klinik sterilizasyon protokolleri ve teknik dokümantasyon.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Medikal Kalibrasyon</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Elektriksel Güvenlik</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Sterilizasyon</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">Teknik Raporlama</Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-bio-primary via-teal-700 to-bio-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
            Biyomedikal Çözümler İçin İletişime Geçin
          </h2>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Tıbbi cihaz teknik servisi, periyodik bakım veya kariyer fırsatları hakkında görüşmek üzere bana doğrudan ulaşabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Button asChild size="lg" className="bg-white text-bio-primary hover:bg-slate-100 font-bold shadow-lg">
              <Link href="/contact">İletişim Formu</Link>
            </Button>
            <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-black font-bold shadow-lg border border-slate-700">
              <Link href="/cv" className="inline-flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                CV'mi Görüntüle
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
