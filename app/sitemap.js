import { getBlog } from "@/lib/api";
import { SITE } from "@/lib/siteConfig";

export default async function sitemap() {
  const blogData = await getBlog();
  const posts = Array.isArray(blogData) ? blogData : (blogData?.posts ?? []);

  const staticRoutes = [
    { url: SITE.url, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE.url}/hakkimizda`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE.url}/restoran`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE.url}/restoran/menu`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE.url}/restoran/rezervasyon`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE.url}/restoran/galeri`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE.url}/iletisim`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE.url}/deneyimler`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE.url}/blog`, priority: 0.7, changeFrequency: "weekly" },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  const blogRoutes = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
