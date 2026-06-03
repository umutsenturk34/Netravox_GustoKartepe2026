export const fallbackNavigation = [
  { label: "Ana Sayfa", url: "/", order: 0, children: [] },
  { label: "Hakkımızda", url: "/hakkimizda", order: 1, children: [] },
  {
    label: "Restoran",
    url: "/restoran",
    order: 2,
    children: [
      { label: "Tanıtım Sayfası", url: "/restoran", order: 0 },
      { label: "Menü", url: "/restoran/menu", order: 1 },
      { label: "Galeri", url: "/restoran/galeri", order: 2 },
      { label: "Rezervasyon", url: "/restoran/rezervasyon", order: 3 },
    ],
  },
  {
    label: "Events & Davet",
    url: "#",
    order: 3,
    children: [
      { label: "Yakında", url: "#", order: 0 },
    ],
  },
  {
    label: "Konaklama",
    url: "#",
    order: 4,
    children: [
      { label: "Yakında", url: "#", order: 0 },
    ],
  },
  { label: "İletişim", url: "/iletisim", order: 5, children: [] },
];

export const experienceHighlights = [
  {
    title: "Taze Malzemeler",
    description: "Gunluk tedarik edilen yerel urunlerle hazirlanan tabaklar.",
  },
  {
    title: "Doga Manzarasi",
    description: "Ormanin icinde, dere sesiyle butunlesen sakin bir atmosfer.",
  },
  {
    title: "Ozel Etkinlikler",
    description: "Aile bulusmalari ve kurumsal organizasyonlar icin esnek alanlar.",
  },
];

export const aboutValues = [
  {
    title: "Yerel Ureticiler",
    description: "Bolgenin ureticileriyle birlikte taze ve guvenilir bir mutfak kuruyoruz.",
  },
  {
    title: "Surdurulebilirlik",
    description: "Dogaya saygili bir isletme anlayisiyla kaynaklari bilincli kullaniyoruz.",
  },
  {
    title: "Aile Sicakligi",
    description: "Her ziyareti samimi, rahat ve guven veren bir deneyime donusturuyoruz.",
  },
  {
    title: "Deneyim",
    description: "Sadece yemek degil, Kartepe'nin ruhunu tasiyan tam bir bulusma noktasi sunuyoruz.",
  },
];

export const galleryFilters = [
  "Tumu",
  "Doga",
  "Restoran",
  "Kahvalti",
  "Lezzetler",
  "Etkinlikler",
  "Mekan Detaylari",
];

export const experiences = [
  {
    title: "Kamp Alanlari",
    icon: "Tent",
    description: "Doganin icinde kamp deneyimi.",
  },
  {
    title: "Etkinlik Alanlari",
    icon: "PartyPopper",
    description: "Ozel etkinlik ve organizasyonlar icin esnek kullanim.",
  },
  {
    title: "Konaklama Uniteleri",
    icon: "House",
    description: "Konforlu konaklama secenekleriyle uzun soluklu ziyaretler.",
  },
  {
    title: "Bungalovlar",
    icon: "Trees",
    description: "Doga ile butunlesen sicak ve dingin yasam alanlari.",
  },
  {
    title: "Organizasyon Evi",
    icon: "CalendarDays",
    description: "Kurumsal ve ozel bulusmalar icin planli altyapi.",
  },
  {
    title: "Cafe & Lounge",
    icon: "Coffee",
    description: "Gun boyu keyifli vakit gecirebileceginiz rahat bir bulusma noktasi.",
  },
];
