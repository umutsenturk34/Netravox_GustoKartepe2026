"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { getLocalizedText } from "@/lib/utils";

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border transition-colors"
      style={{
        borderColor: isOpen ? "var(--bordeaux)" : "var(--beige)",
        background: isOpen ? "#fff" : "var(--cream)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-7 py-5 text-left"
      >
        <span
          className="text-base font-semibold leading-snug"
          style={{ color: isOpen ? "var(--bordeaux)" : "var(--dark)" }}
        >
          {getLocalizedText(item.question)}
        </span>
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition"
          style={{
            background: isOpen ? "var(--bordeaux)" : "var(--beige)",
            color: isOpen ? "#fff" : "var(--muted)",
          }}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-7 pb-6 text-sm leading-7 text-[var(--muted)]">
          {getLocalizedText(item.answer)}
        </p>
      </div>
    </div>
  );
}

export default function FaqAccordion({ faqs }) {
  const [openId, setOpenId] = useState(faqs[0]?._id ?? null);

  if (!faqs.length) {
    return (
      <div className="rounded-2xl border border-[var(--beige)] bg-white px-8 py-12 text-center text-[var(--muted)]">
        Henüz soru eklenmemiş.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((item) => (
        <FaqItem
          key={item._id}
          item={item}
          isOpen={openId === item._id}
          onToggle={() => setOpenId(openId === item._id ? null : item._id)}
        />
      ))}
    </div>
  );
}
