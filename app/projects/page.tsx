'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ExternalLink, Github, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import Image from 'next/image'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
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
    <Layout>
      <div className="min-h-screen bg-bio-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Projeler
            </h1>
            <p className="text-xl text-gray-600">
              Biyomedikal cihaz teknolojisi ve sağlık inovasyonu alanındaki çalışmalarım
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {project.image_url && (
                    <div className="aspect-video relative">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <p className="text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detayları Gör
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {project.image_url && (
                              <div className="aspect-video relative">
                                <Image
                                  src={project.image_url}
                                  alt={project.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex space-x-4">
                              {project.github_link && (
                                <Button variant="outline" asChild>
                                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 mr-2" />
                                    Kodu Görüntüle
                                  </a>
                                </Button>
                              )}
                              {project.live_demo && (
                                <Button asChild>
                                  <a href={project.live_demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Canlı Demo
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Proje Bulunamadı
                </h3>
                <p className="text-gray-500">
                  Admin panelinden eklendiğinde projeler burada görüntülenecektir.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <Card className="bg-bio-primary text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Çalışmalarım İlginizi Çekti mi?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Yenilikçi sağlık çözümleri için birlikte nasıl çalışabileceğimizi konuşalım.
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-white text-bio-primary hover:bg-gray-100"
                >
                  <a href="/contact">
                    İletişime Geç
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
