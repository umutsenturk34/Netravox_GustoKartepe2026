import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

/**
 * Builds Next.js metadata from a Page document's seo field.
 * Falls back to the provided defaults when the panel hasn't set a value.
 *
 * @param {object|null} page  - Page document from the API (has page.seo.*)
 * @param {object}      fallback
 * @param {string}      [fallback.title]
 * @param {string}      [fallback.description]
 * @param {string}      [fallback.canonical]
 * @param {string}      [fallback.ogImage]
 */
export function buildPageMetadata(page, fallback = {}) {
  const seo = page?.seo || {};

  const title       = getLocalizedText(seo.title)       || fallback.title;
  const description = getLocalizedText(seo.description) || fallback.description;
  const canonical   = seo.canonical  || fallback.canonical;
  const ogImage     = seo.ogImage    || fallback.ogImage;
  const robots      = seo.robots     || "index,follow";

  const meta = {};

  if (title)       meta.title       = title;
  if (description) meta.description = description;
  if (canonical)   meta.alternates  = { canonical };

  meta.robots = {
    index:  !robots.includes("noindex"),
    follow: !robots.includes("nofollow"),
  };

  meta.openGraph = {
    type:        "website",
    url:         canonical || SITE.url,
    ...(title       && { title }),
    ...(description && { description }),
    ...(ogImage
      ? { images: [{ url: ogImage, width: 1200, height: 630 }] }
      : {}),
  };

  return meta;
}
