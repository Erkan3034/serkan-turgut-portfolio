'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Lütfen geçerli bir e-posta adresi giriniz'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('https://formspree.io/f/mkgqawap', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      })

      if (!res.ok) throw new Error('Formspree request failed')

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Bana Ulaşın
            </h1>
            <p className="text-xl text-gray-600">
              Biyomedikal cihaz teknolojisi ile ilgili fırsatları konuşalım
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* İletişim Bilgileri */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Bana Ulaşın</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-bio-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">E-posta</h3>
                      <p className="text-gray-600">Serkantrg56@gmail.com</p>
                      <p className="text-sm text-gray-500">24 saat içinde yanıt veririm</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-bio-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Telefon</h3>
                      <p className="text-gray-600">+90(543)5986022</p>
                      <p className="text-sm text-gray-500">Pzt-Cuma, 9:00-17:00 arası</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Konum</h3>
                      <p className="text-gray-600">İstanbul, 4.Levent</p>
                      <p className="text-sm text-gray-500">Yeni fırsatlara açık</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-bio-accent">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-bio-text mb-4">
                    Neden Birlikte Çalışmalıyız?
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-bio-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Kapsamlı biyomedikal cihaz teknolojisi eğitimi
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-bio-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Tıbbi ekipmanlar ve testlerde uygulamalı deneyim
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-bio-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Sağlık standartları ve yönetmelikleri konusunda güçlü bilgi birikimi
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-bio-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Teknoloji ile hasta sonuçlarını iyileştirme tutkusuna sahibim
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* İletişim Formu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mesaj Gönder</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="mt-1"
                      placeholder="Adınız ve soyadınız"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1"
                      placeholder="epostaniz@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      className="mt-1"
                      rows={6}
                      placeholder="Projenizden veya fırsatınızdan bahsedin..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        Teşekkürler! Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağım.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        Üzgünüm, mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-bio-primary hover:bg-bio-primary/90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Mesajı Gönder
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
