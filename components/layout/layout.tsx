import { Footer } from './footer'
import { Navbar } from './navbar'

interface LayoutProps {
  children: React.ReactNode
  showBlog?: boolean
  showCertificates?: boolean
}

export function Layout({ children, showBlog = true, showCertificates = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        showBlog={showBlog} 
        showCertificates={showCertificates} 
      />
      <main className="flex-1 page-animate">
        {children}
      </main>
      <Footer />
    </div>
  )
}
