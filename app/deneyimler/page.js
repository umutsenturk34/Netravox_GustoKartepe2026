import { CalendarDays, Coffee, House, PartyPopper, Tent, Trees } from "lucide-react";

import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ImageCard } from "@/components/ui/ImageCard";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { getCompany, getPage } from "@/lib/api";
import { experiences as fallbackExperiences } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";

const icons = { Tent, PartyPopper, House, Trees, CalendarDays, Coffee };

export async function generateMetadata() {
  const page = await getPage("generic");
  return buildPageMetadata(page, {
    title: "Deneyimler",
    description: "Kamp alanlari, bungalovlar, etkinlik alanlari ve daha fazlasi - Gusto Kartepe'nin gelisim vizyonu.",
    canonical: `${SITE.url}/deneyimler`,
  });
}

export default async function DeneyimlerPage() {
  const company = await getCompany();
  const content = company?.content || {};

  const experiences = content.experiences?.length ? content.experiences : fallbackExperiences;

  const vision = {
    eyebrow: content.visionEyebrow || "Gusto Kartepe Deneyimi",
    title: content.visionTitle || "Premium deneyimin yeni katmanlari yolda.",
    description: content.visionDescription || "Restoranin etrafinda sekillenecek yeni deneyim alanlari, markanin uzun vadeli yolculugunu tanimliyor.",
  };

  const phases = content.experiencePhases || [
    {
      status: "current",
      badge: "Mevcut Asama",
      title: "Faz 1: Gusto Restoran",
      description: "Mutfak, servis ve misafir deneyimi su anda aktif olarak bu faz uzerinde gelisiyor.",
    },
    {
      status: "upcoming",
      badge: "Yakinda",
      title: "Faz 2: Bungalov & Konaklama",
      description: "Daha uzun sureli konaklama ve kamp deneyimlerini destekleyecek ikinci asama hazirlaniyor.",
    },
  ];

  const roadmap = {
    eyebrow: content.roadmapEyebrow || "Gelisim Yolculugumuz",
    title: content.roadmapTitle || "Markanin sonraki iki adimi.",
    description: content.roadmapDescription || "Bugunku restoran deneyimi, daha genis bir doga ve konaklama ekosisteminin ilk fazini temsil ediyor.",
  };

  return (
    <main>
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Deneyimler", url: "/deneyimler" }]} />
      <Breadcrumb items={[{ name: "Ana Sayfa", url: "/" }, { name: "Deneyimler", url: "/deneyimler" }]} />

      <section className="bg-[var(--hero-dark)] py-20 text-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <SectionIntro
            eyebrow={vision.eyebrow}
            title={vision.title}
            description={vision.description}
            light
          />
          <ImageCard
            image={content.visionImage}
            alt="Deneyim vizyonu"
            className="h-[420px]"
          />
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((item, i) => {
            const Icon = icons[item.icon] || Tent;
            return (
              <article key={i} className="rounded-[2rem] bg-white p-8 shadow-[0_18px_40px_rgba(30,24,16,0.06)]">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--beige)] text-[var(--gold)]">
                  <Icon size={24} />
                </span>
                <h2 className="mt-6 font-playfair text-3xl text-[var(--dark)]">{item.title}</h2>
                <div
                  className="mt-4 text-base leading-7 text-[var(--muted)] [&_p]:mb-2 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-space bg-[var(--beige)]/35">
        <div className="container-shell">
          <SectionIntro
            eyebrow={roadmap.eyebrow}
            title={roadmap.title}
            description={roadmap.description}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {phases.map((phase, i) => (
              <article
                key={i}
                className={`rounded-[2rem] p-8 ${phase.status === "current" ? "bg-white" : "border border-dashed border-[var(--beige)] bg-white/70"}`}
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase ${
                    phase.status === "current"
                      ? "bg-[var(--bordeaux)] text-white"
                      : "bg-[var(--beige)] text-[var(--muted)]"
                  }`}
                >
                  {phase.badge}
                </span>
                <h3 className="mt-5 font-playfair text-3xl text-[var(--dark)]">{phase.title}</h3>
                <div
                  className="mt-4 text-base leading-7 text-[var(--muted)] [&_p]:mb-2 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: phase.description }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
