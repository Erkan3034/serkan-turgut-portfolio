'use client'

import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Experience = Database['public']['Tables']['experience']['Row']

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('year', { ascending: false })

        if (error) throw error
        setExperiences(data || [])
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
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
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-bio-text mb-4">
              Education & Experience
            </h1>
            <p className="text-xl text-gray-600">
              My journey in biomedical device technology and healthcare innovation
            </p>
            <div className="w-24 h-1 bg-bio-primary mx-auto mt-6"></div>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-bio-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          {experience.title.toLowerCase().includes('education') || 
                           experience.title.toLowerCase().includes('degree') || 
                           experience.title.toLowerCase().includes('university') || 
                           experience.title.toLowerCase().includes('college') ? (
                            <GraduationCap className="h-6 w-6 text-white" />
                          ) : (
                            <Briefcase className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{experience.title}</CardTitle>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">{experience.organization}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{experience.year}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-bio-primary border-bio-primary">
                        {experience.year}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {experience.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Experience Data Available
                </h3>
                <p className="text-gray-500">
                  Experience and education information will be displayed here once added through the admin panel.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          <div className="mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Core Competencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-bio-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Medical Device Technology</h3>
                    <p className="text-gray-600 text-sm">
                      Comprehensive knowledge of medical device design, testing, and implementation
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-bio-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Healthcare Innovation</h3>
                    <p className="text-gray-600 text-sm">
                      Focus on developing solutions that improve patient care and outcomes
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                    <p className="text-gray-600 text-sm">
                      Ensuring compliance with healthcare standards and regulations
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
