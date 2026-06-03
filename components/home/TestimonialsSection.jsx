"use client";

import { useEffect, useState, useCallback } from "react";
import { Quote } from "lucide-react";

const DEFAULT_QUOTES = [
  {
    text: "Hayatimda deneyimledigim en huzurlu kahvaltiydi. Sadece yemekler degil, personelin ilgisi ve doganin sundugu o muazzam sessizlik tek kelimeyle kusursuzdu.",
    author: "Ayshe Yilmaz",
    role: "Misafir Yorumu",
  },
  {
    text: "Kartepe'nin bu kadar icinde bir mekan olacagini hic beklemiyordum. Doga ile bütünlesen atmosfer ve tabakta ki zenginlik birbirini tam olarak tamamliyor.",
    author: "Mehmet Demir",
    role: "Misafir Yorumu",
  },
  {
    text: "Ozel bir gun icin tercih ettik, personel her detaya buyuk ozen gosterdi. Bu kadar samimi hizmet bulmak artik cok zor. Kesinlikle tavsiye ederim.",
    author: "Selin Kaya",
    role: "Misafir Yorumu",
  },
];

const INTERVAL = 5000;

export default function TestimonialsSection({ company }) {
  const quotes =
    company?.content?.homeQuotes?.length
      ? company.content.homeQuotes
      : company?.content?.homeQuote
      ? [company.content.homeQuote]
      : DEFAULT_QUOTES;

  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (idx) => {
      if (idx === active) return;
      setFading(true);
      setTimeout(() => {
        setActive(idx);
        setFading(false);
      }, 320);
    },
    [active]
  );

  useEffect(() => {
    if (quotes.length <= 1) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % quotes.length);
        setFading(false);
      }, 320);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [quotes.length]);

  const q = quotes[active];

  return (
    <section className="section-space bg-[var(--cream)]">
      <div className="container-shell">
        <div className="mx-auto max-w-4xl text-center">
          <Quote size={42} className="mx-auto text-[var(--gold)] opacity-65" />

          <div
            className="mt-6 transition-opacity duration-300"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <blockquote className="font-playfair text-3xl leading-tight text-[var(--dark)] md:text-4xl">
              &ldquo;{q.text}&rdquo;
            </blockquote>
            <p className="mt-8 text-[11px] font-bold tracking-[0.34em] text-[var(--dark)] uppercase">
              {q.author}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{q.role}</p>
          </div>

          {quotes.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2.5">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Yorum ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "24px" : "8px",
                    height: "8px",
                    background:
                      i === active ? "var(--bordeaux)" : "var(--beige)",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
