import Link from "next/link";

export default function ReservationCTA({ company }) {
  const content = company?.content || {};

  return (
    <section className="bg-[var(--bordeaux)] px-6 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-playfair text-4xl leading-tight md:text-6xl">
          {content.ctaTitle || "Kartepe'de dogayla ic ice bir masa ayirtin"}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
          {content.ctaSubtext || "Huzurun sofrayla bir araya geldigi bu deneyim icin yerinizi simdiden ayirarak baslayin."}
        </p>
        <Link
          href="/restoran/rezervasyon"
          className="mt-8 inline-flex border border-white/22 px-6 py-3 text-[10px] font-bold tracking-[0.22em] text-white uppercase transition hover:border-white/50"
        >
          {content.ctaButton || "Hemen Rezervasyon Yap"}
        </Link>
      </div>
    </section>
  );
}
