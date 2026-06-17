import MenuPageClient from "@/components/restaurant/MenuPageClient";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MenuSchema } from "@/components/seo/MenuSchema";
import { getCompany, getMenu, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPage("menu");
  return buildPageMetadata(page, {
    title: "Menü",
    description: "Serpme kahvalti, baslangiclar, ana yemekler - Gusto Kartepe'nin tam menusu.",
    canonical: `${SITE.url}/restoran/menu`,
  });
}

export default async function MenuPage() {
  const [categories, page, company] = await Promise.all([
    getMenu(),
    getPage("menu"),
    getCompany(),
  ]);

  const hasBlocks = Array.isArray(page?.blocks) && page.blocks.length > 0;
  const companyName = getLocalizedText(company?.name, "Gusto Kartepe");
  const companySub  = getLocalizedText(
    company?.content?.menuSubtitle,
    "Mevsimin en taze malzemeleriyle, usta şeflerin özenle hazırladığı lezzetler. Dağ havasının eşlik ettiği sofranızda deneyimlemeniz için davetliyiz."
  );

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Restoran", url: "/restoran" },
          { name: "Menü", url: "/restoran/menu" },
        ]}
      />
      <MenuSchema categories={categories ?? []} company={company} />
      <Breadcrumb items={[
        { name: "Ana Sayfa", url: "/" },
        { name: "Restoran", url: "/restoran" },
        { name: "Menü", url: "/restoran/menu" },
      ]} />

      {/* Panelden eklenen bloklar (header hero vb.) */}
      {hasBlocks && <BlockRenderer blocks={page.blocks} />}

      {/* Menü içeriği — pageTitle/pageSubtitle blok varsa gizlenir */}
      <MenuPageClient
        categories={categories ?? []}
        pageTitle={hasBlocks ? null : companyName}
        pageSubtitle={hasBlocks ? null : companySub}
      />
    </>
  );
}
