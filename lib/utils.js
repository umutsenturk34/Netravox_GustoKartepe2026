import { SITE } from "@/lib/siteConfig";

export function getLocalizedText(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.tr || value.en || Object.values(value)[0] || fallback;
  return fallback;
}

export function getNavigationItems(navigation) {
  const trNavigation = navigation?.tr || navigation?.items || navigation || [];
  return Array.isArray(trNavigation) ? [...trNavigation].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
}

export function getFeaturedMenuItems(categories) {
  return (categories || [])
    .flatMap((category) => category?.items || [])
    .filter((item) => item?.isFeatured)
    .slice(0, 6);
}

export function formatCurrency(price, currency = "TRY") {
  if (price === null || price === undefined || price === "") return "";
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(price));
  } catch {
    return `${price} ${currency}`;
  }
}

export function normalizeImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || image.src || image.thumbnailUrl || null;
}

export function buildAbsoluteUrl(path = "") {
  if (!path) return SITE.url;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getCompanyBranding(company) {
  return {
    primary: company?.branding?.primaryColor || "#82171B",
    secondary: company?.branding?.secondaryColor || "#FBFAF8",
    accent: company?.branding?.accentColor || "#AB9363",
  };
}

export function getCompanyContact(company) {
  return {
    phone: company?.contact?.phone || SITE.phone,
    email: company?.contact?.email || SITE.email,
    address: company?.contact?.address || SITE.address.streetAddress,
    instagram: company?.socialLinks?.instagram || company?.social?.instagram || SITE.instagram,
    facebook: company?.socialLinks?.facebook || company?.social?.facebook || SITE.facebook,
    linkedin: company?.socialLinks?.linkedin || company?.social?.linkedin || SITE.linkedin,
    youtube: company?.socialLinks?.youtube || company?.social?.youtube || SITE.youtube,
    tiktok: company?.socialLinks?.tiktok || company?.social?.tiktok || SITE.tiktok,
  };
}

export function sanitizePhone(phone = "") {
  return phone.replace(/[^\d+]/g, "");
}

export function getCategoryLabel(item) {
  if (item?.isFeatured) return { label: "Imza Lezzet", tone: "bordeaux" };

  const text = `${item?.badge || ""} ${item?.description || ""} ${item?.name || ""}`.toLowerCase();
  if (text.includes("sef")) return { label: "Sef Onerisi", tone: "gold" };
  if (text.includes("fit")) return { label: "Fit", tone: "green" };
  if (text.includes("dogal")) return { label: "Dogal", tone: "green" };
  return null;
}

export function extractGalleryCategory(image) {
  if (image?.category) return image.category;
  const haystack = `${getLocalizedText(image?.caption)} ${getLocalizedText(image?.alt)}`.toLowerCase();
  if (haystack.includes("doga")) return "Doga";
  if (haystack.includes("restoran")) return "Restoran";
  if (haystack.includes("kahvalti")) return "Kahvalti";
  if (haystack.includes("lezzet")) return "Lezzetler";
  if (haystack.includes("etkinlik")) return "Etkinlikler";
  if (haystack.includes("mekan")) return "Mekan Detaylari";
  return "Tumu";
}
