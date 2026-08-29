
import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import Navigation from "@/components/Navigation";
import LiveMarket from "@/components/LiveMarket";
import InsurancePreview from "@/components/InsurancePreview";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FBFAF8]">
      <Navigation />
      <ScrollStory />
      <Hero />
      <LiveMarket />
      <HowItWorks />
      <InsurancePreview />
      <PricingSection />
      <Testimonials />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
