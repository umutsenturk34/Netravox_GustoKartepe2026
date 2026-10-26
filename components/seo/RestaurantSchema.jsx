import { SITE } from "@/lib/siteConfig";
import { getCompanyContact, getLocalizedText } from "@/lib/utils";

const DAY_MAP = {
  Pazartesi: "Monday", Salı: "Tuesday", Çarşamba: "Wednesday",
  Perşembe: "Thursday", Cuma: "Friday", Cumartesi: "Saturday", Pazar: "Sunday",
};

const DAY_ORDER = Object.keys(DAY_MAP);

// Panel iki biçimde saat tutabiliyor: {day, open, close} veya serbest metin {days: "Pazartesi – Pazar", hours: "09:00 – 22:00"}
function expandDays(text) {
  const parts = String(text || "").split(/\s*[–—-]\s*/);
  const idx = (name) => DAY_ORDER.findIndex((d) => d.toLocaleLowerCase("tr") === name.trim().toLocaleLowerCase("tr"));
  if (parts.length === 2 && idx(parts[0]) >= 0 && idx(parts[1]) >= 0) {
    const [from, to] = [idx(parts[0]), idx(parts[1])];
    const out = [];
    for (let i = from; ; i = (i + 1) % 7) {
      out.push(DAY_MAP[DAY_ORDER[i]]);
      if (i === to) break;
    }
    return out;
  }
  return String(text || "").split(/\s*[,&]\s*/).map((d) => DAY_MAP[DAY_ORDER[idx(d)]]).filter(Boolean);
}

function buildHoursSpec(workingHours) {
  const grouped = {};
  for (const slot of Array.isArray(workingHours) ? workingHours : []) {
    if (slot.isOpen === false) continue;
    let opens = slot.open;
    let closes = slot.close;
    let days = slot.day ? [DAY_MAP[slot.day] || slot.day] : [];
    if (!days.length && slot.days) days = expandDays(slot.days);
    if ((!opens || !closes) && slot.hours) {
      const m = String(slot.hours).match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
      if (m) [, opens, closes] = m;
    }
    if (!opens || !closes || !days.length) continue;
    const key = `${opens}-${closes}`;
    grouped[key] = grouped[key] || { opens, closes, days: [] };
    grouped[key].days.push(...days);
  }
  const specs = Object.values(grouped).map(({ opens, closes, days }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  }));
  if (specs.length) return specs;
  return [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DAY_ORDER.map((d) => DAY_MAP[d]),
    opens: "09:00",
    closes: "22:00",
  }];
}

export function RestaurantSchema({ company }) {
  const contact = getCompanyContact(company);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: company?.name || SITE.name,
    description: getLocalizedText(company?.description, SITE.description),
    url: SITE.url,
    logo: company?.branding?.logoLight || company?.branding?.logoDark || undefined,
    image: `${SITE.url}/opengraph-image`,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: buildHoursSpec(company?.workingHours),
    servesCuisine: ["Türk Mutfağı", "Kahvaltı", "Izgara"],
    ...(SITE.priceRange ? { priceRange: SITE.priceRange } : {}),
    currenciesAccepted: "TRY",
    sameAs: [contact.instagram, contact.facebook, contact.youtube, contact.tiktok, contact.linkedin, SITE.googleMapsUrl].filter(Boolean),
    hasMap:
      "https://maps.google.com/?q=Sirinsulhiye+Mh.+Degirmen+Vadisi+Sk.+No:+14/1+Kartepe+Kocaeli",
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
