import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCompany, getGallery, getPage, getTeam } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { getLocalizedText, normalizeImage } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPage("about");
  return buildPageMetadata(page, {
    title: "Hakkımızda",
    description: "Kartepe'nin kalbinde, 8.000 m² doğa içinde kurulan Gusto Kartepe'nin hikayesi.",
    canonical: `${SITE.url}/hakkimizda`,
  });
}

const EXPERIENCE_LABELS = [
  { title: "Taze & Yerel", desc: "Günlük tedarik edilen yerel ürünlerle hazırlanan tabaklar." },
  { title: "Doğa Manzarası", desc: "Ormanın içinde, dere sesiyle bütünleşen sakin bir atmosfer." },
  { title: "Özel Etkinlikler", desc: "Aile buluşmaları ve kurumsal organizasyonlar için esnek alanlar." },
];

export default async function HakkimizdaPage() {
  const [company, page, team, gallery] = await Promise.all([getCompany(), getPage("about"), getTeam(), getGallery()]);

  if (Array.isArray(page?.blocks) && page.blocks.length > 0) {
    return (
      <>
        <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hakkımızda", url: "/hakkimizda" }]} />
        <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hakkımızda", url: "/hakkimizda" }]} />
        <BlockRenderer blocks={page.blocks} />
      </>
    );
  }

  const c = company?.content || {};
  const galleryUrls = (gallery || []).map((img) => img.url).filter(Boolean);

  const heroImage       = c.aboutHeroImage || c.heroImage || company?.heroImage || company?.coverImage || galleryUrls[0] || null;
  const splitImage      = c.aboutSplitImage || c.aboutHeroImage || galleryUrls[1] || galleryUrls[0] || null;
  const para2           = getLocalizedText(c.aboutParagraph2, "");
  const para3           = getLocalizedText(c.aboutParagraph3, "");
  const values          = c.values || [];
  const aboutImages     = (c.aboutImages || []).filter(Boolean);

  // Build experience cards from panel or gallery images (no Unsplash fallback)
  const experienceCards = c.experienceCards?.length
    ? c.experienceCards
    : EXPERIENCE_LABELS.map((label, i) => ({
        ...label,
        img: galleryUrls[i] || null,
      })).filter((card) => card.img);
  const aboutQuote      = c.aboutQuote || { text: "Doğanın sunduğu huzuru, modern mutfağın ustalığıyla buluşturuyoruz. Sofranızda her lokmada Kartepe’nin ruhu yaşıyor.", author: "Ahmet Yıldız — Kurucu & Baş Şef" };

  const t = {
    heroEyebrow:        getLocalizedText(c.aboutPageEyebrow,        "Hakkımızda"),
    heroTitle:          getLocalizedText(c.aboutHeroTitle,           "Doğanın Kalbinde Bir Lezzet Hikayesi"),
    storyEyebrow:       getLocalizedText(c.aboutStoryEyebrow,        "Hikayemiz"),
    storyTitle:         getLocalizedText(c.aboutStoryTitle,          "Orman İçinde Özenle Tasarlanmış Bir Dünya"),
    storyCtaLink:       getLocalizedText(c.aboutStoryCtaLink,        "Rezervasyon Yap"),
    gastronomyEyebrow:  getLocalizedText(c.aboutGastronomyEyebrow,   "Bizi Farklı Kılan"),
    gastronomyTitle:    getLocalizedText(c.aboutGastronomyTitle,     "En İyi Gastronomi Deneyimi"),
    valuesEyebrow:      getLocalizedText(c.aboutValuesEyebrow,       "Değerlerimiz"),
    valuesTitle:        getLocalizedText(c.aboutValuesTitle,         "Gusto Vizyonu"),
    ctaEyebrow:         getLocalizedText(c.aboutCtaEyebrow,          "Sizi Bekliyoruz"),
    ctaTitle:           getLocalizedText(c.aboutCtaTitle,            "Doğayla İç İçe Gusto Deneyimini Keşfedin"),
    ctaDesc:            getLocalizedText(c.aboutCtaDesc,             "Hafta sonu kaçamağı, özel kutlama ya da iş yemeği — Gusto Kartepe her ziyaret için hazır."),
    ctaBtn1:            getLocalizedText(c.aboutCtaBtn1,             "Rezervasyon Yap"),
    ctaBtn2:            getLocalizedText(c.aboutCtaBtn2,             "Menüyü İncele"),
    teamEyebrow:        getLocalizedText(c.teamEyebrow,              "Ekibimiz"),
    teamTitle:          getLocalizedText(c.teamTitle,                "Misafir Deneyimini Tasarlayan Ekip"),
  };

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hakkımızda", url: "/hakkimizda" }]} />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Hakkımızda", url: "/hakkimizda" }]} />

      {/* ── 1. HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Gusto Kartepe"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,24,16,0.82) 0%, rgba(30,24,16,0.55) 100%)" }} />
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4 text-white/60">{t.heroEyebrow}</p>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.heroTitle}
          </h1>
          <p className="mt-5 text-base text-white/75 max-w-xl mx-auto leading-relaxed">
            {getLocalizedText(company?.description, "Kartepe'nin 8.000 m² yeşil alanında huzurun ve lezzetin merkezi.")}
          </p>
        </div>
      </section>

      {/* ── 2. SPLIT — görsel + metin ──────────────────────────────── */}
      <section className="bg-[var(--cream)] py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Image */}
          {splitImage && (
            <div className="relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(30,24,16,0.14)]">
              <Image
                src={splitImage}
                alt="Gusto Kartepe mekan"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 55vw"
              />
            </div>
          )}
          {/* Text */}
          <div>
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: "var(--bordeaux)" }}>
              {t.storyEyebrow}
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--dark)] leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.storyTitle}
            </h2>
            {para2 && (
              <div
                className="mt-6 text-sm leading-relaxed text-[var(--muted)] [&_p]:mb-3 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: para2 }}
              />
            )}
            {para3 && (
              <div
                className="mt-4 text-sm leading-relaxed text-[var(--muted)] [&_p]:mb-3 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: para3 }}
              />
            )}
            <Link
              href="/restoran/rezervasyon"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] transition"
              style={{ color: "var(--bordeaux)" }}
            >
              {t.storyCtaLink} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. GASTRONOMİ DENEYİMİ ─────────────────────────────────── */}
      {experienceCards.length > 0 && (
        <section className="py-20" style={{ background: "var(--cream)" }}>
          <div className="container-shell">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                {t.gastronomyEyebrow}
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.gastronomyTitle}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {experienceCards.map((card, i) => (
                <article key={i} className="overflow-hidden rounded-2xl bg-white border border-[var(--beige)] shadow-[0_4px_24px_rgba(30,24,16,0.07)]">
                  <div className="relative h-52">
                    <Image src={card.img} alt={card.title} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{card.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. VİZYON LİSTESİ ──────────────────────────────────────── */}
      {values.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-shell max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                {t.valuesEyebrow}
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.valuesTitle}
              </h2>
            </div>
            <ul className="space-y-6">
              {values.map((v, i) => (
                <li key={i} className="flex items-start gap-5">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ background: "var(--bordeaux)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--dark)]">{getLocalizedText(v.title)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{getLocalizedText(v.description)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 5. ALINTI ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--cream)]">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p
            className="text-2xl md:text-3xl font-bold italic leading-relaxed"
            style={{ color: "var(--bordeaux)", fontFamily: "var(--font-playfair)" }}
          >
            &ldquo;{aboutQuote.text}&rdquo;
          </p>
          <p className="mt-6 text-xs font-bold tracking-[0.3em] uppercase text-[var(--muted)]">
            {aboutQuote.author}
          </p>
        </div>
      </section>

      {/* ── 6. GALERİ GRID ─────────────────────────────────────────── */}
      {aboutImages.length > 0 && (
        <section className="py-4">
          <div className={`grid gap-1 ${aboutImages.length >= 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
            {aboutImages.slice(0, 4).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt={`Gusto Kartepe ${i + 1}`}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. CTA BANNER ──────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--cream)]">
        <div className="container-shell text-center">
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: "var(--bordeaux)" }}>
            {t.ctaEyebrow}
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.ctaTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] max-w-md mx-auto">
            {t.ctaDesc}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/restoran/rezervasyon"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:opacity-90"
              style={{ background: "var(--bordeaux)" }}
            >
              {t.ctaBtn1} <ArrowRight size={14} />
            </Link>
            <Link
              href="/restoran/menu"
              className="inline-flex items-center gap-2 rounded-xl border-2 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] transition hover:bg-[var(--beige)]"
              style={{ borderColor: "var(--bordeaux)", color: "var(--bordeaux)" }}
            >
              {t.ctaBtn2}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. EKİP (varsa) ────────────────────────────────────────── */}
      {(team || []).length > 0 && (
        <section className="py-20" style={{ background: "var(--beige)", opacity: 0.97 }}>
          <div className="container-shell">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>{t.teamEyebrow}</p>
              <h2 className="text-3xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                {t.teamTitle}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => {
                const photo = normalizeImage(member.photo);
                return (
                  <article key={member._id} className="overflow-hidden rounded-2xl bg-white border border-[var(--beige)] shadow-sm">
                    {photo ? (
                      <div className="relative h-64">
                        <Image src={photo} alt={getLocalizedText(member.name)} fill className="object-cover" sizes="33vw" />
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center" style={{ background: "var(--beige)" }}>
                        <span className="text-5xl opacity-30">👤</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                        {getLocalizedText(member.name)}
                      </h3>
                      <p className="mt-1 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--bordeaux)" }}>
                        {getLocalizedText(member.title)}
                      </p>
                      {member.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                          {getLocalizedText(member.bio)}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
