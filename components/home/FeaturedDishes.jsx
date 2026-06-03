import { ImageCard } from "@/components/ui/ImageCard";
import { homeImagery, homeStoryCards } from "@/lib/homeData";

const DEFAULT_STATS = [
  { value: "8000+", label: "Metrekarelik Yasam Alani" },
  { value: "Premium", label: "Servis Kalitesi ve Dogal Dokus" },
];

export default function FeaturedDishes({ company }) {
  const content = company?.content || {};

  const storyImage   = content.storyImage   || homeImagery.story;
  const panorama     = content.panoramaImage || homeImagery.panorama;
  const stats        = content.homeStats?.length ? content.homeStats : DEFAULT_STATS;
  const cards        = content.homeStoryCards?.length ? content.homeStoryCards : homeStoryCards;

  return (
    <section className="section-space home-paper">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-xl pt-4">
            <p className="text-[10px] font-bold tracking-[0.36em] text-[var(--gold)] uppercase">Lafayette</p>
            <h2 className="mt-5 font-playfair text-4xl leading-tight text-[var(--dark)] md:text-6xl">
              {content.homeHeadline || "Siradanligin otesinde, doganin kucaginda bir yasam projesi."}
            </h2>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">
              {content.homeSubtext || "Gusto Kartepe, sadece bir restoran degil; guclu bir kurguya sahip, huzuru ve lezzeti ayni ritimde bulusturan butuncul bir yasam deneyimi olarak tasarlandi."}
            </p>
            <div className="mt-10 grid max-w-md gap-6 sm:grid-cols-2">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="font-playfair text-4xl text-[var(--bordeaux)]">{s.value}</p>
                  <p className="mt-2 text-xs font-bold tracking-[0.18em] text-[var(--muted)] uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-10">
            <ImageCard
              image={storyImage}
              alt="Gusto Kartepe doga kurulumu"
              className="h-[520px] rounded-[0.7rem] shadow-[0_24px_60px_rgba(30,24,16,0.08)]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {cards.map((card, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-[0.7rem] border border-[rgba(30,24,16,0.06)] bg-white shadow-[0_20px_40px_rgba(30,24,16,0.05)]"
            >
              <ImageCard image={card.image} alt={card.title} className="h-48 rounded-none" />
              <div className="p-5">
                <h3 className="font-playfair text-xl text-[var(--dark)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
                <p className="mt-5 text-[10px] font-bold tracking-[0.26em] text-[var(--bordeaux)] uppercase">{card.eyebrow || "Kesfet"}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="container-shell mt-24">
        <ImageCard
          image={panorama}
          alt="Gusto Kartepe yasam alani"
          className="h-[360px] rounded-2xl md:h-[420px]"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
