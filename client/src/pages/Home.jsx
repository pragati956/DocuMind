import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import ScrollToTopButton
from "../components/landing/ScrollToTopButton";

export default function Home() {
  return (
   <main className="bg-[#0B0F19] min-h-screen overflow-x-hidden">
  <Navbar />

  <HeroSection />

  <FeaturesSection />

  <CTASection />

  <Footer />

  <ScrollToTopButton />
</main>
  );
}