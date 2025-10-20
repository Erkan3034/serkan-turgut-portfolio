import { Linkedin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-bio-primary">Serkan Turgut</h3>
            <p className="text-gray-600">Biomedical Device Technology Graduate</p>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="mailto:Serkantrg56@gmail.com"
              className="flex items-center space-x-2 text-gray-600 hover:text-bio-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </a>
            <a
              href="https://www.linkedin.com/in/serkan-turgut-9668b9237/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-bio-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500">
          <p>&copy; 2025 Serkan Turgut. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
