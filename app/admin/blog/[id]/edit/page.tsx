import { BlogEditClient } from './blog-edit-client'

export function generateStaticParams() {
  return []
}

interface PageProps {
  params: {
    id: string
  }
}

export default function BlogEditPage({ params }: PageProps) {
  return <BlogEditClient id={params.id} />
}
