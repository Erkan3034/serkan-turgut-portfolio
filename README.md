# Serkan Turgut Portfolio Website

A modern, responsive portfolio website for a Biomedical Device Technology graduate, built with Next.js 14, Supabase, and deployed on Netlify.

## 🚀 Features

- **Responsive Design**: Clean, biomedical-inspired UI that works on all devices
- **Dynamic Content**: All content managed through Supabase database
- **Admin Panel**: Secure content management system with authentication
- **File Management**: Upload and manage CV files, certificates, and project images
- **Blog System**: Create and manage blog posts with rich text editing
- **Contact Form**: Integrated contact form with message storage
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Deployment**: Netlify (Static Export)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel pages
│   │   ├── login/          # Admin authentication
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── blog/           # Blog management
│   │   ├── projects/       # Project management
│   │   ├── experience/     # Experience management
│   │   ├── certificates/   # Certificate management
│   │   ├── cv/             # CV management
│   │   └── about/          # About section management
│   ├── blog/               # Public blog pages
│   │   └── [slug]/         # Individual blog posts
│   ├── cv/                 # CV page
│   ├── experience/         # Experience page
│   ├── projects/           # Projects page
│   ├── certificates/       # Certificates page
│   ├── contact/            # Contact page
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── ui/                 # Shadcn UI components
│   └── layout/             # Layout components
├── lib/                    # Utility functions
│   ├── supabase.ts         # Supabase client & types
│   └── utils.ts            # Helper functions
└── supabase-schema.sql     # Database schema
```

## 🗄️ Database Schema

The application uses the following Supabase tables:

- **about**: Single row for about section content
- **blog**: Blog posts with title, content, slug, and cover image
- **projects**: Portfolio projects with descriptions, links, and images
- **experience**: Education and work experience entries
- **certificates**: Professional certificates and achievements
- **cv_files**: CV documents for download
- **messages**: Contact form submissions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Netlify account (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd serkan-turgut-portfolio
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Create storage buckets:
   - `images` (public) - for blog covers, project images
   - `files` (public) - for CV files, certificates
4. Set up authentication and create an admin user

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

## 🚀 Deployment on Netlify

### 1. Build Configuration

The project is configured for static export with `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
}
```

### 2. Netlify Settings

In your Netlify dashboard:

- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Deploy

1. Connect your GitHub repository to Netlify
2. Set the build settings as above
3. Add environment variables
4. Deploy!

## 🔐 Admin Panel

Access the admin panel at `/admin/login` with your Supabase credentials.

### Admin Features

- **Dashboard**: Overview of all content with statistics
- **Blog Management**: Create, edit, delete blog posts
- **Project Management**: Manage portfolio projects
- **Experience Management**: Add education and work experience
- **Certificate Management**: Upload and manage certificates
- **CV Management**: Upload CV files
- **About Management**: Edit the about section
- **Message Management**: View contact form submissions

## 📝 Content Management

### Adding Blog Posts

1. Go to Admin → Blog Management
2. Click "New Post"
3. Fill in title, content, and upload cover image
4. The slug is auto-generated from the title
5. Save and publish

### Managing Projects

1. Go to Admin → Project Management
2. Add project details, description, and links
3. Upload project image
4. Add relevant tags
5. Save

### Uploading Files

- **Images**: Uploaded to `images` bucket (public)
- **PDFs**: Uploaded to `files` bucket (public)
- Files are automatically processed and URLs are stored in database

## 🎨 Customization

### Colors

The biomedical-inspired color palette is defined in `tailwind.config.js`:

```javascript
colors: {
  bio: {
    primary: "#0077b6",
    secondary: "#00bfa5", 
    accent: "#f9f9f9",
    text: "#2c3e50",
    light: "#ecf0f1",
  }
}
```

### Fonts

The site uses Inter font family, configured in `app/layout.tsx`.

### Components

All UI components are built with Shadcn UI and can be customized in the `components/ui/` directory.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for content, authenticated write access for admin
- Contact form allows public inserts
- Admin authentication required for all management operations

## 📱 Responsive Design

The site is fully responsive with:
- Mobile-first design approach
- Responsive navigation with hamburger menu
- Optimized images and layouts for all screen sizes
- Touch-friendly interface elements

## 🚀 Performance

- Static site generation for fast loading
- Optimized images and assets
- Minimal JavaScript bundle
- CDN delivery through Netlify

## 📞 Support

For questions or issues:
- Check the documentation
- Review the Supabase setup
- Ensure all environment variables are set correctly
- Verify database schema is properly applied

## 📄 License

This project is for portfolio purposes. Please respect the intellectual property and don't use without permission.

---

**Built with ❤️ for Biomedical Device Technology professionals**
