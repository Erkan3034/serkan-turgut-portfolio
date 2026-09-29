'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Lock, LogIn, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session) {
          window.location.href = '/admin/dashboard'
        }
      } catch (e) {
        console.warn('Mevcut oturum kontrolü:', e)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const cleanEmail = email.trim()
    const cleanPassword = password

    if (!cleanEmail) {
      setError('Lütfen e-posta adresinizi giriniz.')
      return
    }

    if (!cleanPassword) {
      setError('Lütfen şifrenizi giriniz.')
      return
    }

    setIsLoading(true)

    try {
      console.log('Giriş deneniyor:', cleanEmail)
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      })

      console.log('Supabase yanıtı:', { authData, authErr })

      if (authErr) {
        throw authErr
      }

      if (authData?.session) {
        setSuccess(true)
        console.log('Giriş başarılı! Dashboard yönlendiriliyor...')
        window.location.href = '/admin/dashboard'
      } else if (authData?.user && !authData?.session) {
        setError('Kullanıcı bulundu ancak e-posta onayı henüz yapılmamış. Lütfen Supabase Authentication > Users sekmesinden kullanıcının e-postasını onaylayın (Confirm Email).')
      } else {
        setError('Oturum başlatılamadı. Lütfen bilgilerinizi kontrol ediniz.')
      }
    } catch (err: any) {
      console.error('Giriş yakalanan hata:', err)
      const msg = err.message || ''
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('E-posta veya şifre hatalı. Lütfen Supabase üzerinde kullanıcıyı ve şifreyi kontrol ediniz.')
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('E-posta adresi doğrulanmamış. Supabase panelinde kullanıcıyı Auto Confirm ile oluşturun veya onaylayın.')
      } else {
        setError(msg || 'Giriş yapılamadı. Lütfen internet bağlantınızı ve Supabase ayarlarınızı kontrol ediniz.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-bio-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Yönetim Paneli</h2>
          <p className="mt-2 text-slate-600 text-sm">Portfolyo içeriğini düzenlemek için giriş yapınız</p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Giriş Yap</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-xs font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-emerald-700 text-xs font-medium leading-relaxed">Giriş başarılı! Yönlendiriliyorsunuz...</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bio-primary hover:bg-bio-primary/90 text-white font-bold h-11 shadow-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-bio-primary hover:text-bio-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
