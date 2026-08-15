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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <BannerHero />
      <Hero />
      <CustomerExperience />
      <Equipment />
      <DoctorTeam />
      <StrategicPartners />
      <WhyChooseUs />
      <FeaturedEvents />
      <BeautyKnowledgeHome />
      <RegistrationForm />
    </div>
  );
}
