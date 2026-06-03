"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocalizedText } from "@/lib/utils";
import { CardItem, FeaturedItem } from "./MenuPageClient";

export default function MenuCategoryClient({ category }) {
  const catName = getLocalizedText(category?.name, "");
  const catDesc = getLocalizedText(category?.description, "");
  const items   = category?.items || [];

  const featuredItem = items.find((i) => i.isFeatured);
  const restItems    = items.filter((i) => i !== featuredItem);

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Bu kategoride henüz ürün bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="container-shell py-10">

        {/* Geri dön */}
        <Link
          href="/restoran/menu"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] mb-10 transition hover:opacity-70"
          style={{ color: "var(--bordeaux)" }}
        >
          <ArrowLeft size={13} /> Menüye Dön
        </Link>

        {/* Başlık */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: "var(--bordeaux)" }}>
            Menü
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {catName}
          </h1>
          {catDesc && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] max-w-lg mx-auto">
              {catDesc}
            </p>
          )}
          <p className="mt-3 text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--bordeaux)" }}>
            {items.length} ürün
          </p>
        </div>

        {/* Featured */}
        {featuredItem && <FeaturedItem item={featuredItem} />}

        {/* Tüm ürünler — 2 kolonlu grid */}
        {restItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 rounded-2xl border border-[var(--beige)] bg-white overflow-hidden">
            {restItems.map((item, i) => (
              <div
                key={item._id}
                className={`px-6 ${i % 2 === 1 ? "md:border-l border-[var(--beige)]" : ""} ${i >= 2 ? "md:border-t border-[var(--beige)]" : ""}`}
              >
                <CardItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
