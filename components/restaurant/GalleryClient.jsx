import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";

import GalleryGrid from "./GalleryGrid";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { getCompanyContact, getLocalizedText } from "@/lib/utils";
import { SITE } from "@/lib/siteConfig";

const FEATURED_TITLES = {
  Kahvalti: "Serpme Kahvaltı",
  Restoran: "Huzurlu Atmosfer",
  Lezzetler: "Özel Lezzetler",
  Doga: "Doğa İçinde",
  Etkinlikler: "Özel Etkinlikler",
  "Mekan Detaylari": "Mekan Detayları",
};

export default function GalleryClient({ images, featuredImages = [], company, hasBlocks }) {
  const contact = getCompanyContact(company);
  const instagramUrl = contact.instagram || SITE.instagram;
  const instagramHandle = instagramUrl
    ? instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "").replace(/\/$/, "")
    : "gustokartepe";

  const featured = featuredImages.length > 0 ? featuredImages : [];

  return (
    <main className="bg-[var(--cream)]">

      {/* ── Hero — panelden blok varsa gizlenir ─────────── */}
      {!hasBlocks && (
        <section className="pt-20 pb-10 text-center container-shell max-w-2xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4" style={{ color: "var(--bordeaux)" }}>
            Gastronomi
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            Zarif Bir{" "}
            <em className="not-italic" style={{ color: "var(--bordeaux)", fontStyle: "italic" }}>Atmosfer</em>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-[var(--muted)] max-w-lg mx-auto">
            Doğanın kucağında sakin bir sofra, taze tatlar ve unutulmaz anlar. Gusto Kartepe&apos;nin ruhunu keşfedin.
          </p>
        </section>
      )}

      {/* ── Masonry Gallery + Filters ──────────────────── */}
      <section className={`pb-16 ${hasBlocks ? "pt-10" : ""}`}>
        <div className="container-shell">
          {images.length ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="rounded-2xl bg-white p-16 text-center text-[var(--muted)] text-sm">
              Galeri görselleri henüz yüklenmedi.
            </div>
          )}
        </div>
      </section>

      {/* ── Öne Çıkan Anlar ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-shell">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
                  Seçkimiz
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Öne Çıkan{" "}
                  <em style={{ color: "var(--bordeaux)", fontStyle: "italic" }}>Anlar</em>
                </h2>
              </div>
              <Link
                href="/restoran/galeri"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:opacity-70"
                style={{ color: "var(--bordeaux)" }}
              >
                Görsel Galerimiz <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((img, i) => {
                const cat = img.category;
                const title = FEATURED_TITLES[cat] || getLocalizedText(img.caption) || `Gusto Kartepe ${i + 1}`;
                const desc = getLocalizedText(img.alt) || "Doğanın içinde özenle hazırlanan her an.";
                return (
                  <article key={img._id || i} className="group overflow-hidden rounded-2xl bg-white border border-[var(--beige)] shadow-[0_4px_24px_rgba(30,24,16,0.06)]">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={img.url}
                        alt={getLocalizedText(img.alt) || title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="33vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{desc}</p>
                      <p className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-1" style={{ color: "var(--bordeaux)" }}>
                        Daha Fazla <ArrowRight size={11} />
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Instagram CTA ──────────────────────────────── */}
      <section className="py-20" style={{ background: "#fdf2f2" }}>
        <div className="container-shell text-center max-w-lg mx-auto">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-6 mx-auto"
            style={{ background: "var(--bordeaux)" }}
          >
            <Instagram size={26} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Bizi Instagram&apos;da Takip Edin
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            En yeni fotoğraflar, günlük lezzetler ve anlık atmosfer için sosyal medyamızı takip edin.
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:opacity-90"
            style={{ background: "var(--bordeaux)" }}
          >
            @{instagramHandle}
          </a>
        </div>
      </section>

    </main>
  );
}
