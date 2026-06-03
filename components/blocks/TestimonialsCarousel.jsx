"use client";

import { useState, useEffect } from "react";

function QuoteDisplay({ item }) {
  const hasAuthor = !!(item.name || item.author);

  if (!hasAuthor) {
    // Büyük alıntı modu — sadece metin, ortalanmış, bordeaux
    return (
      <div className="text-center">
        <p
          className="text-6xl leading-none mb-6 select-none"
          style={{ color: "var(--bordeaux)", opacity: 0.25, fontFamily: "var(--font-playfair)" }}
          aria-hidden="true"
        >
          &ldquo;
        </p>
        <blockquote
          className="text-xl md:text-2xl italic leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--bordeaux)", fontFamily: "var(--font-playfair)" }}
        >
          {item.text}
        </blockquote>
      </div>
    );
  }

  // Normal yorum modu
  return (
    <div className="text-center">
      <p
        className="text-8xl leading-none mb-4 select-none"
        style={{ color: "var(--bordeaux)", opacity: 0.18, fontFamily: "var(--font-playfair)" }}
        aria-hidden="true"
      >
        &ldquo;
      </p>
      <blockquote
        className="text-lg md:text-xl italic text-[var(--dark)] max-w-2xl mx-auto leading-relaxed"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        &ldquo;{item.text}&rdquo;
      </blockquote>
      <div className="mt-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--dark)]">
          {item.name || item.author}
        </p>
        {(item.role || item.source) && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {item.role || item.source}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TestimonialsCarousel({ items }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setFading(false);
      }, 350);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goTo = (i) => {
    if (i === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 350);
  };

  const item = items[current];
  if (!item) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="transition-opacity duration-350 w-full"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <QuoteDisplay item={item} />
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === current ? "var(--bordeaux)" : "var(--beige)",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
