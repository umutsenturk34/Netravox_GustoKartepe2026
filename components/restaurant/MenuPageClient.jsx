"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, getLocalizedText, normalizeImage } from "@/lib/utils";

export function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

// ── Featured (büyük, tam genişlik) ────────────────────────────────────────────
export function FeaturedItem({ item }) {
  const name  = getLocalizedText(item.name, "—");
  const desc  = getLocalizedText(item.description, "");
  const img   = normalizeImage(item.image);
  const price = formatCurrency(item.price, item.currency || "TRY");

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[var(--beige)] bg-white shadow-[0_8px_32px_rgba(30,24,16,0.07)]">
      <div className="grid md:grid-cols-[1.6fr_1fr]">
        <div className="relative bg-[#e8dfd0] aspect-[4/3] md:aspect-auto md:min-h-[320px]">
          {img ? (
            <Image src={img} alt={name} fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 55vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-25">🍽️</span>
            </div>
          )}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--dark)] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              ★ Şefin Önerisi
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-between p-7 md:p-8">
          <div>
            <h3 className="text-2xl font-bold text-[var(--dark)]" style={{ fontFamily: "var(--font-playfair)" }}>
              {name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] whitespace-pre-wrap">{desc}</p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[var(--beige)] pt-5">
            <span className="text-xs uppercase tracking-widest text-[var(--muted)]">Fiyat</span>
            <span className="text-2xl font-bold" style={{ color: "var(--bordeaux)" }}>{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Küçük yatay kart ──────────────────────────────────────────────────────────
export function CardItem({ item }) {
  const name  = getLocalizedText(item.name, "—");
  const desc  = getLocalizedText(item.description, "");
  const img   = normalizeImage(item.image);
  const price = formatCurrency(item.price, item.currency || "TRY");

  return (
    <div className="flex items-start gap-4 py-7 border-b border-[var(--beige)] last:border-0">
      <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-xl overflow-hidden shrink-0 bg-[#ede8e0]">
        {img ? (
          <Image src={img} alt={name} fill className="object-cover object-center" sizes="(max-width:1024px) 112px, 144px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">🍽️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-bold text-[var(--dark)] leading-snug">
            {name}
            {item.isFeatured && (
              <span className="ml-2 rounded-full bg-[var(--dark)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white align-middle">★</span>
            )}
          </h4>
          <span className="shrink-0 text-lg font-bold whitespace-nowrap" style={{ color: "var(--bordeaux)" }}>
            {price}
          </span>
        </div>
        {desc && (
          <p className="mt-2 text-sm leading-relaxed break-words text-[var(--muted)]">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Kategori önizleme (max 3 item + "Tümünü Gör") ────────────────────────────
function CategoryPreview({ category }) {
  const catName  = getLocalizedText(category.name, "");
  const catDesc  = getLocalizedText(category.description, "");
  const items    = category.items || [];
  if (!items.length) return null;

  const slug         = slugify(catName);
  const featuredItem = items.find((i) => i.isFeatured);
  const restItems    = items.filter((i) => i !== featuredItem);
  // Önizlemede featured + en fazla 2 küçük kart
  const previewItems = restItems.slice(0, 2);
  const remaining    = items.length - (featuredItem ? 1 : 0) - previewItems.length;

  return (
    <section id={`cat-${slug}`} className="scroll-mt-36 py-14 border-t border-[var(--beige)] first:border-t-0">
      {/* Başlık */}
      <div className="mb-10 flex items-end justify-between">
        <div className="text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {catName}
          </h2>
          {catDesc && (
            <p className="mt-3 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "var(--bordeaux)" }}>
              {catDesc}
            </p>
          )}
        </div>
      </div>

      {/* Featured item */}
      {featuredItem && <FeaturedItem item={featuredItem} />}

      {/* Önizleme kartları */}
      {previewItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 rounded-2xl border border-[var(--beige)] bg-white overflow-hidden shadow-sm">
          {previewItems.map((item, i) => (
            <div
              key={item._id}
              className={`px-7 ${i % 2 === 1 ? "lg:border-l border-[var(--beige)]" : ""}`}
            >
              <CardItem item={item} />
            </div>
          ))}
        </div>
      )}

      {/* "Tümünü Gör" linki */}
      <div className="mt-6 flex justify-center">
        <Link
          href={`/restoran/menu/${slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--beige)] bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
          style={{ color: "var(--dark)" }}
        >
          {remaining > 0
            ? `Tüm ${catName} (${items.length} ürün)`
            : `${catName} Menüsü`}
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}

// ── Sticky tabs ───────────────────────────────────────────────────────────────
function CategoryTabs({ categories, activeId }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(updateArrows));
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateArrows); ro.disconnect(); };
  }, [categories]);

  const slide = (dir) => scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  const scrollToSection = (slug) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-[75px] z-20 bg-[var(--cream)] border-b border-[var(--beige)] py-3">
      <div className="container-shell">
        <div className="relative flex items-center">
          {/* Sol fade */}
          <div className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[var(--cream)] to-transparent transition-opacity duration-200 ${canLeft ? "opacity-100" : "opacity-0"}`} />
          {/* Sol buton */}
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Geri kaydır"
            className={`absolute left-0 z-20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[var(--beige)] shadow-sm transition-all duration-200 hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)] ${canLeft ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>

          {/* Scroll track */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => {
              const name = getLocalizedText(cat.name, "");
              const slug = slugify(name);
              const id   = `cat-${slug}`;
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => scrollToSection(slug)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-all shrink-0 ${
                    activeId === id
                      ? "bg-[var(--bordeaux)] text-white shadow-sm"
                      : "bg-white text-[var(--dark)] border border-[var(--beige)] hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* Sağ fade */}
          <div className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[var(--cream)] to-transparent transition-opacity duration-200 ${canRight ? "opacity-100" : "opacity-0"}`} />
          {/* Sağ buton */}
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="İleri kaydır"
            className={`absolute right-0 z-20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[var(--beige)] shadow-sm transition-all duration-200 hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)] ${canRight ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export default function MenuPageClient({ categories, pageTitle, pageSubtitle }) {
  const [activeId, setActiveId] = useState(null);

  const validCats = (categories || []).filter((c) => c.items?.length);

  useEffect(() => {
    if (!validCats.length) return;
    const sectionIds = validCats.map((c) => `cat-${slugify(getLocalizedText(c.name, ""))}`);
    const observers  = [];
    const visible    = new Set();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.add(id); else visible.delete(id);
          const first = sectionIds.find((sid) => visible.has(sid));
          if (first) setActiveId(first);
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [validCats.length]);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Sayfa başlığı — blok yoksa gösterilir */}
      {pageTitle && (
        <div className="container-shell pt-10 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] max-w-lg mx-auto">
              {pageSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Sticky tabs */}
      {validCats.length > 0 && <CategoryTabs categories={validCats} activeId={activeId} />}

      {/* Kategori önizlemeleri */}
      <div className="container-shell">
        {validCats.length > 0 ? (
          validCats.map((cat) => <CategoryPreview key={cat._id} category={cat} />)
        ) : (
          <div className="py-20 text-center text-sm text-[var(--muted)]">
            Menü içeriği yakında eklenecek.
          </div>
        )}
      </div>
    </div>
  );
}
