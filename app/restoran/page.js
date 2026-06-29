import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Star, Users, Clock } from "lucide-react";

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCompany, getGallery, getMenu, getPage } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { getFeaturedMenuItems, getLocalizedText, normalizeImage } from "@/lib/utils";

export async function generateMetadata() {
  const page = await getPage("menu");
  return buildPageMetadata(page, {
    title: "Restoran",
    description: "Kartepe ormanlarinda premium dining deneyimi. Sefin onerileri ve yerel malzemelerle hazirlanan ozel tarifler.",
    canonical: `${SITE.url}/restoran`,
  });
}

const DEFAULT_STATS = [
  { icon: Users, value: "200+", label: "Misafir Kapasitesi" },
  { icon: Clock,  value: "09–22", label: "Her Gün Açık" },
  { icon: Leaf,   value: "8.000 m²", label: "Doğal Alan" },
  { icon: Star,   value: "5★", label: "Misafir Memnuniyeti" },
];

const MOMENT_LABELS = ["Serpme Kahvaltı", "Açık Ateş Lezzetleri", "Şömine Köşesi", "Doğa İçinde Sofra"];

export default async function RestoranPage() {
  const [company, gallery, menu, page] = await Promise.all([getCompany(), getGallery(), getMenu(), getPage("generic")]);

  const content       = company?.content || {};
  const heroImage     = content.heroImage || (gallery || [])[0]?.url || null;
  const featuredDishes = getFeaturedMenuItems(menu || []).slice(0, 3);

  // Build moments from panel content or gallery images (no Unsplash fallback)
  const moments = content.restaurantMoments?.length
    ? content.restaurantMoments
    : (gallery || []).slice(0, 4).map((img, i) => ({ title: MOMENT_LABELS[i] || `Görsel ${i + 1}`, img: img.url }));

  const stats          = content.restaurantStats?.length ? content.restaurantStats : DEFAULT_STATS;

  const atmosImages = [
    (gallery || [])[0]?.url,
    (gallery || [])[1]?.url,
    (gallery || [])[2]?.url,
    (gallery || [])[3]?.url,
  ].filter(Boolean);

  const quote = content.restaurantQuote || {
    text: "Yemek, yemek sadece doymak değil; doğanın ritmiyle ayırt içinde, özenle seçilmiş tatların ve anların harmanlasında bir sanattır.",
    author: "Gusto Kartepe",
  };

  const rt = {
    heroEyebrow:      getLocalizedText(content.restaurantHeroEyebrow,   "Kartepe / Kocaeli"),
    heroTitle:        getLocalizedText(content.restaurantHeroTitle,      getLocalizedText(company?.name, "Gusto Kartepe") + " Restoranı"),
    momentsEyebrow:   getLocalizedText(content.restaurantMomentsEyebrow, "Deneyim"),
    momentsTitle:     getLocalizedText(content.restaurantMomentsTitle,   "Unutulmaz Anlar Yaşayın"),
    atmosEyebrow:     getLocalizedText(content.restaurantAtmosEyebrow,   "Mekan"),
    atmosTitle:       getLocalizedText(content.restaurantAtmosTitle,     "Atmosferi Keşfedin"),
  };

  if (Array.isArray(page?.blocks) && page.blocks.length > 0) {
    return (
      <main>
        <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Restoran", url: "/restoran" }]} />
        <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Restoran", url: "/restoran" }]} />
        <BlockRenderer blocks={page.blocks} />
      </main>
    );
  }

  return (
    <main>
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Restoran", url: "/restoran" }]} />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Restoran", url: "/restoran" }]} />

      {/* ── 1. HERO ────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Gusto Kartepe Restoranı"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(12,10,8,0.85) 0%, rgba(12,10,8,0.55) 55%, rgba(12,10,8,0.25) 100%)" }} />
        <div className="relative z-10 container-shell pb-16 max-w-2xl mr-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 text-white/60">
            {rt.heroEyebrow}
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-[0.95]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {rt.heroTitle}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70 max-w-md">
            {getLocalizedText(company?.description, "Kartepe'nin 8.000 m² yeşil alanında huzurun ve lezzetin merkezi.")}
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/restoran/rezervasyon"
              className="inline-flex items-center gap-2 rounded px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
              style={{ background: "var(--bordeaux)" }}
            >
              Rezervasyon <ArrowRight size={13} />
            </Link>
            <Link
              href="/restoran/menu"
              className="inline-flex items-center gap-2 rounded border border-white/30 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/70"
            >
              Menüyü İncele
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. QUOTE ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-shell max-w-3xl mx-auto text-center">
          <p className="text-5xl font-bold leading-none mb-6" style={{ color: "var(--beige)", fontFamily: "var(--font-playfair)" }}>&ldquo;</p>
          <blockquote
            className="text-xl md:text-2xl font-bold italic leading-relaxed text-[var(--dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {quote.text}
          </blockquote>
          <p className="mt-6 text-xs font-bold tracking-[0.3em] uppercase text-[var(--muted)]">
            — {quote.author}
          </p>
        </div>
      </section>

      {/* ── 3. UNUTULMAZ ANLAR ─────────────────────────────── */}
      {moments.length > 0 && (
        <section className="py-16 bg-[var(--cream)]">
          <div className="container-shell">
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                {rt.momentsEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                {rt.momentsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moments.map((m, i) => (
                <article key={i} className="group">
                  <div className="relative h-52 md:h-64 overflow-hidden rounded-xl">
                    <Image
                      src={m.img}
                      alt={m.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {m.title}
                  </p>
                  {m.desc && <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{m.desc}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. ATMOSFERİ KEŞFEDİN ─────────────────────────── */}
      {atmosImages.length >= 4 && (
        <section className="py-16 bg-white">
          <div className="container-shell">
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                {rt.atmosEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                {rt.atmosTitle}
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Sol — büyük görsel */}
              <div className="relative h-[480px] overflow-hidden rounded-2xl">
                <Image
                  src={atmosImages[0]}
                  alt="Restoran atmosferi"
                  fill
                  className="object-cover"
                  sizes="55vw"
                />
              </div>
              {/* Sağ — 2x2 grid */}
              <div className="grid grid-cols-2 gap-4">
                {atmosImages.slice(1, 5).map((src, i) => (
                  <div key={i} className="relative h-[228px] overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`Gusto Kartepe ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. STATS ───────────────────────────────────────── */}
      <section className="py-14 bg-[var(--cream)]">
        <div className="container-shell">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon || Star;
              return (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgba(30,24,16,0.06)]">
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "var(--beige)" }}
                  >
                    <Icon size={18} style={{ color: "var(--bordeaux)" }} />
                  </div>
                  <p className="text-2xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs font-bold tracking-[0.15em] uppercase text-[var(--muted)]">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. ŞEFİN ÖNERİLERİ ────────────────────────────── */}
      {featuredDishes.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-shell">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                  Menü
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Şefin Önerileri
                </h2>
              </div>
              <Link
                href="/restoran/menu"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:opacity-70"
                style={{ color: "var(--bordeaux)" }}
              >
                Tüm Menü <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredDishes.map((dish, i) => {
                const img = normalizeImage(dish.image);
                return (
                  <article key={dish._id || i} className="group overflow-hidden rounded-2xl bg-white border border-[var(--beige)] shadow-[0_4px_20px_rgba(30,24,16,0.06)]">
                    <div className="relative h-52 overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={getLocalizedText(dish.name)}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="33vw"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-4xl" style={{ background: "var(--beige)" }}>
                          🍽
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white" style={{ background: "var(--bordeaux)" }}>
                          Şefin Önerisi
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                        {getLocalizedText(dish.name)}
                      </h3>
                      {dish.description && (
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
                          {getLocalizedText(dish.description)}
                        </p>
                      )}
                      {dish.price && (
                        <p className="mt-3 text-sm font-bold" style={{ color: "var(--bordeaux)" }}>
                          {dish.price} ₺
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

      {/* ── 7. CTA BANNER ──────────────────────────────────── */}
      <section
        className="py-24 text-white text-center relative overflow-hidden"
        style={{ background: "var(--dark)" }}
      >
        {heroImage && (
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
        <div className="relative z-10 container-shell max-w-2xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase mb-5 text-white/60">
            Rezervasyon
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Bu Eşsiz Deneyime<br />Ortak Olun
          </h2>
          <p className="mt-5 text-sm text-white/65 max-w-lg mx-auto leading-relaxed">
            Hafta sonu kaçamağı, özel kutlama veya iş yemeği — masanızı hemen ayırtın.
          </p>
          <Link
            href="/restoran/rezervasyon"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-9 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
            style={{ background: "var(--bordeaux)" }}
          >
            Rezervasyon Yap <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </main>
  );
}
