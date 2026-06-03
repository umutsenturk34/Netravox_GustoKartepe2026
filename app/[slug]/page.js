import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getPageBySlug } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: "Sayfa Bulunamadı" };
  return buildPageMetadata(page, {
    title: getLocalizedText(page.title),
    canonical: `${SITE.url}/${params.slug}`,
  });
}

export default async function DynamicPage({ params }) {
  const { isEnabled: isDraft } = await draftMode();
  const page = await getPageBySlug(params.slug, isDraft);
  if (!page) notFound();

  const title   = getLocalizedText(page.title);
  const content = typeof page.content === "string"
    ? page.content
    : getLocalizedText(page.content) || "";
  const hasBlocks = Array.isArray(page.blocks) && page.blocks.length > 0;

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: title, url: `/${params.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <Breadcrumb items={breadcrumbs} />

      <main className="bg-[var(--cream)]">
        {hasBlocks ? (
          /* ── Block-based page ── */
          <BlockRenderer blocks={page.blocks} />
        ) : (
          /* ── Legacy HTML content page ── */
          <>
            {page.featuredImage && (
              <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
                <Image src={page.featuredImage} alt={title} fill className="object-cover" priority sizes="100vw" />
                <div className="absolute inset-0 bg-[var(--dark)]/50" />
                <div className="relative z-10 flex h-full items-end container-shell pb-12">
                  <h1 className="text-4xl font-bold text-white md:text-5xl">{title}</h1>
                </div>
              </div>
            )}
            <article className="container-shell py-16">
              {!page.featuredImage && (
                <header className="mb-12 max-w-3xl">
                  <h1 className="text-4xl font-bold text-[var(--dark)] md:text-5xl">{title}</h1>
                </header>
              )}
              {content && (
                <div
                  className="mx-auto max-w-3xl text-base leading-8 text-[var(--muted)]
                    prose max-w-none
                    [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[var(--dark)]
                    [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[var(--dark)]
                    [&_p]:mb-5 [&_p:last-child]:mb-0
                    [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-1
                    [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-1
                    [&_strong]:font-bold [&_strong]:text-[var(--dark)]
                    [&_a]:text-[var(--bordeaux)] [&_a]:underline [&_a:hover]:opacity-75
                    [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--bordeaux)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6
                    [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[var(--beige)] [&_th]:p-3 [&_th]:text-left [&_th]:bg-[var(--beige)] [&_td]:border [&_td]:border-[var(--beige)] [&_td]:p-3"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </article>
          </>
        )}
      </main>
    </>
  );
}
