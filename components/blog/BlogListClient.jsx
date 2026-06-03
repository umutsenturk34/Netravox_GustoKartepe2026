import Link from "next/link";

import { ImageCard } from "@/components/ui/ImageCard";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { getLocalizedText } from "@/lib/utils";

export default function BlogListClient({ posts }) {
  return (
    <main className="section-space">
      <div className="container-shell">
        <SectionIntro
          eyebrow="Blog"
          title="Dogadan, gastronomiden ve Gusto gundeminden notlar."
          description="Blog akisi API'den geldigi icin yayinlanan yeni yazilar ek bir duzenleme gerektirmeden otomatik listelenir."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.length ? (
            posts.map((post) => (
              <article key={post._id || post.slug} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(30,24,16,0.06)]">
                <ImageCard image={post.coverImage} alt={getLocalizedText(post.title)} className="h-64 rounded-none" />
                <div className="p-7">
                  <p className="text-xs font-bold tracking-[0.2em] text-[var(--gold)] uppercase">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : "Blog"}
                  </p>
                  <h2 className="mt-4 font-playfair text-3xl text-[var(--dark)]">
                    {getLocalizedText(post.title)}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--muted)]">{getLocalizedText(post.excerpt)}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex text-sm font-bold tracking-[0.18em] text-[var(--bordeaux)] uppercase"
                  >
                    Yaziyi Oku
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] bg-white p-10 text-[var(--muted)] lg:col-span-3">
              Henuz yayinlanmis blog yazisi bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
