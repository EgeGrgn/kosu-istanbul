import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'istanbul-kosulari-events'

const aboutSlides = [
  {
    eyebrow: 'ŞEHRİN İÇİNDE',
    title: 'İstanbul’u adımlarla keşfet.',
    description:
      'Köprülerden tarihî sokaklara uzanan şehir koşularını keşfet; İstanbul’un her iki yakasında kendine yeni bir hedef bul.',
    image:
      'https://images.pexels.com/photos/37160570/pexels-photo-37160570/free-photo-of-istanbul-marathon-runners-on-city-streets.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageAlt: 'İstanbul sokaklarında birlikte koşan sporcular',
    credit: 'Pexels · Semih Başaran',
    creditUrl:
      'https://www.pexels.com/photo/istanbul-marathon-runners-on-city-streets-37160570/',
    tag: 'Şehir koşuları',
  },
  {
    eyebrow: 'KIYI ROTASI',
    title: 'Boğaz havası, sahil temposu.',
    description:
      'Caddebostan’dan Dragos’a uzanan kıyı rotalarında denizi yanında hisset. Şehrin manzarası her kilometreye eşlik etsin.',
    image:
      'https://images.pexels.com/photos/37160564/pexels-photo-37160564/free-photo-of-istanbul-marathon-runners-by-historic-lighthouse.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageAlt: 'İstanbul’da deniz kıyısındaki koşu parkurundan geçen koşucular',
    credit: 'Pexels · Semih Başaran',
    creditUrl:
      'https://www.pexels.com/photo/istanbul-marathon-runners-by-historic-lighthouse-37160564/',
    tag: 'Sahil parkurları',
  },
  {
    eyebrow: 'DOĞAYA DÖN',
    title: 'Patikada kendi ritmini bul.',
    description:
      'Belgrad Ormanı’nın yeşil yollarında şehirden uzaklaş. Patika koşularını, mesafeni ve sana uygun etkinliği birlikte keşfet.',
    image:
      'https://www.geyikkosulari.com/img/makale/guzel-havanIn-tadInI-yine-geyikler-cIkardI-60927.jpeg',
    imageAlt: 'Belgrad Ormanı’nda düzenlenen Geyik Koşuları patika yarışı',
    credit: 'Geyik Koşuları',
    creditUrl: 'https://www.geyikkosulari.com/',
    tag: 'Patika koşuları',
  },
]

const officialEvents = [
  {
    id: 'zeytinburnu-2026',
    name: '17. Uluslararası Zeytinburnu Cumhuriyet Koşusu',
    date: '2026-10-18',
    time: '09:00',
    location: 'Zeytinburnu, İstanbul',
    distance: '10K',
    category: 'ŞEHİR KOŞUSU',
    monogram: 'Z',
    accent: '#e87555',
    image: 'https://www.kosu.taf.org.tr/uploads/yarisma_kapak/kapak_103_636ab7bb4b09e4c3.jpg',
    details: 'Resmî etkinlik sayfasında kayıt kontenjanının dolduğu belirtiliyor.',
    officialUrl:
      'https://www.kosu.taf.org.tr/17-uluslararasi-zeytinburnu-cumhuriyet-kosusu',
  },
  {
    id: 'bosphorun-2026',
    name: 'Bosphorun Quarter Marathon',
    date: '2026-10-18',
    time: '09:15',
    location: 'Kuruçeşme Cemil Topuzlu Parkı',
    distance: '10,5K',
    category: 'BOĞAZ PARKURU',
    monogram: 'BQ',
    accent: '#3c8e9a',
    image: 'https://bosphorun.istanbul/wp-content/uploads/2026/10/BosphorunQM-2026_KV_Bebek_16x9-2-scaled.jpg',
    details:
      'Kuruçeşme’den başlayıp Boğaz sahilinde koşulan özel organizasyon. Kayıt tarihini resmî sayfadan kontrol et.',
    officialUrl: 'https://bosphorun.istanbul/',
  },
  {
    id: 'caddebostan-2026',
    name: 'Caddebostan Cumhuriyet Koşusu',
    date: '2026-10-25',
    time: '09:00',
    location: 'Caddebostan Etkinlik Alanı, Kadıköy',
    distance: '10K',
    category: 'SAHİL KOŞUSU',
    monogram: 'C',
    accent: '#9274bb',
    image: 'https://kosu.taf.org.tr/uploads/yarisma_kapak/kapak_186_9bbbdb473f6c47ed.jpg',
    details:
      'Geç kayıt dönemi ve ücret bilgisi değişebilir. Kontenjanı resmî sayfadan kontrol et.',
    officialUrl:
      'https://kosu.taf.org.tr/caddebostan-cumhuriyet-kosusu?lang=tr',
  },
  {
    id: 'istanbul-maratonu-halk-2026',
    name: '48. İstanbul Maratonu – Halk Koşusu',
    date: '2026-11-01',
    time: 'Saat bilgisi resmî sayfada kontrol edilmeli',
    location: 'Altunizade → Beşiktaş',
    distance: 'Halk Koşusu',
    category: 'HERKES İÇİN',
    monogram: 'İM',
    accent: '#bd8a37',
    image: 'https://maraton.istanbul/wp-content/uploads/2026/08/Website_Banner_Mobile.png',
    details:
      'Başlangıç 15 Temmuz Şehitler Köprüsü Metrobüs Durağı önü; bitiş Beşiktaş Tüpraş Stadyumu önü.',
    officialUrl: 'https://maraton.istanbul/halk-kosusu/',
  },
  {
    id: 'istanbul-maratonu-42k-2026',
    name: 'Türkiye İş Bankası 48. İstanbul Maratonu',
    date: '2026-11-01',
    time: 'Start saati resmî programda',
    location: '15 Temmuz Şehitler Köprüsü → Sultanahmet',
    distance: '42K',
    category: 'MARATON',
    monogram: '42',
    accent: '#cf6d51',
    image: 'https://maraton.istanbul/wp-content/uploads/2026/08/Website_Banner_Mobile.png',
    details: '42K katılımı için organizatörün belirlediği süre kriterleri bulunuyor. Güncel koşulları resmî sayfadan kontrol et.',
    officialUrl: 'https://maraton.istanbul/maraton-42k-kosusu/',
    sourceLabel: 'Organizatör sayfası',
  },
  {
    id: 'istanbul-maratonu-15k-2026',
    name: 'Türkiye İş Bankası 48. İstanbul Maratonu',
    date: '2026-11-01',
    time: 'Start saati resmî programda',
    location: '15 Temmuz Şehitler Köprüsü → Yenikapı',
    distance: '15,5K',
    category: 'ŞEHİR KOŞUSU',
    monogram: '15K',
    accent: '#3b8390',
    image: 'https://maraton.istanbul/wp-content/uploads/2026/08/Website_Banner_Mobile.png',
    details: '15,5K parkuru maratonun resmî kategorilerinden biridir. Kayıt ve parkur bilgileri organizatör sayfasında yer alıyor.',
    officialUrl: 'https://maraton.istanbul/parkur/',
    sourceLabel: 'Organizatör sayfası',
  },
  {
    id: 'omer-besim-kros-2026',
    name: 'Ömer Besim Kros Koşusu',
    date: '2026-11-15',
    time: 'Saat bilgisi açıklanmadı',
    location: 'İstanbul',
    distance: 'Kros',
    category: 'KIR KOŞUSU',
    monogram: 'ÖB',
    accent: '#78915a',
    image: 'https://media.cumhuriyet.com.tr/Archive/63f838c2-7fca-4106-85ac-50cb4497e57c.jpg',
    imageCredit: 'Cumhuriyet',
    imageCreditUrl: 'https://www.cumhuriyet.com.tr/yasam/istanbul-da-kosu-yapmak-icin-tercih-edebileceginiz-en-iyi-rotalar-2518239',
    details: '15 Kasım tarihi yarış takvimlerinde listeleniyor. Parkur, katılım ve saat bilgilerini organizatör duyurusundan doğrula.',
    officialUrl: 'https://www.passtiming.org/yarisma-takvimi',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'speed-run-istanbul-2026',
    name: 'Speed Run İstanbul',
    date: '2026-11-15',
    time: 'Saat bilgisi açıklanmadı',
    location: 'Kurtköy, İstanbul',
    distance: 'Açıklanmadı',
    category: 'YOL KOŞUSU',
    monogram: 'SR',
    accent: '#a66b49',
    image: 'https://images.pexels.com/photos/16887705/pexels-photo-16887705/free-photo-of-professional-runner-with-sunglasses.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · Lübna Abdullah',
    imageCreditUrl: 'https://www.pexels.com/photo/professional-runner-with-sunglasses-16887705/',
    details: 'Etkinlik yarış takviminde 15 Kasım için listeleniyor. Mesafe, kayıt ve saat bilgileri ayrıca doğrulanmalı.',
    officialUrl: 'https://www.passtiming.org/yarisma-takvimi',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'istanbul-5-days-2026',
    name: 'Istanbul 5 Days – Kapalıçarşı',
    date: '2026-11-08',
    time: 'Saat bilgisi açıklanmadı',
    location: 'Kapalıçarşı, İstanbul',
    distance: '5K',
    category: 'ŞEHİR KOŞUSU',
    monogram: '5D',
    accent: '#b77c3f',
    image: 'https://images.pexels.com/photos/37160570/pexels-photo-37160570/free-photo-of-istanbul-marathon-runners-on-city-streets.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · Semih Başaran',
    imageCreditUrl: 'https://www.pexels.com/photo/istanbul-marathon-runners-on-city-streets-37160570/',
    details: 'Etkinlik yarış takviminde listeleniyor; kayıt ve organizasyon ayrıntıları henüz net değil.',
    officialUrl: 'https://www.raceturkiye.com/en/city/istanbul',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'dragos-10k-2026',
    name: 'Dragos 10K',
    date: '2026-11-22',
    time: '09:00',
    location: 'Kartal Dragos Sahili, İstanbul',
    distance: '10K',
    category: 'SAHİL KOŞUSU',
    monogram: 'D',
    accent: '#438b86',
    image: 'https://images.pexels.com/photos/37160564/pexels-photo-37160564/free-photo-of-istanbul-marathon-runners-by-historic-lighthouse.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · Semih Başaran',
    imageCreditUrl: 'https://www.pexels.com/photo/istanbul-marathon-runners-by-historic-lighthouse-37160564/',
    details: 'Yarış takviminde 5K ve 10K seçenekleri görünüyor. Ücret ve kayıt bilgileri değişebilir.',
    officialUrl: 'https://www.raceturkiye.com/tr/race/dragos-10k-2026',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'ogretmenler-gunu-kosusu-2026',
    name: '24 Kasım Öğretmenler Günü Koşusu',
    date: '2026-11-22',
    time: '08:30',
    location: 'Yeşilköy Marina, Bakırköy',
    distance: '5K / 10K / 21K',
    category: 'SAHİL KOŞUSU',
    monogram: '24',
    accent: '#9a6c9d',
    image: 'https://www.bakirkoybelediyesi24kasimkosu.com/assets/imagesuploaded/bfc45fd8cff34e63a370f13bf6217cbf.jpeg',
    details: 'Bakırköy Belediyesi ve Merrell iş birliğiyle düzenleniyor. Kayıt durumu ve parkur ayrıntıları resmî sayfada.',
    officialUrl: 'https://www.bakirkoybelediyesi24kasimkosu.com/',
    sourceLabel: 'Organizatör sayfası',
  },
  {
    id: 'geyik-kosulari-2026',
    name: 'Geyik Koşuları',
    date: '2026-12-02',
    time: 'Saat bilgisi açıklanmadı',
    location: 'Belgrad Ormanı, İstanbul',
    distance: 'Patika',
    category: 'PATİKA KOŞUSU',
    monogram: 'GK',
    accent: '#71884e',
    image: 'https://www.geyikkosulari.com/img/makale/guzel-havanIn-tadInI-yine-geyikler-cIkardI-60927.jpeg',
    imageCredit: 'Geyik Koşuları',
    imageCreditUrl: 'https://www.geyikkosulari.com/',
    details: 'Yarış takviminde 2 Aralık olarak listeleniyor. Tarih ve parkur bilgisini organizatörün güncel duyurusundan doğrula.',
    officialUrl: 'https://www.geyikkosulari.com/',
    sourceLabel: 'Organizatör sayfası',
  },
  {
    id: 'dark-run-istanbul-2026',
    name: 'Dark Run İstanbul',
    date: '2026-12-19',
    time: 'Saat bilgisi açıklanmadı',
    location: 'Ataköy, İstanbul',
    distance: 'Açıklanmadı',
    category: 'GECE KOŞUSU',
    monogram: 'DR',
    accent: '#596d9a',
    image: 'https://img.dunya.com/rcman/Cw1280h720q95gc/storage/old/files/2017/9/13/381445/381445.jpg',
    imageCredit: 'Dünya',
    imageCreditUrl: 'https://www.dunya.com/spor/belgrad-ormaninda-gece-kosusu-haberi-381445',
    details: '19 Aralık tarihi yarış takviminde yer alıyor. Organizasyon ve kayıt ayrıntıları için güncel duyuru beklenmeli.',
    officialUrl: 'https://www.passtiming.org/yarisma-takvimi',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'istanbul-indoor-o-cup-2026',
    name: 'İstanbul Indoor O Cup',
    date: '2026-12-27',
    time: 'Saat bilgisi açıklanmadı',
    location: 'İstanbul',
    distance: 'Salon oryantiringi',
    category: 'ORYANTİRİNG',
    monogram: 'O',
    accent: '#bf7652',
    image: 'https://images.pexels.com/photos/36436500/pexels-photo-36436500/free-photo-of-aerial-view-of-marathon-runners-on-istanbul-street.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · İhsan İlze',
    imageCreditUrl: 'https://www.pexels.com/photo/aerial-view-of-marathon-runners-on-istanbul-street-36436500/',
    details: 'Etkinlik bölgesel yarış takviminde listeleniyor. Salon, parkur ve kayıt bilgileri henüz doğrulanmadı.',
    officialUrl: 'https://www.raceturkiye.com/tr/bolge/istanbul',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'nbl-tip-kosusu-2027',
    name: 'NBL Tıp Koşusu',
    date: '2027-03-21',
    time: 'Saat bilgisi açıklanmadı',
    location: 'İstanbul',
    distance: '10K / 21K',
    category: 'YOL KOŞUSU',
    monogram: 'NBL',
    accent: '#4d8b72',
    image: 'https://images.pexels.com/photos/16887705/pexels-photo-16887705/free-photo-of-professional-runner-with-sunglasses.jpeg?auto=compress&dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · Lübna Abdullah',
    imageCreditUrl: 'https://www.pexels.com/photo/professional-runner-with-sunglasses-16887705/',
    details: '2027 yarış takvimlerinde bu tarihle listeleniyor. Parkur ve kayıt bilgileri yayımlandığında doğrula.',
    officialUrl: 'https://www.raceturkiye.com/tr/bolge/istanbul',
    sourceLabel: 'Yarış takvimi',
  },
  {
    id: 'silivri-ultra-trail-2027',
    name: 'Silivri Ultra Trail',
    date: '2027-04-04',
    time: 'Saat bilgisi açıklanmadı',
    location: 'Silivri, İstanbul',
    distance: '8K / 16K / 35K',
    category: 'PATİKA KOŞUSU',
    monogram: 'ST',
    accent: '#8b7954',
    image: 'https://images.pexels.com/photos/37160563/pexels-photo-37160563/free-photo-of-marathon-runners-along-historic-walls-in-istanbul.jpeg?dpr=1&h=750&w=1260',
    imageCredit: 'Pexels · Semih Başaran',
    imageCreditUrl: 'https://www.pexels.com/photo/marathon-runners-along-historic-walls-in-istanbul-37160563/',
    details: '2027 yarış takviminde listeleniyor. Kayıt ve parkur ayrıntıları organizatör duyurusuyla netleşecek.',
    officialUrl: 'https://www.raceturkiye.com/tr/bolge/istanbul',
    sourceLabel: 'Yarış takvimi',
  },
]

function loadEvents() {
  try {
    const savedEvents = localStorage.getItem(STORAGE_KEY)

    if (!savedEvents) return officialEvents

    const parsedEvents = JSON.parse(savedEvents)
    const officialIds = officialEvents.map((event) => event.id)

    const personalEvents = parsedEvents.filter(
      (event) =>
        !officialIds.includes(event.id) &&
        ![1, 2, 3].includes(event.id),
    )

    return [...officialEvents, ...personalEvents]
  } catch {
    return officialEvents
  }
}

function formatDate(date) {
  if (!date) return 'Tarih belirtilmedi'

  const parsedDate = new Date(`${date}T12:00:00`)

  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

const nutritionSources = [
  { label: 'American College of Sports Medicine · Nutrition and Athletic Performance', url: 'https://acsm.org/education-resources/pronouncements-scientific-communications/position-stands/' },
  { label: 'Bristol NHS · Beslenme ve egzersiz rehberi', url: 'https://www.uhbristol.nhs.uk/media/2988087/fs_nutrition__adults_2017.pdf' },
  { label: 'NHS · Egzersiz ve aktivite atıştırmalıkları', url: 'https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/exercise-and-activity-snacks' },
]

function pageFromHash() {
  const destination = window.location.hash.slice(1) || 'ana'
  // Beslenme sayfasının içindeki bölüm bağlantıları da beslenme görünümünde kalmalı.
  return destination === 'oncesi' ? 'beslenme' : destination
}

function prettyPace(seconds) {
  if (!seconds) return '—'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} /km`
}

function prettyDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  return `${hours ? `${hours}s ` : ''}${minutes}dk ${remainder ? `${remainder}sn` : ''}`.trim()
}

function App() {
  const [events] = useState(loadEvents)
  const [searchTerm, setSearchTerm] = useState('')
  const [aboutSlide, setAboutSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [page, setPage] = useState(pageFromHash)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('kosu-istanbul-theme') === 'dark')
  const [runs, setRuns] = useState([])
  const [feed, setFeed] = useState([])
  const [authMode, setAuthMode] = useState('register')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [runForm, setRunForm] = useState({ date: new Date().toISOString().slice(0, 10), distanceKm: '', minutes: '', seconds: '0', note: '', isPublic: true })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const api = async (path, options = {}) => {
    let response
    try {
      response = await fetch(path, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      })
    } catch {
      throw new Error('Hesap sunucusuna ulaşılamadı. Tarayıcıda http://127.0.0.1:5173/#profil adresini aç.')
    }
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Yanlış yerel sunucuya bağlanıldı. Tarayıcıda http://127.0.0.1:5173/#profil adresini aç.')
    }
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || 'Bir sorun oluştu. Tekrar dene.')
    return result
  }

  const refreshRuns = async () => {
    if (!user) return setRuns([])
    try { setRuns((await api('/api/runs')).runs) } catch { setRuns([]) }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('kosu-istanbul-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    const changePage = () => setPage(pageFromHash())
    window.addEventListener('hashchange', changePage)
    Promise.all([api('/api/session'), api('/api/feed')])
      .then(([session, publicFeed]) => {
        setUser(session.user)
        setFeed(Array.isArray(publicFeed.runs) ? publicFeed.runs : [])
      })
      .catch((error) => setMessage(error.message || 'Hesap hizmetine ulaşılamadı. Tarayıcıda http://127.0.0.1:5173/#profil adresini aç.'))
      .finally(() => setLoading(false))
    return () => window.removeEventListener('hashchange', changePage)
  }, [])

  useEffect(() => { void refreshRuns() }, [user])

  const sortedEvents = [...events].sort((first, second) => (first.date || '9999').localeCompare(second.date || '9999'))
  const filteredEvents = sortedEvents.filter((event) => `${event.name} ${event.location} ${event.distance} ${event.details}`.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')))
  const totalKm = useMemo(() => runs.reduce((sum, run) => sum + Number(run.distanceKm), 0), [runs])
  const earnedAwards = [
    { km: 5, name: 'İlk 5K', icon: '✦', detail: '5 kilometrelik koşu' },
    { km: 10, name: '10K Kulübü', icon: '◈', detail: '10 kilometrelik koşu' },
    { km: 21, name: 'Yarı Maraton', icon: '✧', detail: '21 kilometrelik koşu' },
    { km: 42.2, name: 'Maraton', icon: '♛', detail: '42,2 kilometrelik koşu' },
  ]

  const handleAuth = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      if (authMode === 'register' && authForm.password !== authForm.confirmPassword) {
        setMessage('Şifreler birbiriyle eşleşmiyor. İki alanı da kontrol et.')
        return
      }
      const result = await api(`/api/${authMode === 'register' ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(authForm) })
      setUser(result.user)
      setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
      setMessage(`Hoş geldin, ${result.user.name}!`)
    } catch (error) { setMessage(error.message) }
  }

  const handleLogout = async () => {
    try { await api('/api/logout', { method: 'POST', body: '{}' }) } catch { /* oturum zaten kapanmış olabilir */ }
    setUser(null); setRuns([]); setMessage('Oturum kapatıldı.')
  }

  const handleRun = async (event) => {
    event.preventDefault()
    const durationSeconds = Number(runForm.minutes) * 60 + Number(runForm.seconds || 0)
    try {
      await api('/api/runs', { method: 'POST', body: JSON.stringify({ ...runForm, distanceKm: Number(runForm.distanceKm), durationSeconds, isPublic: runForm.isPublic }) })
      setMessage('Koşun kaydedildi. Harika iş!')
      setRunForm({ ...runForm, distanceKm: '', minutes: '', seconds: '0', note: '' })
      await refreshRuns()
      setFeed((await api('/api/feed')).runs)
    } catch (error) { setMessage(error.message) }
  }

  return (
    <div className="app-shell">
      <header className="navigation">
        <a className="brand" href="#ana" aria-label="Koşu İstanbul ana sayfa">
          <span className="brand-mark" aria-hidden="true"><img src="/images/kosu-istanbul-logo.jpg" alt="" /></span>
          <span className="brand-name"><strong>Koşu</strong><span>İstanbul</span></span>
        </a>
        <nav aria-label="Ana menü">
          <a href="#etkinlikler">Etkinlikler</a><a href="#beslenme">Beslenme</a><a href="#hakkinda">Hakkında</a>
          <a className="nav-profile" href="#profil">{user ? `Merhaba, ${user.name}` : 'Giriş / Kayıt'}</a>
          <button className="theme-toggle" type="button" onClick={() => setIsDarkMode((current) => !current)} aria-label={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'} aria-pressed={isDarkMode} title={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}><span aria-hidden="true">{isDarkMode ? '☀' : '☾'}</span><span>{isDarkMode ? 'Açık tema' : 'Koyu tema'}</span></button>
        </nav>
      </header>

      {page === 'beslenme' ? (
        <NutritionPage />
      ) : page === 'profil' ? (
        <main className="profile-page">
          <div className="profile-heading"><p className="eyebrow">KOŞU GÜNLÜĞÜ</p><h1>Her kilometre bir hikâye.</h1><p>Koşularını kaydet, gelişimini izle ve başarılarını sergile.</p></div>
          {message && <p className="status-message" role="status">{message}</p>}
          {loading ? <p>Hesap bilgileri yükleniyor…</p> : !user ? (
            <section className="account-panel">
              <div className="account-art"><img src="/images/istanbul-runner-hero.png" alt="İstanbul'da koşan sporcu" /><div><span className="eyebrow">KOŞU TOPLULUĞUNA KATIL</span><h2>Ritmini kaydet.<br/>Hedefini büyüt.</h2><p>Kişisel koşu günlüğün ve madalya rafın seni bekliyor.</p></div></div>
              <form className="auth-form" onSubmit={handleAuth}>
                <div className="auth-tabs"><button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => { setAuthMode('register'); setMessage('') }}>Hesap oluştur</button><button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setMessage('') }}>Giriş yap</button></div>
                {authMode === 'register' && <label>Adın<input autoComplete="name" minLength="2" maxLength="40" required value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Örn. Deniz" /></label>}
                <label>E-posta<input type="email" autoComplete="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="sen@ornek.com" /></label>
                <label>Şifre<input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} minLength={authMode === 'register' ? 12 : 1} maxLength="200" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder={authMode === 'register' ? 'En az 12 karakter' : 'Şifren'} /></label>
                {authMode === 'register' && <label>Şifreyi doğrula<input type="password" autoComplete="new-password" minLength="12" maxLength="200" required value={authForm.confirmPassword} onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })} placeholder="Şifreni tekrar yaz" /></label>}
                <button className="primary-button" type="submit">{authMode === 'register' ? 'Ücretsiz hesap oluştur' : 'Hesabıma giriş yap'} <span>→</span></button>
                <p className="form-hint">En az 12 karakterli, başka hesaplarında kullanmadığın benzersiz bir şifre seç. Şifre, bu bilgisayarda özetlenerek saklanır; açık metin olarak kaydedilmez.</p>
              </form>
            </section>
          ) : (
            <>
              <section className="profile-summary"><div className="avatar-mark">{user.name.slice(0, 1).toLocaleUpperCase('tr-TR')}</div><div className="profile-greeting"><p className="eyebrow">SPORCU PROFİLİ</p><h2>{user.name}</h2><p>Koşu yolculuğun sana özel. İstersen kayıtlarını toplulukla paylaşabilirsin.</p></div><button className="outline-button" type="button" onClick={handleLogout}>Çıkış yap</button></section>
              <div className="stats-grid"><article><span>TOPLAM MESAFE</span><strong>{totalKm.toFixed(1)} <small>km</small></strong></article><article><span>KAYITLI KOŞU</span><strong>{runs.length}</strong></article><article><span>ORTALAMA TEMPO</span><strong>{runs.length ? prettyPace(Math.round(runs.reduce((sum, run) => sum + run.paceSeconds, 0) / runs.length)) : '—'}</strong></article></div>
              <section className="run-entry-panel"><div><p className="eyebrow">YENİ BİR KAYIT</p><h2>Bugünkü koşunu ekle</h2><p>Mesafeni ve süreni gir; kilometre başına tempon otomatik hesaplansın.</p></div><form className="run-form" onSubmit={handleRun}><label>Tarih<input type="date" required max={new Date().toISOString().slice(0, 10)} value={runForm.date} onChange={(e) => setRunForm({ ...runForm, date: e.target.value })} /></label><label>Mesafe (km)<input type="number" min="0.2" max="300" step="0.1" required placeholder="5.0" value={runForm.distanceKm} onChange={(e) => setRunForm({ ...runForm, distanceKm: e.target.value })} /></label><div className="duration-inputs"><label>Süre · dakika<input type="number" min="0" max="2160" required placeholder="30" value={runForm.minutes} onChange={(e) => setRunForm({ ...runForm, minutes: e.target.value })} /></label><label>Saniye<input type="number" min="0" max="59" value={runForm.seconds} onChange={(e) => setRunForm({ ...runForm, seconds: e.target.value })} /></label></div><label className="full-field">Not (isteğe bağlı)<input maxLength="180" placeholder="Parkur veya koşu notun…" value={runForm.note} onChange={(e) => setRunForm({ ...runForm, note: e.target.value })} /></label><label className="share-toggle full-field"><input type="checkbox" checked={runForm.isPublic} onChange={(e) => setRunForm({ ...runForm, isPublic: e.target.checked })} /><span>Bu koşuyu topluluk akışında paylaş</span></label><p className="pace-preview">Tahmini tempo <strong>{runForm.distanceKm && Number(runForm.minutes) * 60 + Number(runForm.seconds || 0) > 0 ? prettyPace(Math.round((Number(runForm.minutes) * 60 + Number(runForm.seconds || 0)) / Number(runForm.distanceKm))) : '— /km'}</strong></p><button className="primary-button" type="submit">Koşuyu kaydet <span>↗</span></button></form></section>
              <section className="awards-section"><div className="award-book"><div className="award-book-cover"><span className="award-book-mark" aria-hidden="true">✦</span><div><p className="eyebrow">KOŞU GÜNLÜĞÜNÜN BAŞARILARI</p><h2>Başarı defterim</h2><p>Tek bir koşuda tamamladığın mesafeye göre rozetlerin açılır. Her koşu kaydı defterine işlenir.</p></div><span className="award-book-count">{earnedAwards.filter((award) => runs.some((run) => Number(run.distanceKm) >= award.km)).length} / {earnedAwards.length}<small>rozet</small></span></div><div className="medal-shelf">{earnedAwards.map((award) => { const earned = runs.some((run) => Number(run.distanceKm) >= award.km); return <article className={`medal-card${earned ? ' earned' : ''}`} key={award.name}><div className="medal-icon" aria-hidden="true">{award.icon}</div><strong>{award.name}</strong><span>{award.detail}</span><small>{earned ? 'BAŞARI KAZANILDI' : `${award.km.toLocaleString('tr-TR')} km koşuda açılır`}</small></article> })}</div></div></section>
              <section className="my-runs"><div className="section-heading"><div><p className="eyebrow">GEÇMİŞİN</p><h2>Koşu kayıtların</h2></div></div>{runs.length ? <div className="run-list">{runs.map((run) => <article key={run.id}><div className="run-date">{formatDate(run.date)}</div><strong>{Number(run.distanceKm).toLocaleString('tr-TR')} km</strong><span>{prettyDuration(run.durationSeconds)}</span><span>{prettyPace(run.paceSeconds)}</span><span className={`privacy-chip ${run.isPublic ? 'public' : ''}`}>{run.isPublic ? 'Toplulukta' : 'Yalnızca sen'}</span>{run.note && <p>{run.note}</p>}</article>)}</div> : <p className="empty-message">Henüz kayıt yok. İlk koşunu ekleyerek günlüğünü başlat.</p>}</section>
            </>
          )}
          <CommunityFeed runs={feed} />
          <p className="local-note">Bu öğrenci projesindeki hesaplar ve kayıtlar bu bilgisayarda tutulur. Şu anda çevrimiçi hesap hizmeti değildir.</p>
        </main>
      ) : (
        <main>
          <section className="hero" id="ana">
            <div className="hero-content"><p className="eyebrow">İSTANBUL’DA KOŞU ZAMANI</p><h1>Şehrin ritmini yakala.</h1><p className="hero-description">İstanbul’daki koşu etkinliklerini keşfet, sana uygun parkuru bul.</p><a className="hero-button" href="#etkinlikler">Koşuları keşfet <span aria-hidden="true">↓</span></a><a className="hero-secondary" href="#profil">Koşu günlüğünü oluştur →</a></div>
            <div className="hero-visual" aria-hidden="true"><img src="/images/istanbul-runner-hero.png" alt="" /></div><div className="hero-caption"><span className="live-dot" />İstanbul’un iki yakasında koşu zamanı</div>
          </section>
          <section id="etkinlikler" className="events-section"><div className="section-heading"><div><p className="eyebrow">TAKVİM</p><h2>Yaklaşan koşular</h2></div><span className="event-count">{filteredEvents.length} etkinlik</span></div>
            <input className="search-input" type="search" placeholder="Koşu, konum veya mesafe ara..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Koşu, konum veya mesafeye göre ara" />
            <div className="event-list">{filteredEvents.map((event) => <article className="event-card" key={event.id} style={{ '--event-accent': event.accent }}><div className={`event-poster${event.image ? ' has-image' : ''}`}>{event.image ? <><img src={event.image} alt={`${event.name} etkinlik görseli`} loading="lazy" /><span className="poster-image-title">{event.name}</span>{event.imageCredit && <a className="poster-credit" href={event.imageCreditUrl} target="_blank" rel="noreferrer" onClick={(clickEvent) => clickEvent.stopPropagation()}>Görsel: {event.imageCredit}</a>}</> : <><span className="poster-track" aria-hidden="true" /><span className="poster-monogram">{event.monogram}</span><span className="poster-title">{event.name}</span><span className="poster-category">{event.category}</span></>}</div><div className="event-card-top"><span className="event-logo">{event.monogram}</span><span className="distance-badge">{event.distance}</span></div><p className="event-category">{event.category}</p><div className="event-info"><h3>{event.name}</h3><p className="event-date">{formatDate(event.date)}</p><p>{event.time}</p><p>{event.location}</p><p className="event-details">{event.details}</p></div><div className="event-actions"><a className="details-button" href={event.officialUrl} target="_blank" rel="noreferrer">{event.sourceLabel || 'Resmî detaylar'} <span aria-hidden="true">↗</span></a></div></article>)}</div>
            {filteredEvents.length === 0 && <p className="empty-message">Aramana uygun bir etkinlik bulunamadı.</p>}<p className="demo-note">Etkinlik bilgileri değişebilir. Güncel bilgi için resmî sayfayı kontrol et.</p>
          </section>
          <CommunityFeed runs={feed} />
          <section id="hakkinda" className="about-section"><div className="about-intro"><p className="eyebrow">KOŞU İSTANBUL HAKKINDA</p><h2>Bir şehir. İki kıta. Sayısız koşu hikâyesi.</h2><p>Koşu İstanbul, şehirdeki yol, sahil ve patika etkinliklerini tek bir yerde keşfetmen için hazırlanan bağımsız bir öğrenci projesidir. Yeni bir hedef seç, parkurunu tanı ve koşu takvimini planla.</p></div>
            <div className="about-carousel" aria-label="İstanbul’da koşu rotaları"><article className="about-slide" key={aboutSlide} role="group" aria-roledescription="slayt" aria-label={`${aboutSlide + 1} / ${aboutSlides.length}`} onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)} onTouchEnd={(e) => { if (touchStartX === null) return; const distance = touchStartX - e.changedTouches[0].clientX; if (Math.abs(distance) > 55) setAboutSlide((current) => (current + (distance > 0 ? 1 : -1) + aboutSlides.length) % aboutSlides.length); setTouchStartX(null) }}><img className="about-slide-image" src={aboutSlides[aboutSlide].image} alt={aboutSlides[aboutSlide].imageAlt} loading="lazy" /><div className="about-slide-overlay" /><span className="about-slide-tag">{aboutSlides[aboutSlide].tag}</span><div className="about-slide-copy" aria-live="polite"><p className="about-slide-eyebrow">{aboutSlides[aboutSlide].eyebrow}</p><h3>{aboutSlides[aboutSlide].title}</h3><p>{aboutSlides[aboutSlide].description}</p></div><a className="about-slide-credit" href={aboutSlides[aboutSlide].creditUrl} target="_blank" rel="noreferrer">Görsel: {aboutSlides[aboutSlide].credit}</a></article>
              <div className="about-carousel-bottom"><div className="about-dots" aria-label="Slayt seçimi">{aboutSlides.map((slide, index) => <button className={`about-dot${aboutSlide === index ? ' is-active' : ''}`} key={slide.tag} type="button" aria-label={`${index + 1}. slayta git: ${slide.tag}`} aria-current={aboutSlide === index ? 'true' : undefined} onClick={() => setAboutSlide(index)} />)}</div><span className="about-slide-counter">{String(aboutSlide + 1).padStart(2, '0')} <span>/</span> {String(aboutSlides.length).padStart(2, '0')}</span><div className="about-arrows"><button type="button" aria-label="Önceki slayt" onClick={() => setAboutSlide((current) => (current - 1 + aboutSlides.length) % aboutSlides.length)}>←</button><button type="button" aria-label="Sonraki slayt" onClick={() => setAboutSlide((current) => (current + 1) % aboutSlides.length)}>→</button></div></div>
            </div>
            <div className="about-principles"><article><span className="principle-number">01</span><div><h3>Keşfet</h3><p>İstanbul’un farklı yakalarındaki koşuları bir arada gör.</p></div></article><article><span className="principle-number">02</span><div><h3>Karşılaştır</h3><p>Mesafeye, tarihe ve parkur türüne göre sana uygun yarışı seç.</p></div></article><article><span className="principle-number">03</span><div><h3>Planla</h3><p>Güncel kayıt ve parkur bilgileri için organizatör sayfasına ulaş.</p></div></article></div><p className="about-disclaimer">Koşu İstanbul bağımsız bir öğrenci projesidir; kayıt işlemi yapmaz. Tarih ve katılım bilgilerini etkinlik öncesinde organizatörün resmî sayfasından doğrula.</p>
          </section>
          <footer className="site-footer"><a className="footer-brand" href="#ana" aria-label="Koşu İstanbul ana sayfa"><span className="footer-mark" aria-hidden="true"><img src="/images/kosu-istanbul-logo.jpg" alt="" /></span><span className="brand-name"><strong>Koşu</strong><span>İstanbul</span></span></a><div className="footer-links"><a href="#beslenme">Koşu beslenmesi</a><a href="#profil">Koşu günlüğü</a></div><span>İstanbul’da, birlikte.</span></footer>
        </main>
      )}
    </div>
  )
}

function CommunityFeed({ runs = [] }) {
  return <section className="community-section"><div className="section-heading"><div><p className="eyebrow">KOŞU TOPLULUĞU</p><h2>Şehrin koşu notları</h2></div><span className="event-count">Son paylaşımlar</span></div>{runs.length ? <div className="community-grid">{runs.slice(0, 6).map((run) => <article className="community-card" key={run.id}><div className="community-runner"><span>{run.name.slice(0, 1).toLocaleUpperCase('tr-TR')}</span><div><strong>{run.name}</strong><small>{formatDate(run.date)}</small></div></div><div className="community-stats"><strong>{Number(run.distanceKm).toLocaleString('tr-TR')}<small> km</small></strong><span>{prettyDuration(run.durationSeconds)}</span><span>{prettyPace(run.paceSeconds)}</span></div>{run.note && <p>“{run.note}”</p>}</article>)}</div> : <div className="feed-empty"><span>✳</span><div><strong>İlk koşu notu senden gelsin.</strong><p>Profilinden koşunu kaydedip toplulukla paylaşabilirsin.</p></div><a className="details-button" href="#profil">Koşu günlüğünü aç →</a></div>}</section>
}

function NutritionPage() {
  return <main className="nutrition-page">
    <section className="nutrition-hero"><div className="nutrition-hero-copy"><p className="eyebrow">KOŞUYA AKILLI YAKIT</p><h1>İyi beslen.<br/><em>Rahat koş.</em></h1><p>Koşudan önce, koşu sırasında ve sonrasında vücuduna nasıl destek olacağını öğren. Basit, uygulanabilir ve dengeli öneriler.</p><a className="hero-button" href="#oncesi">Rehberi keşfet ↓</a></div><div className="nutrition-photo"><img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Koşu öncesi dengeli yiyecekler ve taze meyveler"/><span>Günlük tabakta denge, parkurda enerji.</span></div></section>
    <div className="nutrition-disclaimer"><span>ⓘ</span><p>Bu sayfa genel eğitim amaçlıdır; kişisel beslenme veya tedavi planı değildir. İhtiyaçlar koşu süresi, hava, sağlık durumu ve kişiden kişiye değişir.</p></div>
    <section id="oncesi" className="nutrition-block"><div className="nutrition-title"><p className="eyebrow">01 · KOŞUDAN ÖNCE</p><h2>Enerjini sakin sakin hazırla.</h2><p>Koşuya aç, ağır veya daha önce denemediğin bir öğünle başlamak zorunda değilsin. Zamanı ve porsiyonu kendi toleransına göre ayarla.</p></div><div className="nutrition-cards"><article className="food-card"><div className="food-visual food-visual-banana" aria-hidden="true">🍌</div><span className="food-time">2–3 saat önce</span><h3>Dengeli ana öğün</h3><p>Pilav veya ekmek gibi karbonhidratı; yoğurt, yumurta ya da baklagil gibi sana uygun bir protein kaynağıyla birleştir. Aşırı yağlı ve çok büyük porsiyonları koşuya çok yakın tüketme.</p><small>Örnek: yoğurtlu yulaf ve meyve · ya da yumurtalı ekmek</small></article><article className="food-card"><div className="food-visual food-visual-toast" aria-hidden="true">🍞</div><span className="food-time">30–60 dk önce</span><h3>Küçük, tanıdık atıştırmalık</h3><p>Kısa veya kolay bir koşu öncesinde açlık hissediyorsan muz, tost ekmeği veya az miktarda kuru meyve gibi kolay tolere ettiğin bir seçenek düşünebilirsin.</p><small>Yeni yiyecekleri yarış sabahı deneme.</small></article><article className="food-card"><div className="food-visual food-visual-water" aria-hidden="true">💧</div><span className="food-time">Gün boyunca</span><h3>Sıvıyı düzenli al</h3><p>Koşuya susuz başlamamaya çalış. Bir anda çok su içmek yerine gün içine yay; hava ve terleme miktarı ihtiyacını değiştirebilir.</p><small>Susuzluk ve kendi terleme düzenin için bedenini izle.</small></article></div></section>
    <section className="nutrition-feature"><div className="feature-photo"><img src="https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Koşu sonrası besleyici bir öğün" loading="lazy"/></div><div><p className="eyebrow">02 · KOŞUDAN SONRA</p><h2>Toparlanma da antrenmanın parçası.</h2><p>Koşu sonrası ilk hedef, günlük dengeli beslenmene geri dönmek. Özellikle uzun veya yorucu koşulardan sonra karbonhidrat içeren bir öğünü protein kaynağıyla eşleştirmek enerji depolarını yenilemeye ve kasların toparlanmasına destek olabilir.</p><div className="meal-ideas"><span>🍚 Pilav + yoğurt / baklagil</span><span>🥪 Peynirli veya yumurtalı sandviç</span><span>🥣 Sütlü yulaf + meyve</span></div><p className="feature-footnote">Koşudan sonra iştahın hemen açılmıyorsa sıvı ve kolay tüketebildiğin küçük bir ara öğünle başlayıp sonra normal öğününü yiyebilirsin.</p></div></section>
    <section className="fuel-timeline"><div className="nutrition-title"><p className="eyebrow">03 · PARKUR BOYUNCA</p><h2>Mesafeye göre düşün.</h2><p>Her koşuda jel veya spor içeceği gerekmez; etkinliğin süresi ve yoğunluğu önemlidir.</p></div><div className="timeline-cards"><article><span>01</span><h3>Kısa ve rahat koşu</h3><p>Çoğu kişi için öncesinde normal öğün düzeni ve susuz kalmamak yeterli olabilir.</p></article><article><span>02</span><h3>Uzun antrenman</h3><p>Yaklaşık bir saati aşan çalışmalarda koşu sırasında karbonhidrat ihtiyacı doğabilir. Önceden antrenmanda dene ve sana uygunluğunu gözle.</p></article><article><span>03</span><h3>Sıcak hava</h3><p>Güneş, nem ve yüksek efor sıvı kaybını artırabilir. Gölge, uygun tempo ve düzenli mola planla; susuzluk belirtilerini önemse.</p></article></div></section>
    <section className="nutrition-cautions"><div className="caution-visual"><img src="https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Koşu antrenmanı öncesinde su içen sporcu" loading="lazy"/><span>Önce bedenini dinle.</span></div><div className="caution-copy"><p className="eyebrow">04 · DİKKAT ET</p><h2>Tek bir plan herkese uymaz.</h2><ul><li><strong>Yarış günü sürpriz yapma.</strong> Yeni jel, takviye veya öğünü önce antrenmanda dene.</li><li><strong>Mide rahatlığını gözet.</strong> Çok büyük, yağlı veya lif oranı yüksek öğünler bazı kişilerde koşu öncesi rahatsızlık yaratabilir.</li><li><strong>Aşırı su içmeye çalışma.</strong> Sıvı ihtiyacı kişisel ve koşullara bağlıdır; zorla, kısa sürede çok su içmek güvenli olmayabilir.</li><li><strong>Belirtileri ciddiye al.</strong> Baş dönmesi, baygınlık, göğüs ağrısı, kafa karışıklığı veya olağandışı bulantıda koşuyu bırak ve yardım al.</li><li><strong>Özel bir durumun varsa danış.</strong> Diyabet, böbrek/kalp hastalığı, gebelik, yeme bozukluğu geçmişi veya düzenli ilaç kullanımı varsa doktor ya da spor diyetisyeniyle kişisel plan oluştur.</li></ul></div></section>
    <section className="nutrition-sources"><p className="eyebrow">DAHA FAZLASINI OKU</p><h2>Kaynaklar</h2><div>{nutritionSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a>)}</div><p>İçerik genel bilgilendirme amacıyla özetlenmiştir; tıbbi tavsiye değildir.</p></section>
  </main>
}

export default App
