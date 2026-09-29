-- =========================================================================
-- SERKAN TURGUT PORTFOLIO - SUPABASE VERİTABANI KURULUM VE VERİ YÜKLEME SCRIPTI
-- =========================================================================
-- Bu scripti Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" butonuna basınız.
-- =========================================================================

-- 1. UUID Eklentisini Etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLOLARI OLUŞTUR

-- About (Hakkımda) Tablosu
CREATE TABLE IF NOT EXISTS public.about (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience (Deneyim & Eğitim) Tablosu
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Projeler) Tablosu
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    github_link TEXT,
    live_demo TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog (Makaleler) Tablosu
CREATE TABLE IF NOT EXISTS public.blog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates (Sertifikalar) Tablosu
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT,
    description TEXT,
    file_url TEXT NOT NULL,
    issued_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV Files (Özgeçmiş Dosyaları) Tablosu
CREATE TABLE IF NOT EXISTS public.cv_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (İletişim Mesajları) Tablosu
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GÜVENLİK (ROW LEVEL SECURITY - RLS) ETKİNLEŞTİRME
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLİTİKALARI

-- About Politikaları
DROP POLICY IF EXISTS "Public read access for about" ON public.about;
CREATE POLICY "Public read access for about" ON public.about FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage about" ON public.about;
CREATE POLICY "Authenticated users can manage about" ON public.about FOR ALL USING (auth.role() = 'authenticated');

-- Experience Politikaları
DROP POLICY IF EXISTS "Public read access for experience" ON public.experience;
CREATE POLICY "Public read access for experience" ON public.experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage experience" ON public.experience;
CREATE POLICY "Authenticated users can manage experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');

-- Projects Politikaları
DROP POLICY IF EXISTS "Public read access for projects" ON public.projects;
CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- Blog Politikaları
DROP POLICY IF EXISTS "Public read access for blog" ON public.blog;
CREATE POLICY "Public read access for blog" ON public.blog FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage blog" ON public.blog;
CREATE POLICY "Authenticated users can manage blog" ON public.blog FOR ALL USING (auth.role() = 'authenticated');

-- Certificates Politikaları
DROP POLICY IF EXISTS "Public read access for certificates" ON public.certificates;
CREATE POLICY "Public read access for certificates" ON public.certificates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage certificates" ON public.certificates;
CREATE POLICY "Authenticated users can manage certificates" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');

-- CV Files Politikaları
DROP POLICY IF EXISTS "Public read access for cv_files" ON public.cv_files;
CREATE POLICY "Public read access for cv_files" ON public.cv_files FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage cv_files" ON public.cv_files;
CREATE POLICY "Authenticated users can manage cv_files" ON public.cv_files FOR ALL USING (auth.role() = 'authenticated');

-- Messages Politikaları
DROP POLICY IF EXISTS "Public insert access for messages" ON public.messages;
CREATE POLICY "Public insert access for messages" ON public.messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
CREATE POLICY "Authenticated users can read messages" ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.messages;
CREATE POLICY "Authenticated users can delete messages" ON public.messages FOR DELETE USING (auth.role() = 'authenticated');

-- 5. STORAGE BUCKET OLUŞTURMA
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('images', 'images', true),
    ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Politikaları (Images)
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
CREATE POLICY "Public read access for images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
DROP POLICY IF EXISTS "Authenticated users can manage images" ON storage.objects;
CREATE POLICY "Authenticated users can manage images" ON storage.objects FOR ALL USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Storage Politikaları (Files)
DROP POLICY IF EXISTS "Public read access for files" ON storage.objects;
CREATE POLICY "Public read access for files" ON storage.objects FOR SELECT USING (bucket_id = 'files');
DROP POLICY IF EXISTS "Authenticated users can manage files" ON storage.objects;
CREATE POLICY "Authenticated users can manage files" ON storage.objects FOR ALL USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- =========================================================================
-- 6. VERİLERİ DOLDURMA (DATA SEEDING)
-- =========================================================================

-- Hakkımda Metni
DELETE FROM public.about;
INSERT INTO public.about (content) VALUES (
    '<h2>Serkan Turgut - Biyomedikal Cihaz Teknikeri</h2>
    <p>Biyomedikal cihazların bakım, onarım, kalibrasyon ve arıza tespiti alanında deneyime sahip Biyomedikal Teknikeri. Ventilatör cihazları, Elektrokardiyografi (EKG) cihazları, hasta başı monitörleri, anestezi cihazları ve klinik enstrümantasyon üzerinde periyodik/önleyici bakım, arıza analizi, kalibrasyon ve fonksiyonel kontrol süreçlerini yürütür.</p>
    
    <h3>Uzmanlık ve Yaklaşım</h3>
    <p>Klinik ekipler ve teknik birimlerle koordineli çalışarak teknik problemleri sistematik biçimde analiz eder ve kalıcı çözümler üretir. Sağlık teknolojilerinde hasta güvenliğini ve cihaz güvenilirliğini en üst düzeyde tutmayı ilke edinmiştir.</p>
    
    <h3>Temel Yetkinlikler</h3>
    <ul>
      <li>Mekanik Ventilatör Cihazları (Biyovent vb.) Periyodik Bakım ve Onarımı</li>
      <li>EKG ve Hasta Başı Monitör Sistemleri</li>
      <li>Tıbbi Cihaz Kalibrasyonu ve Fonksiyonel Doğrulama Testleri</li>
      <li>Klinik Enstrümantasyon ve Arıza Tespiti</li>
      <li>Hastane Biyomedikal Birim Koordinasyonu</li>
    </ul>'
);

-- Deneyim ve Eğitim Kayıtları (CV''den Alınan)
DELETE FROM public.experience;
INSERT INTO public.experience (title, organization, year, description, created_at) VALUES 
(
    'Biyomedikal Cihaz Teknikeri',
    'Teknomedikal',
    '2025 - Devam Ediyor',
    'Sahada ve teknik serviste tıbbi cihazların (özellikle Biyovent mekanik ventilatör cihazları) periyodik bakım ve arıza tespit süreçlerinin yürütülmesi. Müşteri kurumlardan (hastane, klinik) gelen arıza taleplerine teknik destek ve yerinde müdahale sağlanması. Kalibrasyon ölçümlerinin gerçekleştirilip teknik servis raporları halinde dokümante edilmesi. Yedek parça ve servis süreçlerinin tedarikçi firmalarla koordinasyonu.',
    NOW() - INTERVAL '1 month'
),
(
    'Biyomedikal Cihaz Teknikeri Stajyeri',
    'Prof. Dr. Lütfi Kırdar Şehir Hastanesi',
    '2025',
    'Hastane biyomedikal mühendislik biriminde tıbbi cihazların rutin kontrol, periyodik bakım ve arıza analiz süreçlerine aktif katılım. Sterilizasyon ve enfeksiyon kontrol protokollerine uygun cihaz hazırlığı. Klinik personel ile teknik birim arasındaki arıza bildirim koordinasyonuna destek.',
    NOW() - INTERVAL '3 months'
),
(
    'Biyomedikal Cihaz Teknolojisi',
    'İstanbul Gedik Üniversitesi',
    '2023',
    'Tıbbi cihaz teknolojisi, fizyolojik sinyal izleme, tıbbi enstrümantasyon, devre analizi, mikrodenetleyiciler ve kalibrasyon ilkeleri üzerine teorik ve uygulamalı önlisans eğitimi.',
    NOW() - INTERVAL '1 year'
),
(
    'İşletme Müdürü',
    'Yulaf Restaurant',
    '2018 - 2022',
    'Günlük operasyon yönetimi, personel koordinasyonu, bütçe ve tedarik süreçlerinin uçtan uca yönetilmesi. Müşteri memnuniyeti ve süreç optimizasyonu.',
    NOW() - INTERVAL '2 years'
),
(
    'Yabancı Dil Eğitimi (İngilizce B1)',
    'English Time Dil Okulları',
    '2017',
    'Genel İngilizce dil eğitimi ve mesleki teknik biyomedikal terminoloji.',
    NOW() - INTERVAL '3 years'
);

-- Projeler
DELETE FROM public.projects;
INSERT INTO public.projects (title, description, tags, github_link, created_at) VALUES 
(
    'Hasta Başı Monitör Kalibrasyon ve Test İstasyonu',
    'Yoğun bakım ve acil servis hasta başı monitörlerinin EKG, NIBP, SpO2 ve solunum parametrelerinin kalibrasyon doğruluk testlerini simüle eden ve raporlayan taşınabilir test prototipi.',
    ARRAY['Biyomedikal Kalibrasyon', 'EKG Simülatörü', 'SpO2 Testi', 'Sağlık Güvenliği'],
    'https://github.com/Erkan3034',
    NOW() - INTERVAL '10 days'
),
(
    'Mikrodenetleyici Tabanlı Kablosuz EKG Telemetri Cihazı',
    'AD8232 analog ön uç devresi ve ESP32 mikrodenetleyici kullanılarak geliştirilen 3-kanallı kablosuz EKG telemetri sistemi. Hastanın kardiyak sinyallerini gerçek zamanlı web arayüzüne aktarır.',
    ARRAY['ESP32', 'AD8232', 'Biyomedikal Sensörler', 'IoT', 'C++'],
    'https://github.com/Erkan3034',
    NOW() - INTERVAL '20 days'
),
(
    'Ventilatör ve Solunum Devresi Akış Sensörü Analizörü',
    'Mekanik ventilatörlerin tidal hacim, tepe inspiratuar basınç (PIP) ve PEEP değerlerini yüksek hassasiyetli diferansiyel basınç sensörleriyle ölçen akış analiz sistemi.',
    ARRAY['Ventilatör', 'Solunum Mekaniği', 'Basınç Sensörleri', 'Kalite Kontrol'],
    'https://github.com/Erkan3034',
    NOW() - INTERVAL '30 days'
),
(
    'Yenidoğan Kuvözü Sıcaklık & Nem Akıllı Kontrol Ünitesi',
    'Yenidoğan yoğun bakım kuvözlerinde optimum mikro çevre koşullarını sağlayan, PID sıcaklık ve nem denetleyici algoritmasına sahip güvenli alarm sistemi.',
    ARRAY['Yenidoğan Kuvözü', 'PID Kontrol', 'Sensör Entegrasyonu', 'Otomasyon'],
    'https://github.com/Erkan3034',
    NOW() - INTERVAL '45 days'
),
(
    'Tıbbi Cihaz Envanter ve Periyodik Bakım Takip Sistemi',
    'Hastanelerdeki biyomedikal cihazların bakım, kalibrasyon periyotları, arıza kayıtları ve parça değişim süreçlerini barkod/karekod ile yöneten dijital takip platformu.',
    ARRAY['Tıbbi Cihaz Yönetimi', 'Envanter', 'Veritabanı', 'Python', 'Web'],
    'https://github.com/Erkan3034',
    NOW() - INTERVAL '60 days'
);

-- Blog Yazıları
DELETE FROM public.blog;
INSERT INTO public.blog (title, slug, excerpt, content, created_at) VALUES 
(
    'Biyomedikal Cihazlarda Kalibrasyonun Hayati Önemi ve Standartlar',
    'biyomedikal-cihazlarda-kalibrasyonun-onemi',
    'Tıbbi cihazların doğru ve güvenilir ölçüm yapabilmesi için kalibrasyon periyotları, uluslararası standartlar ve klinik doğruluk kriterleri.',
    '<h2>Tıbbi Cihazlarda Kalibrasyon Neden Hayatidir?</h2><p>Hastanelerde teşhis ve tedavi süreçlerinde kullanılan biyomedikal cihazların ölçüm doğruluğu, hasta hayatıyla doğrudan ilişkilidir. Bir infüzyon pompasının yanlış doz vermesi veya hasta başı monitörünün hatalı SpO2 değeri göstermesi kritik sonuçlar doğurabilir.</p><h3>Kalibrasyon ve Doğrulama Arasındaki Fark</h3><p>Kalibrasyon, doğruluğu bilinen bir referans standart cihaz ile test edilen cihaz arasındaki sapmanın belirlenmesi işlemidir. Belirlenen sapma sınır değerleri aştığında cihazın ayarlanması veya servise alınması gerekir.</p><h3>Temel Kalibrasyon Parametreleri</h3><ul><li><strong>Elektriksel Güvenlik Testleri:</strong> IEC 62353 ve IEC 60601 standartlarına göre gövde kaçak akımı ve toprak sürekliliği ölçümleri.</li><li><strong>Defibrilatör Enerji Çıkış Testi:</strong> Joules cinsinden verilen enerjinin nominal değerle uyumu.</li><li><strong>Elektrokoter Çıkış Gücü ve HF Kaçak Testleri:</strong> Monopolar ve bipolar cerrahi kesme güçlerinin doğrulanması.</li></ul>',
    NOW() - INTERVAL '5 days'
),
(
    'Yoğun Bakım Ventilatörlerinin Çalışma Prensipleri ve Bakım İpuçları',
    'yogun-bakim-ventilatorleri-calisma-prensipleri',
    'Ventilatör modları, solunum parametreleri, flow sensörleri ve koruyucu periyodik bakım adımları hakkında teknik rehber.',
    '<h2>Ventilatör Sistemlerinin Temel Mimarisi</h2><p>Mekanik ventilatörler, kendi kendine yeterli solunum yapamayan hastalara hava ve oksijen karışımını belirlenen basınç ve hacim parametreleriyle sunan ileri düzey yaşam destek sistemleridir.</p><h3>Ana Bileşenler</h3><ul><li><strong>Gaz Karıştırıcı (Blender):</strong> Medikal hava ve %100 O2 gazlarını FiO2 oranına göre homojen karıştırır.</li><li><strong>Ekspirasyon Valfi & PEEP Kontrolü:</strong> Akciğerlerin sönmesini önlemek için son ekspiratuar pozitif basıncı (PEEP) ayarlar.</li><li><strong>Akış ve Basınç Sensörleri:</strong> İnspiratuar ve ekspiratuar akışları anlık milisaniye hassasiyetle ölçer.</li></ul>',
    NOW() - INTERVAL '15 days'
),
(
    'Sağlık Teknolojilerinde Nesnelerin İnterneti (IoT) ve Telemetri',
    'saglikta-iot-ve-telemetri-uygulamalari',
    'Giyilebilir biyomedikal sensörler ve kablosuz telemetri sistemleri ile uzaktan hasta takibinin geleceği.',
    '<h2>Akıllı Sağlık ve Kablosuz Biyomedikal Cihazlar</h2><p>Geleneksel kablolu hasta takip sistemleri yerini kablosuz, düşük güç tüketen ve sürekli veri ileten IoT tabanlı telemetri ağlarına bırakıyor.</p><h3>Telemetri Sistemlerinin Avantajları</h3><p>Hastanın yatağa bağımlı kalmadan servis içinde güvenle hareket edebilmesini sağlarken, aritmileri ve vital bulgu değişimlerini merkezi hemşire istasyonuna anında iletir.</p>',
    NOW() - INTERVAL '25 days'
),
(
    'Defibrilatör Cihazlarının Test Prosedürleri ve Güvenlik Protokolleri',
    'defibrilator-test-prosedurleri-ve-guvenlik',
    'Bifazik defibrilatör dalga formları, senkronize kardiyoversiyon testleri ve analizör kullanımı.',
    '<h2>Kardiyak Acillerde Defibrilatör Güvenilirliği</h2><p>Defibrilatörler, ventriküler fibrilasyon gibi ölümcül aritmilerde kalbe kontrollü elektrik şoku vererek normal ritmi yeniden başlatan cihazlardır.</p><h3>Monofazik vs. Bifazik Dalga Formları</h3><p>Modern bifazik defibrilatörler daha düşük enerji (150-200 Joule) ile daha yüksek başarı oranı sunar ve miyokardiyal hasarı en aza indirir.</p>',
    NOW() - INTERVAL '35 days'
),
(
    'Tıbbi Görüntüleme Cihazlarında Periyodik Bakım ve Kalite Kontrolü',
    'tibbi-goruntuleme-periyodik-bakim-rehberi',
    'Ultrason, Röntgen ve Tomografi sistemlerinde görüntü kalitesi, prob bakımı ve radyasyon güvenliği.',
    '<h2>Görüntüleme Teknolojilerinde Bakım Disiplini</h2><p>Radyoloji departmanındaki ultrason, dijital röntgen ve floroskopi sistemleri yüksek hassasiyet gerektiren optoelektronik ve akustik bileşenlerden oluşur.</p><h3>Ultrason Prob Bakımı</h3><p>Piezoelektrik kristal yapısının hasar görmemesi için probların düzenli olarak doku eşdeğeri fantomlar üzerinde test edilmesi gerekir.</p>',
    NOW() - INTERVAL '45 days'
);

-- CV Dosyası Referansı
DELETE FROM public.cv_files;
INSERT INTO public.cv_files (title, file_url, uploaded_at) VALUES 
('Serkan Turgut - Biyomedikal Cihaz Teknikeri Özgeçmiş', '/Serkan_Turgut_CV.pdf', NOW());

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog(slug);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON public.blog(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_experience_year ON public.experience(year);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_date ON public.certificates(issued_date);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_cv_files_uploaded_at ON public.cv_files(uploaded_at);
