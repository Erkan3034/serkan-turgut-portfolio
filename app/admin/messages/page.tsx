'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Mail, 
  Calendar,
  ArrowLeft,
  User,
  MessageSquare
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Message = Database['public']['Tables']['messages']['Row']

export default function AdminMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchMessages()
    }
    checkAuth()
  }, [router])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchMessages()
    } catch (error) {
      console.error('Mesaj silinirken hata:', error)
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
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kontrol Paneline Dön
              </Button>
              <h1 className="text-xl font-bold text-bio-primary">Gelen İletişim Mesajları</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="p-5 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center font-bold text-slate-900 text-sm">
                        <User className="h-4 w-4 mr-1.5 text-bio-primary" />
                        <span>{message.name}</span>
                      </div>
                      <div className="flex items-center text-slate-600 font-medium">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        <span>{message.email}</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{new Date(message.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${message.email}?subject=Portfolyo İletişim Yanıtı`, '_blank')}
                      >
                        <Mail className="h-3.5 w-3.5 mr-1 text-bio-primary" />
                        E-posta Gönder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mt-2">
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-bio-primary">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Henüz Gelen Mesaj Bulunmuyor
              </h3>
              <p className="text-slate-500 text-sm">
                Sitenizdeki iletişim formundan ziyaretçiler mesaj gönderdiğinde burada listelenecektir.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
