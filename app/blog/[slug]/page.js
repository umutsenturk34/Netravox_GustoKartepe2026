import { notFound } from "next/navigation";

import BlogPostClient from "@/components/blog/BlogPostClient";
import { BlogPostSchema } from "@/components/seo/BlogPostSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getBlogAll, getBlogPost, getCompany } from "@/lib/api";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export async function generateStaticParams() {
  const data = await getBlogAll();
  const posts = data?.posts ?? data ?? [];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return { title: "Blog Yazisi Bulunamadi" };
  }

  const seo = post.seo || {};
  const title = getLocalizedText(seo.metaTitle) || getLocalizedText(post.title);
  const description = getLocalizedText(seo.metaDesc) || getLocalizedText(post.excerpt);
  const image = seo.ogImage || post.coverImage;
  const canonical = seo.canonicalUrl || `${SITE.url}/blog/${post.slug}`;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [{ url: image }] : [], url: canonical },
    alternates: { canonical },
  };
}

export default async function BlogPostPage({ params }) {
  const [post, company] = await Promise.all([getBlogPost(params.slug), getCompany()]);

  if (!post) notFound();

  return (
    <>
      <BlogPostSchema post={post} company={company} />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: getLocalizedText(post.title), url: `/blog/${post.slug}` },
        ]}
      />
      <Breadcrumb items={[
        { name: "Ana Sayfa", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: getLocalizedText(post.title), url: `/blog/${post.slug}` },
      ]} />
      <BlogPostClient post={post} />
    </>
  );
}
