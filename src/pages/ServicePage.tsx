import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { servicePages } from "@/data/servicePages";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = servicePages.find((s) => s.slug === slug);

  if (!data) return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>{data.titleTag}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://www.f9carcare.co.in/services/${data.slug}`} />
        <meta property="og:title" content={data.titleTag} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://www.f9carcare.co.in/services/${data.slug}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />
      <ServiceDetailPage data={data} />
      <Footer />
      <FloatingCTA />
    </>
  );
};

export default ServicePage;
