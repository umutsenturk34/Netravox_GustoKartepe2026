import { SITE } from "@/lib/siteConfig";
import { getCompanyContact } from "@/lib/utils";

const DAY_ABBR = {
  Pazartesi: "Mo", Salı: "Tu", Çarşamba: "We",
  Perşembe: "Th", Cuma: "Fr", Cumartesi: "Sa", Pazar: "Su",
};

function buildOpeningHoursStrings(workingHours) {
  if (!Array.isArray(workingHours) || !workingHours.length) return [SITE.openingHours];
  return workingHours
    .filter((s) => s.isOpen && s.day && s.open && s.close)
    .map((s) => `${DAY_ABBR[s.day] || s.day} ${s.open}-${s.close}`);
}

export function LocalBusinessSchema({ company }) {
  const contact = getCompanyContact(company);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company?.name || SITE.name,
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
    openingHours: buildOpeningHoursStrings(company?.workingHours),
    url: `${SITE.url}/iletisim`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
