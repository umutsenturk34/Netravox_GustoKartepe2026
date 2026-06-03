"use client";

import { getLocalizedText } from "@/lib/utils";

export default function MenuCategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = category._id === activeCategory?._id;
        return (
          <button
            key={category._id || getLocalizedText(category.name)}
            type="button"
            onClick={() => onSelect(category)}
            className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold tracking-[0.18em] uppercase transition ${
              active ? "bg-[var(--bordeaux)] text-white" : "bg-white text-[var(--dark)] shadow-[0_10px_25px_rgba(30,24,16,0.05)]"
            }`}
          >
            {getLocalizedText(category.name)}
          </button>
        );
      })}
    </div>
  );
}
