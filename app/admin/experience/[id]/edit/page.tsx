import { ExperienceEditClient } from './experience-edit-client'

export function generateStaticParams() {
  return []
}

interface PageProps {
  params: {
    id: string
  }
}

export default function AdminExperienceEditPage({ params }: PageProps) {
  return <ExperienceEditClient id={params.id} />
}
