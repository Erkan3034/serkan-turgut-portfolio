import { CertificateEditClient } from './certificate-edit-client'

export function generateStaticParams() {
  return []
}

interface PageProps {
  params: {
    id: string
  }
}

export default function AdminCertificateEditPage({ params }: PageProps) {
  return <CertificateEditClient id={params.id} />
}
