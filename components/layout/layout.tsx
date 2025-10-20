import { Footer } from './footer'
import { Navbar } from './navbar'

interface LayoutProps {
  children: React.ReactNode
  showBlog?: boolean
  showProjects?: boolean
  showCertificates?: boolean
}

export function Layout({ children, showBlog = false, showProjects = false, showCertificates = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        showBlog={showBlog} 
        showProjects={showProjects} 
        showCertificates={showCertificates} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
