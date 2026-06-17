import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export function BlogPostSchema({ post, company }) {
  const seo = post?.seo || {};
  const title       = getLocalizedText(seo.metaTitle) || getLocalizedText(post?.title);
  const description = getLocalizedText(seo.metaDesc)  || getLocalizedText(post?.excerpt);
  const ogImage     = seo.ogImage || post?.coverImage;
  const companyName = company?.name || SITE.name;
  const logoUrl     = company?.branding?.logo || `${SITE.url}/logo.svg`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: ogImage ? [ogImage] : [],
    datePublished: post?.publishedAt,
    dateModified: post?.updatedAt || post?.publishedAt,
    author: { "@type": "Organization", name: companyName, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: companyName,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: logoUrl },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post?.slug}` },
    url: `${SITE.url}/blog/${post?.slug}`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
