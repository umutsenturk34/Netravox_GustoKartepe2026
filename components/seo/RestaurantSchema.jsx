import { SITE } from "@/lib/siteConfig";
import { getCompanyContact, getLocalizedText } from "@/lib/utils";

const DAY_MAP = {
  Pazartesi: "Monday", Salı: "Tuesday", Çarşamba: "Wednesday",
  Perşembe: "Thursday", Cuma: "Friday", Cumartesi: "Saturday", Pazar: "Sunday",
};

function buildHoursSpec(workingHours) {
  if (!Array.isArray(workingHours) || !workingHours.length) {
    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "22:00",
    }];
  }
  const grouped = {};
  for (const slot of workingHours) {
    if (!slot.isOpen) continue;
    const opens = slot.open || "09:00";
    const closes = slot.close || "22:00";
    const key = `${opens}-${closes}`;
    const day = DAY_MAP[slot.day] || slot.day;
    if (day) {
      grouped[key] = grouped[key] || { opens, closes, days: [] };
      grouped[key].days.push(day);
    }
  }
  return Object.values(grouped).map(({ opens, closes, days }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  }));
}

export function RestaurantSchema({ company }) {
  const contact = getCompanyContact(company);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: company?.name || SITE.name,
    description: getLocalizedText(company?.description, SITE.description),
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
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
    servesCuisine: ["Turk Mutfagi", "Kahvalti", "Izgara"],
    priceRange: "TRY",
    currenciesAccepted: "TRY",
    sameAs: [contact.instagram].filter(Boolean),
    hasMap:
      "https://maps.google.com/?q=Sirinsulhiye+Mh.+Degirmen+Vadisi+Sk.+No:+14/1+Kartepe+Kocaeli",
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
