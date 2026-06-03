import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ImageCard } from "@/components/ui/ImageCard";
import { getLocalizedText } from "@/lib/utils";

function PostCard({ post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--beige)] bg-white shadow-[0_12px_32px_rgba(30,24,16,0.05)] transition-shadow hover:shadow-[0_20px_48px_rgba(30,24,16,0.10)]">
      <Link href={`/blog/${post.slug}`} className="block shrink-0">
        <ImageCard
          image={post.coverImage}
          alt={getLocalizedText(post.title)}
          className="h-52 rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] font-bold tracking-[0.28em] text-[var(--gold)] uppercase">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Blog"}
        </p>
        <h2 className="mt-3 font-playfair text-2xl leading-snug text-[var(--dark)]">
          <Link href={`/blog/${post.slug}`} className="hover:text-[var(--bordeaux)] transition-colors">
            {getLocalizedText(post.title)}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)] line-clamp-3">
            {getLocalizedText(post.excerpt)}
          </p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] text-[var(--bordeaux)] uppercase"
        >
          Devamını Oku <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}

function Pagination({ pagination }) {
  const { page, pages } = pagination;
  if (pages <= 1) return null;

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < pages ? page + 1 : null;

  // Hangi sayfa numaralarını göster
  const range = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
    range.push(i);
  }

  return (
    <nav aria-label="Blog sayfaları" className="mt-14 flex items-center justify-center gap-2">
      {prevPage ? (
        <Link
          href={`/blog?page=${prevPage}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--beige)] bg-white text-[var(--muted)] shadow-sm transition hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
          aria-label="Önceki sayfa"
        >
          <ArrowLeft size={16} />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--beige)] bg-white opacity-30 cursor-not-allowed">
          <ArrowLeft size={16} />
        </span>
      )}

      {range[0] > 1 && (
        <>
          <Link href="/blog?page=1" className={pageBtn(1 === page)}>1</Link>
          {range[0] > 2 && <span className="px-1 text-[var(--muted)]">…</span>}
        </>
      )}

      {range.map((n) => (
        <Link key={n} href={`/blog?page=${n}`} className={pageBtn(n === page)} aria-current={n === page ? "page" : undefined}>
          {n}
        </Link>
      ))}

      {range[range.length - 1] < pages && (
        <>
          {range[range.length - 1] < pages - 1 && <span className="px-1 text-[var(--muted)]">…</span>}
          <Link href={`/blog?page=${pages}`} className={pageBtn(pages === page)}>{pages}</Link>
        </>
      )}

      {nextPage ? (
        <Link
          href={`/blog?page=${nextPage}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--beige)] bg-white text-[var(--muted)] shadow-sm transition hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]"
          aria-label="Sonraki sayfa"
        >
          <ArrowRight size={16} />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--beige)] bg-white opacity-30 cursor-not-allowed">
          <ArrowRight size={16} />
        </span>
      )}
    </nav>
  );
}

function pageBtn(active) {
  return [
    "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border px-3 text-sm font-semibold transition",
    active
      ? "border-[var(--bordeaux)] bg-[var(--bordeaux)] text-white shadow-sm"
      : "border-[var(--beige)] bg-white text-[var(--dark)] hover:border-[var(--bordeaux)] hover:text-[var(--bordeaux)]",
  ].join(" ");
}

export default function BlogList({ posts, pagination }) {
  return (
    <main className="min-h-screen bg-[var(--cream)] pt-10 pb-24">
      {/* Sayfa başlığı */}
      <div className="container-shell pt-10 pb-14 text-center">
        <p className="text-[10px] font-bold tracking-[0.36em] text-[var(--gold)] uppercase">
          Journal
        </p>
        <h1 className="mt-4 font-playfair text-4xl leading-tight text-[var(--dark)] md:text-5xl">
          Doğadan, Gastronomiden
          <br className="hidden sm:block" /> ve Gusto Gündeminden
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[var(--muted)]">
          Mevsimsel lezzetler, doğa ile yemek kültürü ve Kartepe&apos;den ilham veren hikayeler.
        </p>
      </div>

      <div className="container-shell">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id || post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl px-8 py-16 text-center text-[var(--muted)]"
            style={{ border: "1px solid var(--beige)", background: "white" }}
          >
            Henüz yayınlanmış blog yazısı bulunmuyor.
          </div>
        )}

        <Pagination pagination={pagination} />

        {pagination.total > 0 && (
          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Toplam {pagination.total} yazı · Sayfa {pagination.page} / {pagination.pages}
          </p>
        )}
      </div>
    </main>
  );
}
