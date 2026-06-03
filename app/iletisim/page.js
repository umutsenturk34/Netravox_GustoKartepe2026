import IletisimPageClient from "@/components/contact/IletisimPageClient";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { getCompany, getGallery, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

export async function generateMetadata() {
  const page = await getPage("contact");
  return buildPageMetadata(page, {
    title: "İletişim",
    description: "Gusto Kartepe ile iletisime gecin. Adres: Sirinsulhiye Mh. Degirmen Vadisi Sk. No: 14/1, Kartepe/Kocaeli.",
    canonical: `${SITE.url}/iletisim`,
  });
}

export default async function IletisimPage() {
  const [company, page, galleryImages] = await Promise.all([getCompany(), getPage("contact"), getGallery()]);

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "İletişim", url: "/iletisim" }]} />
      <LocalBusinessSchema company={company} />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "İletişim", url: "/iletisim" }]} />
      {Array.isArray(page?.blocks) && page.blocks.length > 0 && (
        <BlockRenderer blocks={page.blocks} />
      )}
      <IletisimPageClient company={company} galleryImages={galleryImages ?? []} />
    </>
  );
}
