import { SITE } from "@/lib/siteConfig";

export function MenuSchema({ categories, company }) {
  const companyName = company?.name || SITE.name;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${companyName} Menüsü`,
    url: `${SITE.url}/restoran/menu`,
    hasMenuSection: (categories || []).map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      description: category.description || undefined,
      hasMenuItem: (category.items || []).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description || undefined,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: item.currency || "TRY",
        },
        image: item.image || undefined,
      })),
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
