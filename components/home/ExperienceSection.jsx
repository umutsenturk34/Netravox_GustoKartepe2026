import { ImageCard } from "@/components/ui/ImageCard";
import { homeImagery } from "@/lib/homeData";

export default function ExperienceSection({ company }) {
  const content = company?.content || {};

  const imgs = content.detailImages || [];
  const primary   = imgs[0] || homeImagery.detailPrimary;
  const secondary = imgs[1] || homeImagery.detailSecondary;
  const chef      = imgs[2] || homeImagery.detailChef;
  const interior  = imgs[3] || homeImagery.detailInterior;

  return (
    <section className="section-space home-paper">
      <div className="container-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold tracking-[0.36em] text-[var(--bordeaux)] uppercase">
            {content.experienceSectionEyebrow || "Butunsel Proje"}
          </p>
          <h2 className="mt-4 font-playfair text-4xl leading-tight text-[var(--dark)] md:text-6xl">
            {content.experienceSectionTitle || "Dogayla butunlesik, surdurulebilir ve ayricalikli bir alan."}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[var(--muted)]">
            {content.experienceSectionDesc || "Gusto Kartepe, sehri geride birakip huzurlu bir cekim merkezi arayan misafirler icin doga, mutfak ve servis kalitesini tek bir deneyim catisi altinda topluyor."}
          </p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ImageCard
            image={primary}
            alt="Dogayla ic ice acik alan"
            className="h-[420px] rounded-[0.7rem]"
            sizes="(min-width: 1024px) 56vw, 100vw"
          />
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <ImageCard
                image={secondary}
                alt="Sunum detaylari"
                className="h-[200px] rounded-[0.7rem]"
                sizes="(min-width: 1024px) 20vw, 100vw"
              />
              <ImageCard
                image={chef}
                alt="Mutfak ekibi"
                className="h-[200px] rounded-[0.7rem]"
                sizes="(min-width: 1024px) 20vw, 100vw"
              />
            </div>
            <ImageCard
              image={interior}
              alt="Ic mekan atmosferi"
              className="h-[204px] rounded-[0.7rem]"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
