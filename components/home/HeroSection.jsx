import Link from 'next/link';
import Image from 'next/image';

import { homeImagery } from '@/lib/homeData';
import { getLocalizedText } from '@/lib/utils';

export default function HeroSection({ company }) {
  return (
    <section className="relative overflow-hidden bg-[var(--hero-dark)] text-white">
      <div className="absolute inset-0">
        <Image
          src={
            company?.heroImage ||
            company?.content?.heroImage ||
            company?.coverImage ||
            homeImagery.hero
          }
          alt="Gusto Kartepe doga manzarasi"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(12,10,8,0.38)_0%,rgba(12,10,8,0.72)_100%)]" />
      </div>
      <div className="container-shell relative flex min-h-[calc(100vh-4rem)] items-center justify-center py-16 text-center">
        <div className="max-w-2xl">
          <p className="mb-5 text-[10px] font-bold tracking-[0.38em] text-white/72 uppercase">
            Gusto Kartepe Deneyimi
          </p>
          <h1 className="text-balance text-5xl font-bold leading-[0.93] md:text-7xl">
            Doganin Kalbinde
            <br />
            Rafine ve Sessiz
            <br />
            Bir Sofra
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/72 md:text-base">
            {getLocalizedText(
              company?.description,
              'Agaclarin arasina yerlesen, dogayla butunlesen ve her detayinda dinginlik tasiyan bir restoran deneyimi.'
            )}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/restoran/rezervasyon"
              className="inline-flex min-w-32 justify-center bg-[var(--bordeaux)] px-6 py-3 text-[10px] font-bold tracking-[0.22em] text-white uppercase transition hover:opacity-90"
            >
              Rezervasyon Yap
            </Link>
            <Link
              href="/restoran/menu"
              className="inline-flex border border-white/20 px-6 py-3 text-[10px] font-bold tracking-[0.22em] text-white uppercase transition hover:border-white/55"
            >
              Menuyu Incele
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
