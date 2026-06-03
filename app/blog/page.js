import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import BlogList from "@/components/blog/BlogList";
import { getBlog, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

export async function generateMetadata() {
  const page = await getPage("generic");
  return buildPageMetadata(page, {
    title: "Blog",
    description: "Gusto Kartepe'den doga, gastronomi ve Kartepe haberleri.",
    canonical: `${SITE.url}/blog`,
  });
}

export default async function BlogPage({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page) || 1);
  const data = await getBlog(page, 9);

  const posts      = data?.posts      ?? [];
  const pagination = data?.pagination ?? { page: 1, pages: 1, total: 0 };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <BlogList posts={posts} pagination={pagination} />
    </>
  );
}
