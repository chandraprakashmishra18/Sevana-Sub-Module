import Hero from "../components/home/Hero";
import ImpactStats from "../components/home/ImpactStats";
import TrustSection from "../components/home/TrustSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedCampaigns from "../components/home/FeaturedCampaigns";

function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <FeaturedCampaigns />
      <TrustSection />
      <HowItWorks />
    </>
  );
}

export default Home;