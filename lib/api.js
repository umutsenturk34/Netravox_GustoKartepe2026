const BASE = process.env.BACKEND_URL;
const SLUG = process.env.TENANT_SLUG;

async function get(path, options = {}) {
  if (!BASE || !SLUG) return null;

  try {
    const res = await fetch(`${BASE}/api/public/${SLUG}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const getCompany = () => get("/company", { next: { revalidate: 3600, tags: ["company"] } });
export const getNavigation = () => get("/navigation", { next: { revalidate: 3600, tags: ["navigation"] } });
export const getFooterNavigation = () => get("/navigation?menu=footer-nav", { next: { revalidate: 3600, tags: ["footer-navigation"] } });
export const getMenu = () => get("/menu", { next: { revalidate: 1800, tags: ["menu"] } });
export const getGallery = () => get("/gallery", { next: { revalidate: 3600, tags: ["gallery"] } });
export const getTestimonials = () => get("/testimonials", { next: { revalidate: 3600, tags: ["testimonials"] } });
export const getTeam = () => get("/team", { next: { revalidate: 86400, tags: ["team"] } });
export const getFaqs = () => get("/faqs", { next: { revalidate: 86400, tags: ["faqs"] } });
export const getBlog = (page = 1, limit = 9) =>
  get(`/blog?page=${page}&limit=${limit}`, {
    next: process.env.NODE_ENV === "production"
      ? { revalidate: 3600, tags: ["blog"] }
      : { revalidate: 0 },
  });
export const getBlogAll = () =>
  get("/blog?page=1&limit=200", { next: { revalidate: 3600, tags: ["blog"] } });
export const getBlogPost = (slug) =>
  get(`/blog/${slug}`, { next: { revalidate: 3600, tags: [`blog-${slug}`] } });
export const getPage = (template) =>
  get(`/pages?template=${template}`, {
    next: process.env.NODE_ENV === "production"
      ? { revalidate: 3600, tags: [`page-${template}`] }
      : { revalidate: 0 },
  });
export const getPageBySlug = (slug, preview = false) =>
  preview
    ? get(`/pages/${slug}?preview=1`, {
        cache: "no-store",
        headers: { "x-preview-secret": process.env.REVALIDATE_SECRET },
      })
    : get(`/pages/${slug}`, { next: { revalidate: 3600, tags: [`page-slug-${slug}`] } });
export const getSeoSettings = () =>
  get("/seo-settings", { next: { revalidate: 3600, tags: ["seo-settings"] } });
export const getSchemas = (page) =>
  get(`/schemas?page=${page}`, { next: { revalidate: 3600, tags: [`schemas-${page}`] } });
export const getAvailability = (date) =>
  get(`/reservation/availability?date=${date}`, { cache: "no-store" });
export const getRedirects = () => get("/redirects", { next: { revalidate: 300, tags: ["redirects"] } });
export const getPopups = () => get("/popups", { next: { revalidate: 300, tags: ["popups"] } });

export async function postReservation(body) {
  if (!BASE || !SLUG) {
    throw new Error("Rezervasyon servisi su anda kullanilamiyor.");
  }

  const res = await fetch(`${BASE}/api/public/${SLUG}/reservation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Rezervasyon olusturulamadi");
  return data;
}

export async function postContact(body) {
  if (!BASE || !SLUG) {
    throw new Error("Iletisim servisi su anda kullanilamiyor.");
  }

  const res = await fetch(`${BASE}/api/public/${SLUG}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gonderme basarisiz");
  return data;
}
