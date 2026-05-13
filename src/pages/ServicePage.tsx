import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import NotFound from "@/pages/NotFound";
import { servicePages } from "@/data/servicePages";
import { LEGACY_HTML_REDIRECTS } from "@/lib/legacyRedirects";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <NotFound />;

  // Legacy .html URL compatibility (e.g. /paint-protection-film.html → /ppf)
  if (slug.endsWith(".html")) {
    const target = LEGACY_HTML_REDIRECTS[slug];
    return <Navigate to={target ? `/${target}` : "/"} replace />;
  }

  const data = servicePages.find((s) => s.slug === slug);
  if (!data) return <NotFound />;

  const canonical = `https://f9-car-care.lovable.app/${data.slug}`;

  return (
    <>
      <Helmet>
        <title>{data.titleTag}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={data.titleTag} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={canonical} />
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
