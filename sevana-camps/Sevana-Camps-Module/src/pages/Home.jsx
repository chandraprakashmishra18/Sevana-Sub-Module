import Hero from "../components/home/Hero";
import CampStats from "../components/home/CampStats";
import FeaturedCamps from "../components/home/FeaturedCamps";
import HowItWorks from "../components/home/HowItWorks";

function Home() {
  return (
    <>
      <Hero />
      <CampStats />
      <FeaturedCamps />
      <HowItWorks />
    </>
  );
}

export default Home;