import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      about: {
        Row: {
          id: string
          content: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          updated_at?: string
        }
      }
      blog: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          github_link: string | null
          live_demo: string | null
          image_url: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          github_link?: string | null
          live_demo?: string | null
          image_url?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          github_link?: string | null
          live_demo?: string | null
          image_url?: string | null
          tags?: string[]
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          title: string
          organization: string
          year: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          organization: string
          year: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          organization?: string
          year?: string
          description?: string
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          issued_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          issued_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          issued_date?: string | null
          created_at?: string
        }
      }
      cv_files: {
        Row: {
          id: string
          title: string
          file_url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          title: string
          file_url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          title?: string
          file_url?: string
          uploaded_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
      }
    }
  }
}
