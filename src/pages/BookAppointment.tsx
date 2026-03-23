import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const BookAppointment = () => {
  return (
    <>
      <Helmet>
        <title>Contact F9 Car Care | Book Car Detailing in Hafeezpet, Hyderabad</title>
        <meta name="description" content="Get in touch with F9 Car Care in Hafeezpet, Hyderabad. Call, WhatsApp, or fill the form to book ceramic coating, PPF, or any detailing service." />
        <link rel="canonical" href="https://www.f9carcare.co.in/contact" />
        <meta property="og:title" content="Contact F9 Car Care | Book a Slot" />
        <meta property="og:description" content="Book ceramic coating, PPF, or car wash in Hafeezpet, Hyderabad." />
        <meta property="og:url" content="https://www.f9carcare.co.in/contact" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />
      <div className="pt-20">
        <BookingForm />
      </div>
      <Footer />
    </>
  );
};

export default BookAppointment;
