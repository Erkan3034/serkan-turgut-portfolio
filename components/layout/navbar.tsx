'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'CV', href: '/cv' },
  { name: 'Deneyim', href: '/experience' },
  { name: 'Projeler', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Sertifikalar', href: '/certificates' },
  { name: 'İletişim', href: '/contact' },
]

interface NavbarProps {
  showBlog?: boolean
  showProjects?: boolean
  showCertificates?: boolean
}

export function Navbar({ showBlog = false, showProjects = false, showCertificates = false }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredNavigation = navigation.filter(item => {
    if (item.name === 'Blog' && !showBlog) return false
    if (item.name === 'Projeler' && !showProjects) return false
    if (item.name === 'Sertifikalar' && !showCertificates) return false
    return true
  })

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-bio-primary">Serkan Turgut</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-bio-primary bg-bio-accent'
                    : 'text-gray-700 hover:text-bio-primary hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'text-bio-primary bg-bio-accent'
                    : 'text-gray-700 hover:text-bio-primary hover:bg-gray-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
