import type { Locale } from "@/i18n/routing";
import { getBeautyKnowledgeHome, getFeaturedNews } from "@/sanity/lib/posts";
import { getFeaturedVideos } from "@/sanity/lib/videos";
import { getHeroBanners } from "@/sanity/lib/banners";
import { getEquipmentItems } from "@/sanity/lib/equipment";
import { getServiceHighlights } from "@/sanity/lib/serviceHighlights";
import { getDoctors } from "@/sanity/lib/doctors";
import { BannerHero } from "./_home-sections/banner-hero";
import { Hero } from "./_home-sections/hero";
import { CustomerExperience } from "./_home-sections/customer-experience";
import { Equipment } from "./_home-sections/equipment";
import { DoctorTeam } from "./_home-sections/doctor-team";
import { StrategicPartners } from "./_home-sections/strategic-partners";
import { WhyChooseUs } from "./_home-sections/why-choose-us";
import { FeaturedEvents } from "./_home-sections/featured-events";
import { BeautyKnowledgeHome } from "./_home-sections/beauty-knowledge";
import { RegistrationForm } from "./_home-sections/registration-form";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [news, videos, banners, equipment, serviceHighlights, doctors, beautyKnowledge] = await Promise.all([
    getFeaturedNews(locale),
    getFeaturedVideos(locale),
    getHeroBanners(),
    getEquipmentItems(),
    getServiceHighlights(locale),
    getDoctors(locale),
    getBeautyKnowledgeHome(locale),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <BannerHero banners={banners} />
      <Hero />
      <CustomerExperience cards={serviceHighlights} />
      <Equipment items={equipment} />
      <DoctorTeam doctors={doctors} />
      <StrategicPartners />
      <WhyChooseUs />
      <FeaturedEvents news={news} videos={videos} />
      <BeautyKnowledgeHome hero={beautyKnowledge.hero} thumbnails={beautyKnowledge.thumbnails} />
      <RegistrationForm />
    </div>
  );
}
