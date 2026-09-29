import { Database } from './supabase'

export type Project = Database['public']['Tables']['projects']['Row']
export type Blog = Database['public']['Tables']['blog']['Row']
export type Experience = Database['public']['Tables']['experience']['Row']

export const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    title: 'Biyomedikal Cihaz Teknikeri',
    organization: 'Teknomedikal',
    year: '2025 - Devam Ediyor',
    description: 'Sahada ve teknik serviste tıbbi cihazların (özellikle Biyovent mekanik ventilatör cihazları) periyodik bakım ve arıza tespit süreçlerinin yürütülmesi. Müşteri kurumlardan (hastane, klinik) gelen arıza taleplerine teknik destek ve yerinde müdahale sağlanması. Kalibrasyon ölçümlerinin gerçekleştirilip teknik servis raporları halinde dokümante edilmesi. Yedek parça ve servis süreçlerinin tedarikçi firmalarla koordinasyonu.',
    created_at: '2025-10-01T00:00:00Z',
  },
  {
    id: 'exp-2',
    title: 'Biyomedikal Cihaz Teknikeri Stajyeri',
    organization: 'Prof. Dr. Lütfi Kırdar Şehir Hastanesi',
    year: '2025',
    description: 'Hastane biyomedikal mühendislik biriminde tıbbi cihazların rutin kontrol, periyodik bakım ve arıza analiz süreçlerine aktif katılım. Sterilizasyon ve enfeksiyon kontrol protokollerine uygun cihaz hazırlığı. Klinik personel ile teknik birim arasındaki arıza bildirim koordinasyonuna destek.',
    created_at: '2025-05-01T00:00:00Z',
  },
  {
    id: 'exp-3',
    title: 'Biyomedikal Cihaz Teknolojisi',
    organization: 'İstanbul Gedik Üniversitesi',
    year: '2023',
    description: 'Tıbbi cihaz teknolojisi, fizyolojik sinyal izleme, tıbbi enstrümantasyon, devre analizi, mikrodenetleyiciler ve kalibrasyon ilkeleri üzerine teorik ve uygulamalı önlisans eğitimi.',
    created_at: '2023-06-01T00:00:00Z',
  },
  {
    id: 'exp-4',
    title: 'İşletme Müdürü',
    organization: 'Yulaf Restaurant',
    year: '2018 - 2022',
    description: 'Günlük operasyon yönetimi, personel koordinasyonu, bütçe ve tedarik süreçlerinin uçtan uca yönetilmesi. Müşteri memnuniyeti ve süreç optimizasyonu.',
    created_at: '2022-01-01T00:00:00Z',
  },
  {
    id: 'exp-5',
    title: 'Yabancı Dil Eğitimi (İngilizce B1)',
    organization: 'English Time Dil Okulları',
    year: '2017',
    description: 'Genel İngilizce dil eğitimi ve mesleki teknik biyomedikal terminoloji.',
    created_at: '2017-06-01T00:00:00Z',
  },
]

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-proj-1',
    title: 'Hasta Başı Monitör Kalibrasyon ve Test İstasyonu',
    description: 'Yoğun bakım ve acil servis hasta başı monitörlerinin EKG, NIBP, SpO2 ve solunum parametrelerinin kalibrasyon doğruluk testlerini simüle eden ve raporlayan taşınabilir test prototipi.',
    tags: ['Biyomedikal Kalibrasyon', 'EKG Simülatörü', 'SpO2 Testi', 'Sağlık Güvenliği'],
    github_link: 'https://github.com/Erkan3034',
    live_demo: null,
    image_url: null,
    created_at: '2025-10-15T10:00:00Z',
  },
  {
    id: 'fallback-proj-2',
    title: 'Mikrodenetleyici Tabanlı Kablosuz EKG Telemetri Cihazı',
    description: 'AD8232 analog ön uç devresi ve ESP32 mikrodenetleyici kullanılarak geliştirilen 3-kanallı kablosuz EKG telemetri sistemi. Hastanın kardiyak sinyallerini gerçek zamanlı web arayüzüne aktarır.',
    tags: ['ESP32', 'AD8232', 'Biyomedikal Sensörler', 'IoT', 'C++'],
    github_link: 'https://github.com/Erkan3034',
    live_demo: null,
    image_url: null,
    created_at: '2025-09-20T14:30:00Z',
  },
  {
    id: 'fallback-proj-3',
    title: 'Ventilatör ve Solunum Devresi Akış Sensörü Analizörü',
    description: 'Mekanik ventilatörlerin tidal hacim, tepe inspiratuar basınç (PIP) ve PEEP değerlerini yüksek hassasiyetli diferansiyel basınç sensörleriyle ölçen akış analiz sistemi.',
    tags: ['Ventilatör', 'Solunum Mekaniği', 'Basınç Sensörleri', 'Kalite Kontrol'],
    github_link: 'https://github.com/Erkan3034',
    live_demo: null,
    image_url: null,
    created_at: '2025-08-10T09:15:00Z',
  },
  {
    id: 'fallback-proj-4',
    title: 'Yenidoğan Kuvözü Sıcaklık & Nem Akıllı Kontrol Ünitesi',
    description: 'Yenidoğan yoğun bakım kuvözlerinde optimum mikro çevre koşullarını sağlayan, PID sıcaklık ve nem denetleyici algoritmasına sahip güvenli alarm sistemi.',
    tags: ['Yenidoğan Kuvözü', 'PID Kontrol', 'Sensör Entegrasyonu', 'Otomasyon'],
    github_link: 'https://github.com/Erkan3034',
    live_demo: null,
    image_url: null,
    created_at: '2025-07-05T16:00:00Z',
  },
  {
    id: 'fallback-proj-5',
    title: 'Tıbbi Cihaz Envanter ve Periyodik Bakım Takip Sistemi',
    description: 'Hastanelerdeki biyomedikal cihazların bakım, kalibrasyon periyotları, arıza kayıtları ve parça değişim süreçlerini barkod/karekod ile yöneten dijital takip platformu.',
    tags: ['Tıbbi Cihaz Yönetimi', 'Envanter', 'Veritabanı', 'Python', 'Web'],
    github_link: 'https://github.com/Erkan3034',
    live_demo: null,
    image_url: null,
    created_at: '2025-06-12T11:45:00Z',
  },
]

export const FALLBACK_BLOGS: Blog[] = [
  {
    id: 'fallback-blog-1',
    title: 'Biyomedikal Cihazlarda Kalibrasyonun Hayati Önemi ve Standartlar',
    slug: 'biyomedikal-cihazlarda-kalibrasyonun-onemi',
    excerpt: 'Tıbbi cihazların doğru ve güvenilir ölçüm yapabilmesi için kalibrasyon periyotları, uluslararası standartlar ve klinik doğruluk kriterleri.',
    content: `
      <h2>Tıbbi Cihazlarda Kalibrasyon Neden Hayatidir?</h2>
      <p>Hastanelerde teşhis ve tedavi süreçlerinde kullanılan biyomedikal cihazların ölçüm doğruluğu, hasta hayatıyla doğrudan ilişkilidir. Bir infüzyon pompasının yanlış doz vermesi veya hasta başı monitörünün hatalı SpO2 değeri göstermesi kritik sonuçlar doğurabilir.</p>
      
      <h3>Kalibrasyon ve Doğrulama Arasındaki Fark</h3>
      <p>Kalibrasyon, doğruluğu bilinen bir referans standart cihaz ile test edilen cihaz arasındaki sapmanın belirlenmesi işlemidir. Belirlenen sapma sınır değerleri aştığında cihazın ayarlanması veya servise alınması gerekir.</p>
      
      <h3>Temel Kalibrasyon Parametreleri</h3>
      <ul>
        <li><strong>Elektriksel Güvenlik Testleri:</strong> IEC 62353 ve IEC 60601 standartlarına göre gövde kaçak akımı ve toprak sürekliliği ölçümleri.</li>
        <li><strong>Defibrilatör Enerji Çıkış Testi:</strong> Joules cinsinden verilen enerjinin nominal değerle uyumu.</li>
        <li><strong>Elektrokoter Çıkış Gücü ve HF Kaçak Testleri:</strong> Monopolar ve bipolar cerrahi kesme güçlerinin doğrulanması.</li>
      </ul>
      
      <p>Düzenli kalibrasyon periyotları yalnızca yasal bir zorunluluk değil, aynı zamanda hasta güvenliğinin en temel teminatıdır.</p>
    `,
    cover_image: null,
    created_at: '2025-10-18T09:00:00Z',
  },
  {
    id: 'fallback-blog-2',
    title: 'Yoğun Bakım Ventilatörlerinin Çalışma Prensipleri ve Bakım İpuçları',
    slug: 'yogun-bakim-ventilatorleri-calisma-prensipleri',
    excerpt: 'Ventilatör modları, solunum parametreleri, flow sensörleri ve koruyucu periyodik bakım adımları hakkında teknik rehber.',
    content: `
      <h2>Ventilatör Sistemlerinin Temel Mimarisi</h2>
      <p>Mekanik ventilatörler, kendi kendine yeterli solunum yapamayan hastalara hava ve oksijen karışımını belirlenen basınç ve hacim parametreleriyle sunan ileri düzey yaşam destek sistemleridir.</p>
      
      <h3>Ana Bileşenler</h3>
      <ul>
        <li><strong>Gaz Karıştırıcı (Blender):</strong> Medikal hava ve %100 O2 gazlarını FiO2 oranına göre homojen karıştırır.</li>
        <li><strong>Ekspirasyon Valfi & PEEP Kontrolü:</strong> Akciğerlerin sönmesini önlemek için son ekspiratuar pozitif basıncı (PEEP) ayarlar.</li>
        <li><strong>Akış ve Basınç Sensörleri:</strong> İnspiratuar ve ekspiratuar akışları anlık milisaniye hassasiyetle ölçer.</li>
      </ul>

      <h3>Periyodik Bakımda Dikkat Edilmesi Gerekenler</h3>
      <p>Oksijen hücrelerinin (O2 Cell) kimyasal ömür takibi, valf membranlarının sterilizasyon sonrası sızdırmazlık testleri ve dahili batarya kalibrasyonu her bakım döngüsünde eksiksiz yapılmalıdır.</p>
    `,
    cover_image: null,
    created_at: '2025-09-25T11:30:00Z',
  },
  {
    id: 'fallback-blog-3',
    title: 'Sağlık Teknolojilerinde Nesnelerin İnterneti (IoT) ve Telemetri',
    slug: 'saglikta-iot-ve-telemetri-uygulamalari',
    excerpt: 'Giyilebilir biyomedikal sensörler ve kablosuz telemetri sistemleri ile uzaktan hasta takibinin geleceği.',
    content: `
      <h2>Akıllı Sağlık ve Kablosuz Biyomedikal Cihazlar</h2>
      <p>Geleneksel kablolu hasta takip sistemleri yerini kablosuz, düşük güç tüketen ve sürekli veri ileten IoT tabanlı telemetri ağlarına bırakıyor.</p>
      
      <h3>Telemetri Sistemlerinin Avantajları</h3>
      <p>Hastanın yatağa bağımlı kalmadan servis içinde güvenle hareket edebilmesini sağlarken, aritmileri ve vital bulgu değişimlerini merkezi hemşire istasyonuna anında iletir.</p>
      
      <h3>Kullanılan İletişim Protokolleri</h3>
      <ul>
        <li><strong>BLE (Bluetooth Low Energy):</strong> Düşük enerjiyle kesintisiz EKG ve nabız iletimi.</li>
        <li><strong>Wi-Fi & MQTT:</strong> Hastane içi intranet üzerinden yüksek veri güvenliğiyle merkezi sunucuya aktarım.</li>
        <li><strong>Zigbee:</strong> Geniş alanlı sensör ağı dağıtımı.</li>
      </ul>
    `,
    cover_image: null,
    created_at: '2025-08-30T15:00:00Z',
  },
  {
    id: 'fallback-blog-4',
    title: 'Defibrilatör Cihazlarının Test Prosedürleri ve Güvenlik Protokolleri',
    slug: 'defibrilator-test-prosedurleri-ve-guvenlik',
    excerpt: 'Bifazik defibrilatör dalga formları, senkronize kardiyoversiyon testleri ve analizör kullanımı.',
    content: `
      <h2>Kardiyak Acillerde Defibrilatör Güvenilirliği</h2>
      <p>Defibrilatörler, ventriküler fibrilasyon gibi ölümcül aritmilerde kalbe kontrollü elektrik şoku vererek normal ritmi yeniden başlatan cihazlardır.</p>
      
      <h3>Monofazik vs. Bifazik Dalga Formları</h3>
      <p>Modern bifazik defibrilatörler daha düşük enerji (150-200 Joule) ile daha yüksek başarı oranı sunar ve miyokardiyal hasarı en aza indirir.</p>
      
      <h3>Analizör ile Yapılan Test Aşamaları</h3>
      <ol>
        <li>50 Ohm standart simüle direnç yükünde enerji doğruluğu testi.</li>
        <li>Şarj süresi testi (maksimum enerjiye 10 saniyenin altında ulaşma kontrolü).</li>
        <li>Senkronize modda R-dalgası gecikme süresinin (en fazla 60 ms) ölçümü.</li>
      </ol>
    `,
    cover_image: null,
    created_at: '2025-07-22T13:45:00Z',
  },
  {
    id: 'fallback-blog-5',
    title: 'Tıbbi Görüntüleme Cihazlarında Periyodik Bakım ve Kalite Kontrolü',
    slug: 'tibbi-goruntuleme-periyodik-bakim-rehberi',
    excerpt: 'Ultrason, Röntgen ve Tomografi sistemlerinde görüntü kalitesi, prob bakımı ve radyasyon güvenliği.',
    content: `
      <h2>Görüntüleme Teknolojilerinde Bakım Disiplini</h2>
      <p>Radyoloji departmanındaki ultrason, dijital röntgen ve floroskopi sistemleri yüksek hassasiyet gerektiren optoelektronik ve akustik bileşenlerden oluşur.</p>
      
      <h3>Ultrason Prob Bakımı ve Fantom Testleri</h3>
      <p>Piezoelektrik kristal yapısının hasar görmemesi için probların düzenli olarak doku eşdeğeri fantomlar üzerinde lateral çözünürlük ve derinlik penetrasyon testlerine tabi tutulması gerekir.</p>
      
      <h3>X-Işını Cihazlarında Kalite Güvencesi</h3>
      <p>kVp doğruluğu, mAs lineerliği, kolimasyon alanı hizalaması ve tüp sızıntı radyasyonu kontrolleri radyasyon güvenliği açısından periyodik olarak belgelenmelidir.</p>
    `,
    cover_image: null,
    created_at: '2025-06-18T10:20:00Z',
  },
]
