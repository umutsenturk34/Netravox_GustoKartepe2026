import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";

import FaqAccordion from "@/components/faq/FaqAccordion";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getFaqs, getCompany, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

export async function generateMetadata() {
  const page = await getPage("generic");
  return buildPageMetadata(page, {
    title: "Sıkça Sorulan Sorular",
    description: "Rezervasyon, menü, ulaşım ve özel etkinlikler hakkında en sık sorulan soruların yanıtlarını burada bulabilirsiniz.",
    canonical: `${SITE.url}/sss`,
  });
}

export default async function SssPage() {
  const [faqs, company] = await Promise.all([getFaqs(), getCompany()]);
  const items = Array.isArray(faqs) ? faqs : [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          { name: "Sıkça Sorulan Sorular", url: "/sss" },
        ]}
      />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Sıkça Sorulan Sorular", url: "/sss" }]} />

      <main className="min-h-screen bg-[var(--cream)] pt-10 pb-24">
        {/* ── Sayfa başlığı ── */}
        <div className="container-shell pt-10 pb-14 text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(130,23,27,0.08)" }}
          >
            <MessageCircleQuestion size={24} style={{ color: "var(--bordeaux)" }} />
          </div>
          <h1
            className="font-playfair text-4xl leading-tight text-[var(--dark)] md:text-5xl"
          >
            Sıkça Sorulan Sorular
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
            {company?.content?.faqSubtitle ||
              "Aklınıza takılan her şey için buradayız. Cevabı bulamazsanız bize doğrudan ulaşın."}
          </p>
        </div>

        {/* ── Accordion ── */}
        <div className="container-shell max-w-3xl">
          <FaqAccordion faqs={items} />

          {/* ── CTA ── */}
          <div
            className="mt-14 rounded-2xl px-8 py-10 text-center"
            style={{ background: "rgba(130,23,27,0.05)", border: "1px solid rgba(130,23,27,0.12)" }}
          >
            <p className="font-semibold text-[var(--dark)]">
              {company?.content?.faqCtaTitle || "Aradığınız cevabı bulamadınız mı?"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {company?.content?.faqCtaDesc || "Ekibimiz size yardımcı olmaktan mutluluk duyar."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90"
                style={{ background: "var(--bordeaux)" }}
              >
                Bize Ulaşın <ArrowRight size={14} />
              </Link>
              <Link
                href="/restoran/rezervasyon"
                className="inline-flex items-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition hover:bg-[var(--beige)]"
                style={{ borderColor: "var(--bordeaux)", color: "var(--bordeaux)" }}
              >
                Rezervasyon Yap
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
