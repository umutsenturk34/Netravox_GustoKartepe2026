import GalleryClient from "@/components/restaurant/GalleryClient";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCompany, getGallery, getFeaturedGallery, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

export async function generateMetadata() {
  const page = await getPage("gallery");
  return buildPageMetadata(page, {
    title: "Galeri",
    description: "Gusto Kartepe'den doga, restoran ve lezzet fotograflari.",
    canonical: `${SITE.url}/restoran/galeri`,
  });
}

export default async function GaleriPage() {
  const [images, featuredImages, company, page] = await Promise.all([getGallery(), getFeaturedGallery(), getCompany(), getPage("gallery")]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Restoran", url: "/restoran" },
          { name: "Galeri", url: "/restoran/galeri" },
        ]}
      />
      <Breadcrumb items={[
        { name: "Ana Sayfa", url: "/" },
        { name: "Restoran", url: "/restoran" },
        { name: "Galeri", url: "/restoran/galeri" },
      ]} />
      {Array.isArray(page?.blocks) && page.blocks.length > 0 && (
        <BlockRenderer blocks={page.blocks} />
      )}
      <GalleryClient
        images={images ?? []}
        featuredImages={featuredImages ?? []}
        company={company}
        hasBlocks={Array.isArray(page?.blocks) && page.blocks.length > 0}
      />
    </>
  );
}
