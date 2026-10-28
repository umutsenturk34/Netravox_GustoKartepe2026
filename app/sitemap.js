import { getBlog, getPagesList } from "@/lib/api";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

// Şablonlu sayfaların sitedeki adresi
const TEMPLATE_PATH = {
  home: "/",
  about: "/hakkimizda",
  contact: "/iletisim",
  menu: "/restoran/menu",
  reservation: "/restoran/rezervasyon",
  gallery: "/restoran/galeri",
};

// Panelde bulunmasa da yayında olan sabit sayfalar
const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/hakkimizda", priority: 0.8, changeFrequency: "monthly" },
  { path: "/restoran", priority: 0.9, changeFrequency: "weekly" },
  { path: "/restoran/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/restoran/rezervasyon", priority: 0.8, changeFrequency: "monthly" },
  { path: "/restoran/galeri", priority: 0.7, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.7, changeFrequency: "monthly" },
  { path: "/deneyimler", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sss", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
];

const pathOf = (p) => {
  if (TEMPLATE_PATH[p.template]) return TEMPLATE_PATH[p.template];
  const slug = getLocalizedText(p.slug).replace(/^\/+|\/+$/g, "");
  return slug ? `/${slug}` : null;
};

export default async function sitemap() {
  const [blogData, pages] = await Promise.all([getBlog(), getPagesList()]);
  const posts = Array.isArray(blogData) ? blogData : (blogData?.posts ?? []);
  const panelPages = Array.isArray(pages) ? pages : [];

  // Panelde noindex işaretli sayfalar sitemap'e girmez; panelde oluşturulan diğer sayfalar eklenir.
  const noindex = new Set();
  const extra = new Map();
  for (const p of panelPages) {
    const path = pathOf(p);
    if (!path) continue;
    if (String(p.seo?.robots || "").includes("noindex")) noindex.add(path);
    else if (!STATIC_ROUTES.some((r) => r.path === path)) {
      extra.set(path, { path, priority: 0.6, changeFrequency: "monthly", lastModified: p.updatedAt || p.publishedAt });
    }
  }

  const routes = [...STATIC_ROUTES, ...extra.values()]
    .filter((r) => !noindex.has(r.path))
    .map(({ path, lastModified, ...rest }) => ({
      url: path === "/" ? SITE.url : `${SITE.url}${path}`,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
      ...rest,
    }));

  const blogRoutes = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
