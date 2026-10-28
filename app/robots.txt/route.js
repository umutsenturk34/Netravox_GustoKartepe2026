import { getSeoSettings } from "@/lib/api";
import { SITE } from "@/lib/siteConfig";

// robots.txt panelden (SEO → robots.txt) yönetilir; panel boşsa güvenli varsayılan.
export async function GET() {
  const seo = await getSeoSettings();
  let body = (seo?.robotsTxt || "").trim() || "User-agent: *\nAllow: /\nDisallow: /api/";
  if (!/^sitemap:/im.test(body)) body += `\n\nSitemap: ${SITE.url}/sitemap.xml`;
  return new Response(`${body}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
