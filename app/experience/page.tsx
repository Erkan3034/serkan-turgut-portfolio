'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Activity, 
  Building2, 
  Languages, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  HeartPulse,
  Wrench
} from 'lucide-react'
import { supabase, safeQuery } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { FALLBACK_EXPERIENCES } from '@/lib/fallback-data'
import Link from 'next/link'

type Experience = Database['public']['Tables']['experience']['Row']

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(FALLBACK_EXPERIENCES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data } = await safeQuery(
          supabase.from('experience').select('*').order('created_at', { ascending: false }),
          { data: [], error: null },
          1500
        )
        if (data && data.length > 0) {
          setExperiences(data)
        } else {
          setExperiences(FALLBACK_EXPERIENCES)
        }
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setExperiences(FALLBACK_EXPERIENCES)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  // Helper to choose medical themed icons per experience
  const getExperienceIcon = (title: string, org: string) => {
    const text = (title + ' ' + org).toLowerCase()
    if (text.includes('teknomedikal') || text.includes('tekniker')) {
      return <Activity className="h-5 w-5 text-bio-primary" />
    }
    if (text.includes('hastane') || text.includes('stajyer')) {
      return <Building2 className="h-5 w-5 text-emerald-600" />
    }
    if (text.includes('üniversite') || text.includes('teknoloji') || text.includes('eğitim')) {
      return <GraduationCap className="h-5 w-5 text-blue-600" />
    }
    if (text.includes('dil') || text.includes('english')) {
      return <Languages className="h-5 w-5 text-amber-600" />
    }
    return <Building2 className="h-5 w-5 text-purple-600" />
  }

  // Helper to extract device/skill badges per role
  const getExperienceTags = (exp: Experience) => {
    const text = (exp.title + ' ' + exp.description).toLowerCase()
    const tags: string[] = []
    if (text.includes('ventilatör') || text.includes('biyovent')) tags.push('Mekanik Ventilatör', 'Biyovent')
    if (text.includes('kalibrasyon')) tags.push('Medikal Kalibrasyon')
    if (text.includes('arıza')) tags.push('Arıza Analizi & Onarım')
    if (text.includes('monitör')) tags.push('Hasta Başı Monitör')
    if (text.includes('sterilizasyon')) tags.push('Sterilizasyon & Hijyen')
    if (text.includes('devre') || text.includes('enstrümantasyon')) tags.push('Tıbbi Enstrümantasyon', 'Devre Analizi')
    if (text.includes('operasyon') || text.includes('yönetim')) tags.push('Operasyon Yönetimi', 'Ekip Koordinasyonu')
    if (text.includes('ingilizce') || text.includes('dil')) tags.push('Teknik İngilizce (B1)')
    return tags
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bio-primary/10 text-bio-primary text-xs md:text-sm font-semibold mb-4 border border-bio-primary/20">
              <HeartPulse className="h-4 w-4 animate-pulse" />
              <span>Klinik & Teknik Saha Deneyimi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Kariyer & Eğitim Zaman Çizelgesi
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Biyomedikal cihaz bakımı, kalibrasyon süreçleri ve hastane klinik mühendislik operasyonlarındaki profesyonel geçmişim.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-bio-primary to-bio-secondary rounded-full mx-auto mt-6"></div>
          </div>

          {/* TIMELINE SECTION */}
          <div className="relative mb-20">
            {/* Central / Left Line */}
            <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-bio-primary via-emerald-400 to-slate-200 -translate-x-1/2 hidden sm:block"></div>

            <div className="space-y-8 md:space-y-12">
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0
                const isCurrent = exp.year.toLowerCase().includes('devam') && !exp.title.toLowerCase().includes('staj')
                const tags = getExperienceTags(exp)

                return (
                  <div 
                    key={exp.id || index}
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    } gap-6 md:gap-0`}
                  >
                    {/* Center Node / Dot on timeline */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-bio-primary shadow-md flex items-center justify-center z-10 hidden sm:flex">
                      {getExperienceIcon(exp.title, exp.organization)}
                    </div>

                    {/* Timeline Content Card */}
                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${
                        isCurrent 
                          ? 'border-bio-primary/40 bg-gradient-to-br from-white to-teal-50/30 ring-1 ring-bio-primary/20' 
                          : 'border-slate-200/80 bg-white'
                      } rounded-2xl shadow-sm`}>
                        
                        {/* Top decorative accent for active role */}
                        {isCurrent && (
                          <div className="h-1.5 w-full bg-gradient-to-r from-bio-primary to-emerald-400"></div>
                        )}

                        <CardContent className="p-6 sm:p-7">
                          {/* Top Row: Year Badge & Status */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <Badge 
                              variant="secondary" 
                              className={`px-3 py-1 font-semibold text-xs rounded-full ${
                                isCurrent 
                                  ? 'bg-bio-primary/10 text-bio-primary border border-bio-primary/30' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <Calendar className="h-3 w-3 mr-1.5 inline" />
                              {exp.year}
                            </Badge>

                            {isCurrent && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                Aktif Görev
                              </span>
                            )}
                          </div>

                          {/* Role Title */}
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                            {exp.title}
                          </h3>

                          {/* Organization & Location */}
                          <div className="flex items-center text-bio-primary font-medium text-sm mb-4">
                            <Building2 className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>{exp.organization}</span>
                          </div>

                          {/* Description */}
                          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                            {exp.description}
                          </p>

                          {/* Equipment & Competency Badges */}
                          {tags.length > 0 && (
                            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {tags.map((tag, tIndex) => (
                                <span 
                                  key={tIndex}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-bio-primary" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* MEDICAL EXPERTISE & CORE SKILLS SECTION */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Teknik Uzmanlık & Cihaz Yetkinlikleri
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Klinik ve teknik serviste uzmanlaştığım medikal sistemler ve çalışma disiplinleri
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <Card className="border border-slate-200/80 bg-white rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-50 text-bio-primary rounded-xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Yaşam Destek Cihazları</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Mekanik ventilatörler (Biyovent vb.), anestezi cihazları ve solunum devreleri bakımı.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="border border-slate-200/80 bg-white rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Kardiyak & Monitör</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    EKG cihazları, defibrilatörler ve hasta başı çok parametreli monitör sistemleri.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="border border-slate-200/80 bg-white rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Kalibrasyon & Güvenlik</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Fonksiyonel doğrulama testleri, elektriksel güvenlik kontrolleri ve teknik servis raporlaması.
                  </p>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="border border-slate-200/80 bg-white rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Klinik Servis & Saha</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Hastane ve kliniklerde yerinde arıza müdahalesi, koruyucu periyodik bakım ve parça yönetimi.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-bio-primary to-bio-secondary rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Birlikte Çalışmak veya Bilgi Almak İster misiniz?
            </h3>
            <p className="text-white/90 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              Biyomedikal cihaz bakımı, teknik servis veya iş birlikleri hakkında detaylı görüşmek için dilediğiniz zaman ulaşabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-bio-primary hover:bg-slate-100 font-bold shadow-lg">
                <Link href="/contact">İletişime Geç</Link>
              </Button>
              <Button asChild size="lg" className="bg-slate-900 text-white hover:bg-black font-bold shadow-lg border border-slate-700">
                <Link href="/cv">CV İncele & İndir</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
