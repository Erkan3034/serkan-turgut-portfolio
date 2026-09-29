import { Database } from './supabase'

export type Project = Database['public']['Tables']['projects']['Row']
export type Blog = Database['public']['Tables']['blog']['Row']
export type Experience = Database['public']['Tables']['experience']['Row']
export type About = Database['public']['Tables']['about']['Row']

export const FALLBACK_ABOUT: About = {
  id: 'about-default',
  content: `
    <h3>Biyomedikal Cihaz Teknolojisinde Güvenilir ve Çözüm Odaklı Yaklaşım</h3>
    <p>Biyomedikal cihazların bakım, onarım, kalibrasyon ve arıza tespiti alanında 2 yılı aşkın saha ve teknik servis deneyimine sahip <strong>Biyomedikal Cihaz Teknikeri</strong>yim. Sağlık sektöründe hasta hayatının ve klinik süreçlerin doğrudan bağlı olduğu kritik medikal cihazların kesintisiz, güvenli ve yüksek hassasiyetle çalışmasını sağlamaya odaklanıyorum.</p>
    
    <h3>Uzmanlık ve Yetkinlik Alanlarım</h3>
    <p>Özellikle <strong>Mekanik Ventilatörler (Biyovent vb.)</strong>, <strong>Elektrokardiyografi (EKG) cihazları</strong>, <strong>Hasta Başı Monitörleri</strong>, <strong>Anestezi Sistemleri</strong> ve genel klinik enstrümantasyon üzerinde periyodik/önleyici bakım, arıza analizi, kalibrasyon doğruluk ölçümleri ve fonksiyonel kontrol süreçlerini titizlikle yürütüyorum.</p>
    
    <h3>Çalışma İlkelerim</h3>
    <ul>
      <li><strong>Sistematik Arıza Analizi:</strong> Arıza durumlarında hızlı müdahale, kök neden analizi ve kalıcı teknik çözümler üretme.</li>
      <li><strong>Kalite ve Standartlara Uyum:</strong> Uluslararası medikal güvenlik ve kalibrasyon standartlarına uygun periyodik kontrol ve eksiksiz teknik servis raporlaması.</li>
      <li><strong>Klinik & Teknik Koordinasyon:</strong> Hekimler, hemşireler, hastane biyomedikal mühendislik birimleri ve tedarikçi firmalar arasında kesintisiz ve yapıcı iletişim.</li>
    </ul>
    
    <p>Hedefim; sürekli gelişen sağlık teknolojilerini yakından takip ederek, biyomedikal mühendislik ve teknik servis alanında sağlık kuruluşlarına ve medikal teknoloji firmalarına değer katmaktır.</p>
  `,
  updated_at: '2025-10-20T00:00:00Z',
}

export const FALLBACK_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    title: 'Biyomedikal Cihaz Teknikeri',
    organization: 'Teknomedikal',
    year: '2025 - Devam Ediyor',
    description: 'Sahada ve teknik serviste tıbbi cihazların (özellikle Biyovent mekanik ventilatör sistemleri) periyodik koruyucu bakımı ve arıza tespit süreçlerinin yürütülmesi. Müşteri kurumlardan (hastane, tıp merkezi, klinik) gelen teknik destek taleplerine yerinde hızlı müdahale. Kalibrasyon ve fonksiyonel testlerin gerçekleştirilip teknik servis formlarının eksiksiz raporlanması. Yedek parça ve tedarikçi koordinasyonu.',
    created_at: '2025-10-01T00:00:00Z',
  },
  {
    id: 'exp-2',
    title: 'Biyomedikal Cihaz Teknikeri Stajyeri',
    organization: 'Prof. Dr. Lütfi Kırdar Şehir Hastanesi',
    year: '2025',
    description: 'Hastane biyomedikal mühendislik birimi bünyesinde hasta başı monitörleri, EKG, defibrilatör ve infüzyon pompalarının rutin periyodik kontrollerine ve arıza analiz süreçlerine katılım. Medikal cihaz sterilizasyon ve enfeksiyon kontrol protokollerine uygun hazırlık süreçleri. Klinik personel ile teknik servis arasındaki arıza bildirim ve kayıt akışının yönetilmesi.',
    created_at: '2025-05-01T00:00:00Z',
  },
  {
    id: 'exp-3',
    title: 'Biyomedikal Cihaz Teknolojisi (Önlisans)',
    organization: 'İstanbul Gedik Üniversitesi',
    year: '2023',
    description: 'Biyomedikal cihaz teknolojisi, tıbbi enstrümantasyon, fizyolojik sinyal izleme, elektronik devre analizi, mikrodenetleyiciler ve tıbbi kalibrasyon standartları üzerine teorik ve laboratuvar uygulamalı eğitimi.',
    created_at: '2023-06-01T00:00:00Z',
  },
  {
    id: 'exp-4',
    title: 'İşletme Müdürü',
    organization: 'Yulaf Restaurant',
    year: '2018 - 2022',
    description: 'Günlük operasyonel süreçlerin, personel koordinasyonunun, bütçe ve tedarik zincirinin uçtan uca yönetilmesi. Müşteri memnuniyeti ve kriz anlarında hızlı problem çözme deneyimi.',
    created_at: '2022-01-01T00:00:00Z',
  },
  {
    id: 'exp-5',
    title: 'Yabancı Dil Eğitimi (İngilizce B1)',
    organization: 'English Time Dil Okulları',
    year: '2017',
    description: 'Genel İngilizce dil eğitimi ve mesleki teknik medikal terminoloji.',
    created_at: '2017-06-01T00:00:00Z',
  },
]

export const FALLBACK_PROJECTS: Project[] = []

export const FALLBACK_BLOGS: Blog[] = [
  {
    id: 'fallback-blog-1',
    title: 'Biyomedikal Cihazlarda Kalibrasyon ve Metrolojik Doğrulama Standartları',
    slug: 'biyomedikal-cihazlarda-kalibrasyonun-onemi',
    excerpt: 'Tıbbi cihazların tanı ve tedavideki ölçüm doğruluğunu garanti altına alan kalibrasyon periyotları, uluslararası standartlar (IEC 62353) ve metrolojik test yöntemleri.',
    content: `
      <h2>Tıbbi Cihazlarda Kalibrasyon Neden Hayatidir?</h2>
      <p>Hastanelerde teşhis ve tedavi süreçlerinde kullanılan biyomedikal cihazların ölçüm doğruluğu doğrudan insan hayatına etki eder. Bir infüzyon pompasının hastaya yanlış hızda ilaç vermesi veya hasta başı monitörünün hatalı SpO2/EKG parametresi okuması telafisi imkansız klinik sonuçlar doğurabilir.</p>
      
      <h3>Kalibrasyon ve Doğrulama Arasındaki Kritik Fark</h3>
      <p><strong>Kalibrasyon</strong>, doğruluğu uluslararası standartlara izlenebilir bir referans test cihazı (analizör) ile test edilen cihaz arasındaki sapmanın sayısal olarak tespit edilmesidir. <strong>Doğrulama (Verification)</strong> ise cihazın belirlenen tolerans limitleri içinde kalıp kalmadığının resmi olarak onaylanmasıdır.</p>
      
      <h3>Uygulanan Temel Biyomedikal Güvenlik & Kalibrasyon Testleri</h3>
      <ul>
        <li><strong>Elektriksel Güvenlik Testleri (IEC 62353 / IEC 60601):</strong> Koruyucu topraklama direnci (Protective Earth Resistance), gövde kaçak akımı (Enclosure Leakage) ve hasta devresi kaçak akımı ölçümleri.</li>
        <li><strong>İnfüzyon & Perfüzör Pompası Testleri:</strong> Akış debisi (ml/saat) doğrulaması, tıkanma (occlusion) basınç alarmları ve hava kabarcığı detektör testleri.</li>
        <li><strong>Hasta Başı Monitörleri:</strong> NIBP manşon basınç sızıntı testi, EKG genlik/frekans doğrulaması, SpO2 optik dalga boyu simülasyonu ve vücut sıcaklığı kalibrasyonu.</li>
      </ul>
      
      <h3>Düzenli Kalibrasyonun Kazanımları</h3>
      <p>Periyodik metrolojik kontroller cihazların arıza oranlarını %40 azaltırken, cihaz ömrünü uzatır ve sağlık kurumlarının uluslararası akreditasyon (JCI, Sağlıkta Kalite Standartları) süreçlerine tam uyum sağlar.</p>
    `,
    cover_image: null,
    created_at: '2025-10-18T09:00:00Z',
  },
  {
    id: 'fallback-blog-2',
    title: 'Yoğun Bakım Mekanik Ventilatörlerinin Çalışma Prensipleri ve Bakım Kılavuzu',
    slug: 'yogun-bakim-ventilatorleri-calisma-prensipleri',
    excerpt: 'Ventilatör solunum modları, pnömatik blok yapısı, akış sensörleri ve koruyucu periyodik teknik servis bakım aşamaları.',
    content: `
      <h2>Ventilatör Sistemlerinin Temel Mimarisi ve Solunum Döngüsü</h2>
      <p>Mekanik ventilatörler, kendi kendine solunum yapamayan veya solunum yetmezliği çeken kritik hastalara oksijen ve medikal hava karışımını belirli basınç, hacim ve frekansta ileten hayati yaşam destek cihazlarıdır.</p>
      
      <h3>Temel Solunum Modları</h3>
      <ul>
        <li><strong>VCV (Hacim Kontrollü Ventilasyon):</strong> Hastaya her solukta önceden belirlenen tidal hacim (Vt) verilir; tepe basıncı hastanın akciğer direncine göre değişkenlik gösterir.</li>
        <li><strong>PCV (Basınç Kontrollü Ventilasyon):</strong> Belirlenen inspiratuar basınç seviyesi korunarak hava iletilir; tidal hacim akciğer kompliyansına bağlıdır.</li>
        <li><strong>SIMV & CPAP/PSV:</strong> Hastanın spontan solunum çabalarını destekleyen, senkronize ve basınç destekli modlar.</li>
      </ul>

      <h3>Kritik Pnömatik ve Elektronik Bileşenler</h3>
      <ul>
        <li><strong>Gaz Mikseri (Blender / Oransal Valfler):</strong> %21 ile %100 arasında hassas FiO2 karışımı sağlar.</li>
        <li><strong>Ekspirasyon Valfi & PEEP Mekanizması:</strong> Alveollerin sönmesini engellemek için soluk sonu pozitif basıncı (PEEP) milibar hassasiyetinde tutar.</li>
        <li><strong>Akış (Flow) Sensörleri:</strong> Pneumotachograph, sıcak tel (hot-wire) veya ultrasonik sensörler ile hasta eforunu anlık milisaniye mertebesinde algılar.</li>
      </ul>

      <h3>Teknik Bakım ve Servis Prosedürleri</h3>
      <p>Her periyodik bakımda oksijen hücresinin (O2 Cell) kimyasal ömrü kontrol edilmeli, dahili batarya deşarj testi yapılmalı, valf sızdırmazlık testleri ve yapay akciğer simülatörüyle basınç-hacim doğrulaması gerçekleştirilmelidir.</p>
    `,
    cover_image: null,
    created_at: '2025-09-25T11:30:00Z',
  },
  {
    id: 'fallback-blog-3',
    title: 'Anestezi Cihazları ve Gaz Dağıtım Sistemlerinde Güvenlik Protokolleri',
    slug: 'anestezi-cihazlari-gaz-dagitim-sistemleri-guvenlik',
    excerpt: 'Ameliyathane anestezi iş istasyonlarının bileşenleri, vaporizatör kalibrasyonu, absorber sistemleri ve kaçak testi protokolleri.',
    content: `
      <h2>Ameliyathane Anestezi İş İstasyonlarının Görevi</h2>
      <p>Anestezi cihazları; cerrahi operasyon süresince hastanın uyutulması, ağrı hissetmemesi ve yaşamsal fonksiyonlarının stabil tutulmasını sağlayan gaz karışımı (O2, N2O, Medikal Hava ve Anestezik Ajanlar) ileten kombine sistemlerdir.</p>
      
      <h3>Güvenlik Mekanizmaları ve Gaz Dağıtımı</h3>
      <ul>
        <li><strong>Pin-Index ve DISS Güvenlik Sistemi:</strong> Yanlış gaz tüpünün veya merkezi hortumun takılmasını mekanik tırnak farklarıyla imkansız hale getirir.</li>
        <li><strong>Hipoksik Koruma Sistemi:</strong> Oksijen oranı %25'in altına düştüğünde N2O gaz akışını otomatik olarak kesen mekanik/pnömatik kilit.</li>
        <li><strong>Vaporizatörler (Buharlaştırıcılar):</strong> Sıvı anestezik ajanları (Sevofluran, Desfluran, İzofluran) sıcaklık ve akış kompanzasyonuyla buharlaştırarak hassas konsantrasyonda (%) solunum devresine katar.</li>
      </ul>

      <h3>Periyodik Kontrol ve Devre Testi Aşamaları</h3>
      <ol>
        <li><strong>Yüksek ve Düşük Basınç Kaçak Testi (Leak Test):</strong> Devrede 30 cmH2O basınçta mikro düzeyde dahi kaçak olmaması şarttır.</li>
        <li><strong>Karbondioksit Absorber (Soda-Lime) Kontrolü:</strong> Kimyasal renk değişimi ve tozlanma durumu izlenmeli, satüre olmuş kireç derhal değiştirilmelidir.</li>
        <li><strong>Atık Gaz Tahliye Sistemi (AGSS):</strong> Ameliyathane personeline anestezik gaz sızıntısını önleyen aktif tahliye emiş gücü kontrol edilmelidir.</li>
      </ol>
    `,
    cover_image: null,
    created_at: '2025-08-30T15:00:00Z',
  },
  {
    id: 'fallback-blog-4',
    title: 'Kardiyak Acillerde Defibrilatör Sistemleri ve Analizör Testleri',
    slug: 'defibrilator-test-prosedurleri-ve-guvenlik',
    excerpt: 'Bifazik defibrilatör dalga formları, senkronize kardiyoversiyon, harici pacemaker modları ve analizör testleri.',
    content: `
      <h2>Kardiyak Aritmilerde Defibrilasyonun Rolü</h2>
      <p>Defibrilatörler, ventriküler fibrilasyon (VF) ve nabızsız ventriküler taşikardi (VT) gibi ölümcül kardiyak aritmilerde kalbe kontrollü bir elektrik şoku uygulayarak kalbin doğal elektriksel odağının yeniden devreye girmesini sağlar.</p>
      
      <h3>Monofazik vs. Modern Bifazik Dalga Formları</h3>
      <p>Geleneksel monofazik şoklar tek yönlü akım iletirken, modern <strong>Bifazik Truncated Exponential (BTE)</strong> dalga formları akımın yönünü tersine çevirerek çok daha düşük enerji seviyelerinde (150-200 Joule) daha yüksek defibrilasyon başarısı sunar ve miyokart dokusunda termal hasarı minimize eder.</p>
      
      <h3>Defibrilatör Analizörü ile Yapılan Güvenlik Testleri</h3>
      <ul>
        <li><strong>Enerji Çıkış Doğruluğu:</strong> 50 Ohm standart insan vücut empedans yükünde seçilen enerji (örneğin 200J) ile cihazın aktardığı gerçek enerji arasındaki fark ±%10 sınırında olmalıdır.</li>
        <li><strong>Şarj Süresi Testi:</strong> Cihazın şebeke ve batarya beslemesinde maksimum enerji seviyesine 10 saniyenin altında ulaşabildiği kronometrik olarak ölçülmelidir.</li>
        <li><strong>Senkronize Kardiyoversiyon:</strong> EKG'deki R-dalgası tepesinden sonraki deşarj gecikme süresi 60 ms'yi aşmamalıdır.</li>
        <li><strong>Harici Pacemaker (Pace) Modu:</strong> Dakikadaki atım sayısı (ppm) ve akım şiddeti (mA) dalga formu analizörü ile doğrulanır.</li>
      </ul>
    `,
    cover_image: null,
    created_at: '2025-07-22T13:45:00Z',
  },
  {
    id: 'fallback-blog-5',
    title: 'Hemodiyaliz Cihazlarının Hidrolik ve Elektromekanik Mimarisi',
    slug: 'hemodiyaliz-cihazlari-hidrolik-ve-elektromekanik-mimari',
    excerpt: 'Diyalizat hazırlama, ultrafiltrasyon kontrolü, kan kaçağı dedektörleri ve hemodiyaliz makinelerinin hidrolik devre prensipleri.',
    content: `
      <h2>Hemodiyaliz Cihazının Temel Amacı</h2>
      <p>Böbrek yetmezliği bulunan hastalarda vücutta biriken üre, kreatinin ve fazla sıvının yarı geçirgen bir membran (diyalizör) yardımıyla kandan uzaklaştırılması işlemidir.</p>
      
      <h3>Hidrolik Devre ve Diyalizat Karışımı</h3>
      <ul>
        <li><strong>Saf Su Girişi & Isıtma:</strong> Reverse Osmosis (RO) sisteminden gelen saf su 36-37°C vücut sıcaklığına ısıtılır.</li>
        <li><strong>Oransal Karışım (A & B Konsantreleri):</strong> Asit ve bikarbonat konsantreleri hassas dozaj pompalarıyla karıştırılır; iletkenlik (Conductivity) hücreleriyle iyon yoğunluğu anlık izlenir.</li>
        <li><strong>Ultrafiltrasyon (UF) ve Kapalı Dengeleme Hücreleri:</strong> Hastadan çekilecek sıvı miktarı (UF oranı), balans odacıkları (balancing chambers) sayesinde mililitre hassasiyetinde kontrol edilir.</li>
      </ul>

      <h3>Hasta Güvenlik Devreleri</h3>
      <ul>
        <li><strong>Kan Kaçağı Dedektörü (Blood Leak Detector):</strong> Diyalizör liflerindeki mikro yırtıkları optik dalga boyu soğurmasıyla anında fark eder ve diyalizatı bypass moduna alır.</li>
        <li><strong>Hava Dedektörü (Air Bubble Detector):</strong> Ultrasonik sensörler ile venöz hatta 1 damla dahi hava kabarcığı geçişini engelleyerek hava embolisini önler.</li>
        <li><strong>Venöz ve Arteriyel Basınç Sensörleri:</strong> Damar yolu basınç anomalilerinde kan pompasını derhal durdurur.</li>
      </ul>
    `,
    cover_image: null,
    created_at: '2025-06-18T10:20:00Z',
  },
  {
    id: 'fallback-blog-6',
    title: 'Ameliyathane Cerrahi Cihazları: Elektrokoter ve Cerrahi Aspiratörlerin Bakımı',
    slug: 'ameliyathane-elektrokoter-ve-aspirator-bakim-dinamikleri',
    excerpt: 'Yüksek frekanslı elektrocerrahi üniteleri, monopolar/bipolar modlar, nötr plak güvenlik sistemleri ve cerrahi aspiratör bakımı.',
    content: `
      <h2>Elektrocerrahi (Koter) Sistemlerinin Fiziksel Prensibi</h2>
      <p>Elektrokoter cihazları, 300 kHz ile 3 MHz arasındaki yüksek frekanslı alternatif akımı dokuya uygulayarak hücre içi sıvıyı aniden buharlaştırır (kesme / cut) veya proteinleri pıhtılaştırarak kanamayı durdurur (koagülasyon / coag).</p>
      
      <h3>Monopolar ve Bipolar Çalışma Farkı</h3>
      <ul>
        <li><strong>Monopolar Mod:</strong> Akım aktif koter kaleminden geçer, hedef dokuda ısı oluşturur ve hastanın bacağına yapıştırılan geniş yüzeyli nötr plaktan (dönüş elektrodu) geri döner.</li>
        <li><strong>Bipolar Mod:</strong> Akım yalnızca bipolar forsepsin iki ucu arasında mikro mesafede akar; nötr plak gerektirmez ve çevre dokulara minimum ısı yayılımı sağlar.</li>
      </ul>

      <h3>REM (Return Electrode Monitoring) Güvenlik Sistemi</h3>
      <p>Nötr plağın hastanın cildinden kısmen ayrılması durumunda temas yüzeyi küçüleceği için yanık riski oluşur. REM devresi çift parçalı nötr plak arasındaki empedansı sürekli ölçerek cilt teması azaldığında akımı mikrosaniyeler içinde keser.</p>

      <h3>Cerrahi Aspiratör Sistemlerinin Bakımı</h3>
      <p>Ameliyat sahasındaki kan ve sıvıları uzaklaştıran cerrahi aspiratörlerde vakum regülatör testi, yağsız pistonlu pompa bakımı, taşma önleyici hidrofor şamandıra mekanizması ve HEPA/hidrofobik bakteri filtrelerinin düzenli değişimi enfeksiyon kontrolü için şarttır.</p>
    `,
    cover_image: null,
    created_at: '2025-05-12T08:15:00Z',
  },
]
