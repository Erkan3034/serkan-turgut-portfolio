-- Supabase Database Schema for Serkan Turgut Portfolio
-- This script creates all necessary tables and sets up Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create about table (single row editable)
CREATE TABLE IF NOT EXISTS about (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog table
CREATE TABLE IF NOT EXISTS blog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    github_link TEXT,
    live_demo TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    issued_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cv_files table
CREATE TABLE IF NOT EXISTS cv_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for about table
CREATE POLICY "Public read access for about" ON about
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update about" ON about
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert about" ON about
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for blog table
CREATE POLICY "Public read access for blog" ON blog
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage blog" ON blog
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for projects table
CREATE POLICY "Public read access for projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for experience table
CREATE POLICY "Public read access for experience" ON experience
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage experience" ON experience
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for certificates table
CREATE POLICY "Public read access for certificates" ON certificates
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage certificates" ON certificates
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for cv_files table
CREATE POLICY "Public read access for cv_files" ON cv_files
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage cv_files" ON cv_files
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for messages table
CREATE POLICY "Public insert access for messages" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read messages" ON messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete messages" ON messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('images', 'images', true),
    ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Public read access for images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Storage policies for files bucket
CREATE POLICY "Public read access for files" ON storage.objects
    FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete files" ON storage.objects
    FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Insert default about content
INSERT INTO about (content) VALUES (
    '<h2>About Me</h2>
    <p>I am a passionate Biomedical Device Technology graduate with a strong foundation in medical device design, testing, and implementation. My education has equipped me with comprehensive knowledge of healthcare technology and regulatory standards.</p>
    
    <h3>Why Biomedical Technology?</h3>
    <p>I chose this field because I believe technology has the power to transform healthcare and improve patient outcomes. The intersection of engineering, medicine, and innovation fascinates me, and I want to be part of creating solutions that make a real difference in people''s lives.</p>
    
    <h3>My Goals</h3>
    <p>I am committed to contributing to the development of innovative medical devices that enhance patient care, improve diagnostic accuracy, and advance healthcare delivery. My goal is to work with forward-thinking companies that share my passion for healthcare innovation.</p>'
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON blog(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_experience_year ON experience(year);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_date ON certificates(issued_date);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_cv_files_uploaded_at ON cv_files(uploaded_at);
