import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLocalizedText } from '@/lib/utils';
import TestimonialsCarousel from './TestimonialsCarousel';

// Relative path (/uploads/...) production'da çalışmaz
const safeUrl = (url) => url && (url.startsWith('http://') || url.startsWith('https://')) ? url : null;

// ── Hero ──────────────────────────────────────────────────────────────────
function HeroBlock({ data }) {
  const eyebrow = data.eyebrow || '';
  const title = getLocalizedText(data.title);
  const subtitle = getLocalizedText(data.subtitle);
  const cta = Array.isArray(data.cta) ? data.cta : [];
  const overlay = data.overlay ?? 0.55;
  const textPosition = data.textPosition || 'center'; // "center" | "bottom"

  const alignClass = textPosition === 'bottom' ? 'items-end' : 'items-center';
  const paddingClass = textPosition === 'bottom' ? 'pb-16 pt-24' : 'py-24';
  const gradientDir =
    textPosition === 'bottom'
      ? `linear-gradient(180deg, rgba(12,10,8,0.15) 0%, rgba(12,10,8,${overlay}) 60%, rgba(12,10,8,${overlay + 0.2}) 100%)`
      : `linear-gradient(90deg, rgba(12,10,8,${overlay + 0.2}) 0%, rgba(12,10,8,${overlay}) 55%, rgba(12,10,8,0.15) 100%)`;

  return (
    <section
      className={`relative min-h-[92vh] flex ${alignClass} overflow-hidden`}
    >
      {safeUrl(data.image) && (
        <Image
          src={safeUrl(data.image)}
          alt={title || 'Hero'}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0" style={{ background: gradientDir }} />
      <div
        className={`relative z-10 container-shell ${paddingClass} max-w-2xl mr-auto`}
      >
        {eyebrow && (
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase mb-5 text-white/60">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[0.93]">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-6 text-sm leading-relaxed text-white/70 max-w-md">
            {subtitle}
          </p>
        )}
        {cta.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {cta.map((btn, i) => {
              const btnText = getLocalizedText(btn.text);
              return (
                <Link
                  key={i}
                  href={btn.url || '#'}
                  className="inline-flex items-center gap-2 rounded px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:opacity-90"
                  style={
                    btn.style === 'outline'
                      ? {
                          border: '1px solid rgba(255,255,255,0.35)',
                          color: '#fff',
                        }
                      : { background: 'var(--bordeaux)', color: '#fff' }
                  }
                >
                  {btnText} {i === 0 && <ArrowRight size={13} />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Rich Text ─────────────────────────────────────────────────────────────
function RichTextBlock({ data }) {
  const content = getLocalizedText(data.content);
  if (!content) return null;
  return (
    <section className="py-16 bg-[var(--cream)]">
      <div
        className="container-shell max-w-3xl text-base leading-8 text-[var(--muted)]
          prose max-w-none
          [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[var(--dark)]
          [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[var(--dark)]
          [&_p]:mb-5 [&_p:last-child]:mb-0
          [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-1
          [&_strong]:font-bold [&_strong]:text-[var(--dark)]
          [&_a]:text-[var(--bordeaux)] [&_a]:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--bordeaux)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────
function GalleryBlock({ data }) {
  const images = data.images || [];
  const columns = data.columns || 3;
  const eyebrow = data.eyebrow || '';
  const title = getLocalizedText(data.title);
  const layout = data.layout || 'grid'; // "grid" | "featured"
  const ctaText = getLocalizedText(data.cta?.text);
  const ctaUrl = data.cta?.url || '';
  if (!images.length) return null;

  const gridClass =
    {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-2 sm:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
    }[columns] || 'grid-cols-2 sm:grid-cols-3';

  const Header = () =>
    eyebrow || title ? (
      <div className="mb-10 flex items-end justify-between">
        <div>
          {eyebrow && (
            <p
              className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
              style={{ color: 'var(--bordeaux)' }}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {title}
            </h2>
          )}
        </div>
        {ctaText && ctaUrl && (
          <Link
            href={ctaUrl}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:opacity-70 shrink-0"
            style={{ color: 'var(--bordeaux)' }}
          >
            {ctaText} <ArrowRight size={13} />
          </Link>
        )}
      </div>
    ) : null;

  if (layout === 'featured' && images.length >= 2) {
    const [main, ...rest] = images.filter(safeUrl);
    return (
      <section className="py-16 bg-white">
        <div className="container-shell">
          <Header />
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="group relative h-[480px] overflow-hidden rounded-2xl">
              <Image
                src={main}
                alt="Restoran atmosferi"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="55vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {rest.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ height: '228px' }}
                >
                  <Image
                    src={src}
                    alt={`Görsel ${i + 2}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>
          {ctaText && ctaUrl && (
            <div className="mt-8 text-center md:hidden">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--bordeaux)' }}
              >
                {ctaText} <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[var(--cream)]">
      <div className="container-shell">
        <Header />
        <div className={`grid gap-4 ${gridClass}`}>
          {images.filter(safeUrl).map((src, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt={`Görsel ${i + 1}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
        {ctaText && ctaUrl && (
          <div className="mt-8 text-center">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--bordeaux)' }}
            >
              {ctaText} <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────
function CtaBlock({ data }) {
  const title = getLocalizedText(data.title);
  const desc = getLocalizedText(data.description);
  const btn1Text = getLocalizedText(data.btn1?.text);

  return (
    <section
      className="py-28 text-center"
      style={{ background: 'var(--bordeaux)' }}
    >
      <div className="container-shell max-w-2xl mx-auto">
        {title && (
          <h2
            className="text-3xl md:text-5xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {title}
          </h2>
        )}
        {desc && (
          <p className="mt-5 text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
            {desc}
          </p>
        )}
        {btn1Text && data.btn1?.url && (
          <Link
            href={data.btn1.url}
            className="inline-flex items-center gap-2 mt-10 text-xs font-bold uppercase tracking-[0.3em] text-white/80 transition hover:text-white border-b border-white/30 hover:border-white pb-0.5"
          >
            {btn1Text} <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────
function StatsBlock({ data }) {
  const items = data.items || [];
  if (!items.length) return null;

  return (
    <section className="py-14 bg-white">
      <div className="container-shell">
        <div
          className={`grid gap-6 grid-cols-2 ${items.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${items.length}`}`}
        >
          {items.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-[var(--beige)]"
            >
              {s.icon && <div className="text-3xl mb-3">{s.icon}</div>}
              <p
                className="text-2xl md:text-3xl font-bold text-[var(--dark)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {s.value}
              </p>
              <p className="mt-1.5 text-xs font-bold tracking-[0.15em] uppercase text-[var(--muted)]">
                {getLocalizedText(s.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Image + Text ──────────────────────────────────────────────────────────
function ImageTextBlock({ data }) {
  const eyebrow = data.eyebrow || '';
  const title = getLocalizedText(data.title);
  const text = getLocalizedText(data.text);
  const reversed = data.imagePosition === 'right';
  const ctaLabel = getLocalizedText(data.cta?.text);

  return (
    <section className="py-20 bg-white">
      <div
        className={`container-shell flex flex-col gap-12 lg:flex-row lg:items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}
      >
        {safeUrl(data.image) && (
          <div className="relative h-80 lg:h-[500px] lg:flex-1 overflow-hidden rounded-2xl">
            <Image
              src={safeUrl(data.image)}
              alt={title || 'Görsel'}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        )}
        <div className="lg:flex-1 space-y-5">
          {eyebrow && (
            <p
              className="text-[10px] font-bold tracking-[0.35em] uppercase"
              style={{ color: 'var(--bordeaux)' }}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--dark)] leading-[1.1]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {title}
            </h2>
          )}
          {text && (
            <p className="text-sm leading-8 text-[var(--muted)]">{text}</p>
          )}
          {ctaLabel && data.cta?.url && (
            <Link
              href={data.cta.url}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition hover:opacity-70"
              style={{ color: 'var(--bordeaux)' }}
            >
              {ctaLabel} <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────
function FaqBlock({ data }) {
  const items = data.items || [];
  if (!items.length) return null;

  return (
    <section className="py-16 bg-[var(--cream)]">
      <div className="container-shell max-w-3xl space-y-3">
        {items.map((it, i) => {
          const q = getLocalizedText(it.question);
          const a = getLocalizedText(it.answer);
          return (
            <details
              key={i}
              className="group rounded-xl border bg-white overflow-hidden"
              style={{ borderColor: 'var(--beige)' }}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-[var(--dark)] list-none select-none hover:bg-[var(--beige)]/30 transition">
                {q}
                <ArrowRight
                  size={15}
                  className="shrink-0 rotate-90 transition-transform group-open:rotate-[270deg]"
                  style={{ color: 'var(--bordeaux)' }}
                />
              </summary>
              <div className="px-6 pb-5 pt-1 text-sm leading-7 text-[var(--muted)]">
                {a}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────
function TestimonialsBlock({ data }) {
  const items = data.items || [];
  if (!items.length) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container-shell max-w-3xl mx-auto">
        <TestimonialsCarousel items={items} />
      </div>
    </section>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────
function CardsBlock({ data }) {
  const items = data.items || [];
  const title = getLocalizedText(data.title);
  if (!items.length) return null;

  const colClass =
    items.length <= 2
      ? 'sm:grid-cols-2'
      : items.length === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-16 bg-[var(--cream)]">
      <div className="container-shell">
        {(data.eyebrow || title) && (
          <div className="mb-10">
            {data.eyebrow && (
              <p
                className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
                style={{ color: 'var(--bordeaux)' }}
              >
                {data.eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {title}
              </h2>
            )}
          </div>
        )}
        <div className={`grid gap-5 ${colClass}`}>
          {items.map((it, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-2xl bg-white border border-[var(--beige)] shadow-[0_4px_24px_rgba(30,24,16,0.06)]"
            >
              {safeUrl(it.image) && (
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={safeUrl(it.image)}
                    alt={it.title || `Kart ${i + 1}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
              )}
              <div className="p-5">
                {it.title && (
                  <h3
                    className="text-base font-bold text-[var(--dark)]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {it.title}
                  </h3>
                )}
                {it.description && (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                    {it.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Values ────────────────────────────────────────────────────────────────
function ValuesBlock({ data }) {
  const items = data.items || [];
  const title = getLocalizedText(data.title);
  if (!items.length) return null;

  return (
    <section className="py-16 bg-[var(--cream)]">
      <div className="container-shell max-w-3xl mx-auto">
        {(data.eyebrow || title) && (
          <div className="mb-12">
            {data.eyebrow && (
              <p
                className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3"
                style={{ color: 'var(--bordeaux)' }}
              >
                {data.eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--dark)]"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {title}
              </h2>
            )}
          </div>
        )}
        <ul className="divide-y" style={{ borderColor: 'var(--beige)' }}>
          {items.map((v, i) => {
            const vTitle = getLocalizedText(v.title);
            const vDesc = getLocalizedText(v.description);
            return (
              <li key={i} className="py-7 flex gap-8 items-start">
                <span
                  className="shrink-0 text-xs font-bold tracking-[0.15em] pt-0.5"
                  style={{ color: 'var(--bordeaux)', minWidth: '2rem' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  {vTitle && (
                    <p
                      className="font-bold text-[var(--dark)] text-base"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {vTitle}
                    </p>
                  )}
                  {vDesc && (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {vDesc}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────
export function BlockRenderer({ blocks = [] }) {
  if (!blocks.length) return null;

  const sorted = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      {sorted.map((block, i) => {
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={i} data={block.data || {}} />;
          case 'richtext':
            return <RichTextBlock key={i} data={block.data || {}} />;
          case 'gallery':
            return <GalleryBlock key={i} data={block.data || {}} />;
          case 'cta':
            return <CtaBlock key={i} data={block.data || {}} />;
          case 'stats':
            return <StatsBlock key={i} data={block.data || {}} />;
          case 'image-text':
            return <ImageTextBlock key={i} data={block.data || {}} />;
          case 'faq':
            return <FaqBlock key={i} data={block.data || {}} />;
          case 'testimonials':
            return <TestimonialsBlock key={i} data={block.data || {}} />;
          case 'cards':
            return <CardsBlock key={i} data={block.data || {}} />;
          case 'values':
            return <ValuesBlock key={i} data={block.data || {}} />;
          default:
            return null;
        }
      })}
    </>
  );
}
