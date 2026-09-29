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

-- Blog Yazıları (Detaylı 6 Biyomedikal Makale)
DELETE FROM public.blog;
INSERT INTO public.blog (title, slug, excerpt, content, created_at) VALUES 
(
    'Biyomedikal Cihazlarda Kalibrasyon ve Metrolojik Doğrulama Standartları',
    'biyomedikal-cihazlarda-kalibrasyonun-onemi',
    'Tıbbi cihazların tanı ve tedavideki ölçüm doğruluğunu garanti altına alan kalibrasyon periyotları, uluslararası standartlar (IEC 62353) ve metrolojik test yöntemleri.',
    '<h2>Tıbbi Cihazlarda Kalibrasyon Neden Hayatidir?</h2><p>Hastanelerde teşhis ve tedavi süreçlerinde kullanılan biyomedikal cihazların ölçüm doğruluğu doğrudan insan hayatına etki eder. Bir infüzyon pompasının hastaya yanlış hızda ilaç vermesi veya hasta başı monitörünün hatalı SpO2/EKG parametresi okuması telafisi imkansız klinik sonuçlar doğurabilir.</p><h3>Kalibrasyon ve Doğrulama Arasındaki Kritik Fark</h3><p><strong>Kalibrasyon</strong>, doğruluğu uluslararası standartlara izlenebilir bir referans test cihazı (analizör) ile test edilen cihaz arasındaki sapmanın sayısal olarak tespit edilmesidir. <strong>Doğrulama (Verification)</strong> ise cihazın belirlenen tolerans limitleri içinde kalıp kalmadığının resmi olarak onaylanmasıdır.</p><h3>Uygulanan Temel Biyomedikal Güvenlik & Kalibrasyon Testleri</h3><ul><li><strong>Elektriksel Güvenlik Testleri (IEC 62353 / IEC 60601):</strong> Koruyucu topraklama direnci (Protective Earth Resistance), gövde kaçak akımı (Enclosure Leakage) ve hasta devresi kaçak akımı ölçümleri.</li><li><strong>İnfüzyon & Perfüzör Pompası Testleri:</strong> Akış debisi (ml/saat) doğrulaması, tıkanma (occlusion) basınç alarmları ve hava kabarcığı detektör testleri.</li><li><strong>Hasta Başı Monitörleri:</strong> NIBP manşon basınç sızıntı testi, EKG genlik/frekans doğrulaması, SpO2 optik dalga boyu simülasyonu ve vücut sıcaklığı kalibrasyonu.</li></ul><h3>Düzenli Kalibrasyonun Kazanımları</h3><p>Periyodik metrolojik kontroller cihazların arıza oranlarını %40 azaltırken, cihaz ömrünü uzatır ve sağlık kurumlarının uluslararası akreditasyon (JCI, Sağlıkta Kalite Standartları) süreçlerine tam uyum sağlar.</p>',
    NOW() - INTERVAL '3 days'
),
(
    'Yoğun Bakım Mekanik Ventilatörlerinin Çalışma Prensipleri ve Bakım Kılavuzu',
    'yogun-bakim-ventilatorleri-calisma-prensipleri',
    'Ventilatör solunum modları, pnömatik blok yapısı, akış sensörleri ve koruyucu periyodik teknik servis bakım aşamaları.',
    '<h2>Ventilatör Sistemlerinin Temel Mimarisi ve Solunum Döngüsü</h2><p>Mekanik ventilatörler, kendi kendine solunum yapamayan veya solunum yetmezliği çeken kritik hastalara oksijen ve medikal hava karışımını belirli basınç, hacim ve frekansta ileten hayati yaşam destek cihazlarıdır.</p><h3>Temel Solunum Modları</h3><ul><li><strong>VCV (Hacim Kontrollü Ventilasyon):</strong> Hastaya her solukta önceden belirlenen tidal hacim (Vt) verilir; tepe basıncı hastanın akciğer direncine göre değişkenlik gösterir.</li><li><strong>PCV (Basınç Kontrollü Ventilasyon):</strong> Belirlenen inspiratuar basınç seviyesi korunarak hava iletilir; tidal hacim akciğer kompliyansına bağlıdır.</li><li><strong>SIMV & CPAP/PSV:</strong> Hastanın spontan solunum çabalarını destekleyen, senkronize ve basınç destekli modlar.</li></ul><h3>Kritik Pnömatik ve Elektronik Bileşenler</h3><ul><li><strong>Gaz Mikseri (Blender / Oransal Valfler):</strong> %21 ile %100 arasında hassas FiO2 karışımı sağlar.</li><li><strong>Ekspirasyon Valfi & PEEP Mekanizması:</strong> Alveollerin sönmesini engellemek için soluk sonu pozitif basıncı (PEEP) milibar hassasiyetinde tutar.</li><li><strong>Akış (Flow) Sensörleri:</strong> Pneumotachograph, sıcak tel (hot-wire) veya ultrasonik sensörler ile hasta eforunu anlık milisaniye mertebesinde algılar.</li></ul><h3>Teknik Bakım ve Servis Prosedürleri</h3><p>Her periyodik bakımda oksijen hücresinin (O2 Cell) kimyasal ömrü kontrol edilmeli, dahili batarya deşarj testi yapılmalı, valf sızdırmazlık testleri ve yapay akciğer simülatörüyle basınç-hacim doğrulaması gerçekleştirilmelidir.</p>',
    NOW() - INTERVAL '10 days'
),
(
    'Anestezi Cihazları ve Gaz Dağıtım Sistemlerinde Güvenlik Protokolleri',
    'anestezi-cihazlari-gaz-dagitim-sistemleri-guvenlik',
    'Ameliyathane anestezi iş istasyonlarının bileşenleri, vaporizatör kalibrasyonu, absorber sistemleri ve kaçak testi protokolleri.',
    '<h2>Ameliyathane Anestezi İş İstasyonlarının Görevi</h2><p>Anestezi cihazları; cerrahi operasyon süresince hastanın uyutulması, ağrı hissetmemesi ve yaşamsal fonksiyonlarının stabil tutulmasını sağlayan gaz karışımı (O2, N2O, Medikal Hava ve Anestezik Ajanlar) ileten kombine sistemlerdir.</p><h3>Güvenlik Mekanizmaları ve Gaz Dağıtımı</h3><ul><li><strong>Pin-Index ve DISS Güvenlik Sistemi:</strong> Yanlış gaz tüpünün veya merkezi hortumun takılmasını mekanik tırnak farklarıyla imkansız hale getirir.</li><li><strong>Hipoksik Koruma Sistemi:</strong> Oksijen oranı %25''in altına düştüğünde N2O gaz akışını otomatik olarak kesen mekanik/pnömatik kilit.</li><li><strong>Vaporizatörler (Buharlaştırıcılar):</strong> Sıvı anestezik ajanları (Sevofluran, Desfluran, İzofluran) sıcaklık ve akış kompanzasyonuyla buharlaştırarak hassas konsantrasyonda (%) solunum devresine katar.</li></ul><h3>Periyodik Kontrol ve Devre Testi Aşamaları</h3><ol><li><strong>Yüksek ve Düşük Basınç Kaçak Testi (Leak Test):</strong> Devrede 30 cmH2O basınçta mikro düzeyde dahi kaçak olmaması şarttır.</li><li><strong>Karbondioksit Absorber (Soda-Lime) Kontrolü:</strong> Kimyasal renk değişimi ve tozlanma durumu izlenmeli, satüre olmuş kireç derhal değiştirilmelidir.</li><li><strong>Atık Gaz Tahliye Sistemi (AGSS):</strong> Ameliyathane personeline anestezik gaz sızıntısını önleyen aktif tahliye emiş gücü kontrol edilmelidir.</li></ol>',
    NOW() - INTERVAL '18 days'
),
(
    'Kardiyak Acillerde Defibrilatör Sistemleri ve Analizör Testleri',
    'defibrilator-test-prosedurleri-ve-guvenlik',
    'Bifazik defibrilatör dalga formları, senkronize kardiyoversiyon, harici pacemaker modları ve analizör testleri.',
    '<h2>Kardiyak Aritmilerde Defibrilasyonun Rolü</h2><p>Defibrilatörler, ventriküler fibrilasyon (VF) ve nabızsız ventriküler taşikardi (VT) gibi ölümcül kardiyak aritmilerde kalbe kontrollü bir elektrik şoku uygulayarak kalbin doğal elektriksel odağının yeniden devreye girmesini sağlar.</p><h3>Monofazik vs. Modern Bifazik Dalga Formları</h3><p>Geleneksel monofazik şoklar tek yönlü akım iletirken, modern <strong>Bifazik Truncated Exponential (BTE)</strong> dalga formları akımın yönünü tersine çevirerek çok daha düşük enerji seviyelerinde (150-200 Joule) daha yüksek defibrilasyon başarısı sunar ve miyokart dokusunda termal hasarı minimize eder.</p><h3>Defibrilatör Analizörü ile Yapılan Güvenlik Testleri</h3><ul><li><strong>Enerji Çıkış Doğruluğu:</strong> 50 Ohm standart insan vücut empedans yükünde seçilen enerji (örneğin 200J) ile cihazın aktardığı gerçek enerji arasındaki fark ±%10 sınırında olmalıdır.</li><li><strong>Şarj Süresi Testi:</strong> Cihazın şebeke ve batarya beslemesinde maksimum enerji seviyesine 10 saniyenin altında ulaşabildiği kronometrik olarak ölçülmelidir.</li><li><strong>Senkronize Kardiyoversiyon:</strong> EKG''deki R-dalgası tepesinden sonraki deşarj gecikme süresi 60 ms''yi aşmamalıdır.</li><li><strong>Harici Pacemaker (Pace) Modu:</strong> Dakikadaki atım sayısı (ppm) ve akım şiddeti (mA) dalga formu analizörü ile doğrulanır.</li></ul>',
    NOW() - INTERVAL '26 days'
),
(
    'Hemodiyaliz Cihazlarının Hidrolik ve Elektromekanik Mimarisi',
    'hemodiyaliz-cihazlari-hidrolik-ve-elektromekanik-mimari',
    'Diyalizat hazırlama, ultrafiltrasyon kontrolü, kan kaçağı dedektörleri ve hemodiyaliz makinelerinin hidrolik devre prensipleri.',
    '<h2>Hemodiyaliz Cihazının Temel Amacı</h2><p>Böbrek yetmezliği bulunan hastalarda vücutta biriken üre, kreatinin ve fazla sıvının yarı geçirgen bir membran (diyalizör) yardımıyla kandan uzaklaştırılması işlemidir.</p><h3>Hidrolik Devre ve Diyalizat Karışımı</h3><ul><li><strong>Saf Su Girişi & Isıtma:</strong> Reverse Osmosis (RO) sisteminden gelen saf su 36-37°C vücut sıcaklığına ısıtılır.</li><li><strong>Oransal Karışım (A & B Konsantreleri):</strong> Asit ve bikarbonat konsantreleri hassas dozaj pompalarıyla karıştırılır; iletkenlik (Conductivity) hücreleriyle iyon yoğunluğu anlık izlenir.</li><li><strong>Ultrafiltrasyon (UF) ve Kapalı Dengeleme Hücreleri:</strong> Hastadan çekilecek sıvı miktarı (UF oranı), balans odacıkları (balancing chambers) sayesinde mililitre hassasiyetinde kontrol edilir.</li></ul><h3>Hasta Güvenlik Devreleri</h3><ul><li><strong>Kan Kaçağı Dedektörü (Blood Leak Detector):</strong> Diyalizör liflerindeki mikro yırtıkları optik dalga boyu soğurmasıyla anında fark eder ve diyalizatı bypass moduna alır.</li><li><strong>Hava Dedektörü (Air Bubble Detector):</strong> Ultrasonik sensörler ile venöz k hatta 1 damla dahi hava kabarcığı geçişini engelleyerek hava embolisini önler.</li><li><strong>Venöz ve Arteriyel Basınç Sensörleri:</strong> Damar yolu basınç anomalilerinde kan pompasını derhal durdurur.</li></ul>',
    NOW() - INTERVAL '34 days'
),
(
    'Ameliyathane Cerrahi Cihazları: Elektrokoter ve Cerrahi Aspiratörlerin Bakımı',
    'ameliyathane-elektrokoter-ve-aspirator-bakim-dinamikleri',
    'Yüksek frekanslı elektrocerrahi üniteleri, monopolar/bipolar modlar, nötr plak güvenlik sistemleri ve cerrahi aspiratör bakımı.',
    '<h2>Elektrocerrahi (Koter) Sistemlerinin Fiziksel Prensibi</h2><p>Elektrokoter cihazları, 300 kHz ile 3 MHz arasındaki yüksek frekanslı alternatif akımı dokuya uygulayarak hücre içi sıvıyı aniden buharlaştırır (kesme / cut) veya proteinleri pıhtılaştırarak kanamayı durdurur (koagülasyon / coag).</p><h3>Monopolar ve Bipolar Çalışma Farkı</h3><ul><li><strong>Monopolar Mod:</strong> Akım aktif koter kaleminden geçer, hedef dokuda ısı oluşturur ve hastanın bacağına yapıştırılan geniş yüzeyli nötr plaktan (dönüş elektrodu) geri döner.</li><li><strong>Bipolar Mod:</strong> Akım yalnızca bipolar forsepsin iki ucu arasında mikro mesafede akar; nötr plak gerektirmez ve çevre dokulara minimum ısı yayılımı sağlar.</li></ul><h3>REM (Return Electrode Monitoring) Güvenlik Sistemi</h3><p>Nötr plağın hastanın cildinden kısmen ayrılması durumunda temas yüzeyi küçüleceği için yanık riski oluşur. REM devresi çift parçalı nötr plak arasındaki empedansı sürekli ölçerek cilt teması azaldığında akımı mikrosaniyeler içinde keser.</p><h3>Cerrahi Aspiratör Sistemlerinin Bakımı</h3><p>Ameliyat sahasındaki kan ve sıvıları uzaklaştıran cerrahi aspiratörlerde vakum regülatör testi, yağsız pistonlu pompa bakımı, taşma önleyici hidrofor şamandıra mekanizması ve HEPA/hidrofobik bakteri filtrelerinin düzenli değişimi enfeksiyon kontrolü için şarttır.</p>',
    NOW() - INTERVAL '42 days'
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
