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

  return {
    title: getLocalizedText(post.title),
    description: getLocalizedText(post.excerpt),
    openGraph: { images: post.coverImage ? [{ url: post.coverImage }] : [], url: `${SITE.url}/blog/${post.slug}` },
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
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
