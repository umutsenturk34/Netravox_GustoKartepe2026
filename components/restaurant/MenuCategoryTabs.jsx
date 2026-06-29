"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocalizedText } from "@/lib/utils";

export default function MenuCategoryTabs({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(update));
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [categories]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      {/* Sol fade + ok */}
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--cream)] to-transparent transition-opacity duration-200 ${canLeft ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Geri kaydır"
        className={`absolute left-0 z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(30,24,16,0.12)] transition-all duration-200 hover:bg-[var(--bordeaux)] hover:text-white ${canLeft ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 -translate-x-2"}`}
      >
        <ChevronLeft size={17} strokeWidth={2.5} />
      </button>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => {
          const active = category._id === activeCategory?._id;
          return (
            <button
              key={category._id || getLocalizedText(category.name)}
              type="button"
              onClick={() => onSelect(category)}
              className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold tracking-[0.18em] uppercase transition ${
                active
                  ? "bg-[var(--bordeaux)] text-white"
                  : "bg-white text-[var(--dark)] shadow-[0_10px_25px_rgba(30,24,16,0.05)]"
              }`}
            >
              {getLocalizedText(category.name)}
            </button>
          );
        })}
      </div>

      {/* Sağ fade + ok */}
      <div
        className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--cream)] to-transparent transition-opacity duration-200 ${canRight ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="İleri kaydır"
        className={`absolute right-0 z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(30,24,16,0.12)] transition-all duration-200 hover:bg-[var(--bordeaux)] hover:text-white ${canRight ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-2"}`}
      >
        <ChevronRight size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}
