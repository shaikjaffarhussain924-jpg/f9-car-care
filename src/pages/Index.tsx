import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Services from "@/components/Services";
import TrustSection from "@/components/TrustSection";
import WorkshopGallery from "@/components/WorkshopGallery";
import GarwareAuthorised from "@/components/GarwareAuthorised";
import Testimonials from "@/components/Testimonials";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>F9 Car Care – Professional Detailing & Car Wash</title>
        <meta name="description" content="F9 Car Care offers professional car detailing, full wash, and maintenance services. Easy online booking. Fast, reliable, and trusted." />
        <link rel="canonical" href="https://f9-car-care.lovable.app/" />
        <meta property="og:title" content="F9 Car Care – Professional Detailing & Car Wash" />
        <meta property="og:description" content="F9 Car Care offers professional car detailing, full wash, and maintenance services. Easy online booking. Fast, reliable, and trusted." />
        <meta property="og:url" content="https://f9-car-care.lovable.app/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />
      <Hero />
      <TrustBadges />
      <Services />
      <TrustSection />
      <WorkshopGallery />
      <GarwareAuthorised />
      <Testimonials />
      <LocationSection />
      <Footer />
      <FloatingCTA />
    </>
  );
};

export default Index;
