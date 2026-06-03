import { ImageCard } from "@/components/ui/ImageCard";
import { getLocalizedText } from "@/lib/utils";

export default function BlogPostClient({ post }) {
  return (
    <main className="section-space">
      <article className="container-shell">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold tracking-[0.3em] text-[var(--gold)] uppercase">
            {post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : "Blog"}
          </p>
          <h1 className="mt-4 font-playfair text-5xl leading-tight text-[var(--dark)] md:text-6xl">
            {getLocalizedText(post?.title)}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{getLocalizedText(post?.excerpt)}</p>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <ImageCard image={post?.coverImage} alt={getLocalizedText(post?.title)} className="h-[460px]" />
        </div>
        <div
          className="mx-auto mt-12 max-w-3xl text-lg leading-8 text-[var(--muted)] prose prose-lg max-w-none
            [&_p]:mb-5 [&_p:last-child]:mb-0
            [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-playfair [&_h2]:text-3xl [&_h2]:text-[var(--dark)]
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-playfair [&_h3]:text-2xl [&_h3]:text-[var(--dark)]
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-1
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-1
            [&_strong]:font-bold [&_strong]:text-[var(--dark)]
            [&_em]:italic
            [&_a]:text-[var(--bordeaux)] [&_a]:underline [&_a:hover]:opacity-75
            [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--bordeaux)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6"
          dangerouslySetInnerHTML={{
            __html: typeof post?.content === "string"
              ? post.content
              : getLocalizedText(post?.content, "İçerik yakında bu alanda görünecek."),
          }}
        />
      </article>
    </main>
  );
}
