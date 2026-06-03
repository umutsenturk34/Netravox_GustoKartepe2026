import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import MenuCategoryClient from "@/components/restaurant/MenuCategoryClient";
import { getMenu } from "@/lib/api";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getMenu();
  const cat = (categories || []).find(
    (c) => slugify(getLocalizedText(c.name, "")) === slug
  );
  if (!cat) return {};
  const name = getLocalizedText(cat.name, "");
  return {
    title: `${name} — Gusto Kartepe Menü`,
    description: getLocalizedText(cat.description, `Gusto Kartepe ${name} kategorisi`),
    alternates: { canonical: `${SITE.url}/restoran/menu/${slug}` },
  };
}

export default async function MenuCategoryPage({ params }) {
  const { slug } = await params;
  const categories = await getMenu();

  const category = (categories || []).find(
    (c) => slugify(getLocalizedText(c.name, "")) === slug
  );

  if (!category) notFound();

  const catName = getLocalizedText(category.name, "");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Restoran", url: "/restoran" },
          { name: "Menü", url: "/restoran/menu" },
          { name: catName, url: `/restoran/menu/${slug}` },
        ]}
      />
      <Breadcrumb
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Restoran", url: "/restoran" },
          { name: "Menü", url: "/restoran/menu" },
          { name: catName, url: `/restoran/menu/${slug}` },
        ]}
      />
      <MenuCategoryClient category={category} />
    </>
  );
}
