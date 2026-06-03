import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export function BlogPostSchema({ post, company }) {
  const title = getLocalizedText(post?.title);
  const description = getLocalizedText(post?.excerpt);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: post?.coverImage ? [post.coverImage] : [],
    datePublished: post?.publishedAt,
    dateModified: post?.updatedAt || post?.publishedAt,
    author: { "@type": "Organization", name: company?.name || SITE.name },
    publisher: {
      "@type": "Organization",
      name: company?.name || SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post?.slug}` },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
