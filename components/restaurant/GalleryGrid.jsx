"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { galleryFilters } from "@/lib/content";
import { extractGalleryCategory, getLocalizedText } from "@/lib/utils";

const ASPECT_CYCLE = ["aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]"];

function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const img = images[current];
  const alt = getLocalizedText(img.alt) || getLocalizedText(img.caption) || "Gusto Kartepe";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] w-full mx-20 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={alt}
          className="max-h-[85vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
        />
        {(img.caption || img.category) && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <p className="text-xs font-bold text-white/60 tracking-[0.2em] uppercase">
              {getLocalizedText(img.caption) || img.category}
            </p>
          </div>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition"
        >
          <ChevronRight size={26} />
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/40 font-medium tracking-widest">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState("Tumu");
  const [lightbox, setLightbox] = useState(null);

  const filtered = useMemo(() => {
    if (active === "Tumu") return images;
    return images.filter((img) => extractGalleryCategory(img) === active);
  }, [active, images]);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {galleryFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] transition"
            style={
              f === active
                ? { background: "var(--bordeaux)", color: "#fff" }
                : { background: "#fff", color: "var(--dark)", border: "1px solid var(--beige)" }
            }
          >
            {f === "Tumu" ? "Tümü" : f === "Mekan Detaylari" ? "Mekan Detayları" : f}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {filtered.map((img, i) => {
            const aspect = ASPECT_CYCLE[i % ASPECT_CYCLE.length];
            const alt = getLocalizedText(img.alt) || getLocalizedText(img.caption) || "Gusto Kartepe";
            return (
              <div
                key={img._id || i}
                className={`relative ${aspect} mb-3 break-inside-avoid overflow-hidden rounded-xl group cursor-pointer`}
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={img.url}
                  alt={alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-[var(--dark)]/0 transition duration-300 group-hover:bg-[var(--dark)]/30" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white w-4 h-4">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
                {(img.caption || img.category) && (
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-300 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs font-bold text-white tracking-[0.15em] uppercase">
                      {getLocalizedText(img.caption) || img.category}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white py-16 text-center text-sm text-[var(--muted)]">
          Bu kategoride görsel bulunmuyor.
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          images={filtered}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
