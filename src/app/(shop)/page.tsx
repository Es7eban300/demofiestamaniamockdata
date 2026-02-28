import { HeroSection } from "@/components/home/HeroSection";
import { OccasionsCarousel } from "@/components/home/OccasionsCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OnSaleSection } from "@/components/home/OnSaleSection";
import { BestSellers } from "@/components/home/BestSellers";
import { CategoryImages } from "@/components/home/CategoryImages";
import { SmartPartyAssistant } from "@/components/home/SmartPartyAssistant";
import { AICuratedEssentials } from "@/components/home/AICuratedEssentials";
import { CarefullyChosen } from "@/components/home/CarefullyChosen";
import { TrustBadges } from "@/components/home/TrustBadges";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OccasionsCarousel />
      <FeaturedProducts />
      <OnSaleSection />
      <BestSellers />
      <CategoryImages />
      <SmartPartyAssistant />
      <AICuratedEssentials />
      <CarefullyChosen />
      <TrustBadges />
    </>
  );
}
