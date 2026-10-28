import FeaturedDishes from '@/components/home/FeaturedDishes';
import HeroSection from '@/components/home/HeroSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import ReservationCTA from '@/components/home/ReservationCTA';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { PageSchemas } from '@/components/seo/PageSchemas';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getCompany, getPage } from '@/lib/api';
import { buildPageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/siteConfig';

export async function generateMetadata() {
  const page = await getPage('home');
  return buildPageMetadata(page, {
    title: 'Gusto Kartepe | Doganin Icinde Serpme Kahvalti & Izgara',
    description:
      "Kartepe'nin essiz dogasinda huzurun ve lezzetin merkezi. Serpme kahvalti, izgara cesitleri ve ozel atmosfer.",
    canonical: SITE.url,
  });
}

export default async function HomePage() {
  const [company, page] = await Promise.all([getCompany(), getPage('home')]);
  const hasBlocks = Array.isArray(page?.blocks) && page.blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        <PageSchemas scope="home" />
        <BlockRenderer blocks={page.blocks} />
      </>
    );
  }

  return (
    <>
      <PageSchemas scope="home" />
      <HeroSection company={company} />
      <FeaturedDishes company={company} />
      <ExperienceSection company={company} />
      <TestimonialsSection company={company} />
      <ReservationCTA company={company} />
    </>
  );
}
