import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | F9 Car Care & Detailing Studio</title>
        <meta
          name="description"
          content="Privacy Policy of F9 Car Care — what information we collect, how we store it, and how we use WhatsApp & email to serve you."
        />
        <link rel="canonical" href="https://www.f9carcare.co.in/privacy-policy" />
      </Helmet>

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <header className="mb-12 border-b border-border pb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-3">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: 20 April 2026
          </p>
        </header>

        <article className="space-y-10 text-foreground/90 leading-relaxed">
          <section>
            <p>
              F9 Car Care & Detailing Studio ("F9 Car Care", "we", "us", or "our")
              operates the website{" "}
              <a href="https://www.f9carcare.co.in" className="text-primary hover:underline">
                www.f9carcare.co.in
              </a>{" "}
              and provides car detailing, ceramic coating, PPF, restoration and general
              servicing from our workshop in Hyderabad. This Privacy Policy explains what
              information we collect from you, why we collect it, how we store it, and the
              choices you have. We respect your privacy and only collect what we need to
              serve you well.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We only collect information that you voluntarily provide when you book a
              service, contact us, or message us on WhatsApp. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Name</strong> — so we know who we are speaking to and can address
                you correctly.
              </li>
              <li>
                <strong>Phone number</strong> — to confirm your appointment, send service
                updates, and coordinate pickup/drop.
              </li>
              <li>
                <strong>Email address</strong> — for booking confirmations, invoices, and
                occasional service reminders.
              </li>
              <li>
                <strong>Vehicle details</strong> — make, model, year, and condition so we
                can prepare an accurate quote.
              </li>
              <li>
                <strong>Service preferences and messages</strong> — what you ask for in
                forms or WhatsApp chats.
              </li>
              <li>
                <strong>Photos of your vehicle</strong> — only when you choose to share
                them with us for an estimate.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> collect payment card details on this website. All
              payments are handled in person at the workshop or through trusted third-party
              payment apps.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              2. Why We Collect This Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your enquiries and booking requests.</li>
              <li>To confirm, schedule, and remind you about your appointment.</li>
              <li>To provide accurate service quotes for your vehicle.</li>
              <li>To send invoices, receipts, and post-service care instructions.</li>
              <li>To improve our services based on the feedback you share.</li>
              <li>To comply with applicable Indian laws and tax requirements.</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information with any third
              party for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              3. WhatsApp Business & Meta Platforms
            </h2>
            <p className="mb-3">
              We use the <strong>WhatsApp Business Platform</strong> (provided by Meta
              Platforms, Inc.) to communicate with customers. When you message us on
              WhatsApp or click a "WhatsApp" / "Book on WhatsApp" button on this website:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your WhatsApp phone number, profile name, and the messages you send become
                visible to us so we can respond to your enquiry.
              </li>
              <li>
                We may use an automated WhatsApp bot built on Meta's WhatsApp Business API
                to send booking confirmations, appointment reminders, status updates, and
                replies to common questions.
              </li>
              <li>
                Messages exchanged on WhatsApp are end-to-end encrypted between you and
                our WhatsApp Business account, in line with Meta's WhatsApp encryption.
              </li>
              <li>
                Meta may process message metadata (such as delivery status and timestamps)
                under their own{" "}
                <a
                  href="https://www.whatsapp.com/legal/business-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp Business Policy
                </a>{" "}
                and{" "}
                <a
                  href="https://www.whatsapp.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp Privacy Policy
                </a>
                .
              </li>
              <li>
                We only send you marketing or promotional WhatsApp messages if you have
                opted in. You can opt out at any time by replying <strong>STOP</strong> in
                the chat.
              </li>
            </ul>
            <p className="mt-3">
              We do not use WhatsApp message content for advertising and we do not share
              your chats with third parties other than Meta as required to operate the
              WhatsApp Business service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              4. Email Communication
            </h2>
            <p className="mb-3">
              When you submit your email address through our booking form or contact us at{" "}
              <a
                href="mailto:support@f9carcare.co.in"
                className="text-primary hover:underline"
              >
                support@f9carcare.co.in
              </a>
              , we use it strictly to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send booking confirmations and digital invoices.</li>
              <li>Send service-related updates (e.g., when your car is ready).</li>
              <li>Reply to questions or feedback you have raised with us.</li>
              <li>
                Occasionally inform you about important changes to our services, only when
                relevant to you as a customer.
              </li>
            </ul>
            <p className="mt-3">
              We do not run bulk marketing email campaigns. You can ask us to remove your
              email from our records at any time by writing to{" "}
              <a
                href="mailto:support@f9carcare.co.in"
                className="text-primary hover:underline"
              >
                support@f9carcare.co.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              5. How Your Information Is Stored
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Booking and contact details are stored in our secure cloud database hosted
                with reputable providers that follow industry-standard security practices.
              </li>
              <li>
                Access to customer data is restricted to authorised F9 Car Care staff who
                need it to manage your appointment and service.
              </li>
              <li>
                Data is transmitted over encrypted HTTPS connections between your browser
                and our servers.
              </li>
              <li>
                WhatsApp conversations are stored within the WhatsApp Business app /
                platform we use to chat with you.
              </li>
              <li>
                We retain your information only for as long as needed to provide our
                services, maintain service history for warranty purposes, and meet legal
                obligations. Typically this is up to 3 years from your last interaction,
                after which records may be anonymised or deleted.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              6. Cookies & Website Analytics
            </h2>
            <p>
              Our website may use minimal cookies and basic analytics (such as page views
              and device type) to understand how visitors use the site and improve it. No
              personally identifying profile is built from this data. You can disable
              cookies in your browser settings at any time without losing access to the
              site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              7. Sharing of Information
            </h2>
            <p className="mb-3">We share your information only when necessary, with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Meta / WhatsApp — to deliver messages between you and our WhatsApp
                Business account.
              </li>
              <li>
                Our hosting and database providers — strictly for storing your booking
                information securely.
              </li>
              <li>
                Government or legal authorities — only when required by Indian law.
              </li>
            </ul>
            <p className="mt-3">
              We never sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              8. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ask what information we hold about you.</li>
              <li>Request correction of any inaccurate details.</li>
              <li>Request deletion of your data (where we are not legally required to keep it).</li>
              <li>Opt out of WhatsApp or email communication at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:support@f9carcare.co.in"
                className="text-primary hover:underline"
              >
                support@f9carcare.co.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              9. Children's Privacy
            </h2>
            <p>
              Our services are intended for vehicle owners aged 18 and above. We do not
              knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version will
              always be available on this page with the updated date at the top.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              11. Contact Us
            </h2>
            <p className="mb-2">
              For any questions about this Privacy Policy or how we handle your data:
            </p>
            <p>
              <strong>F9 Car Care & Detailing Studio</strong>
              <br />
              Near Gopal Nagar Kamaan, Beside Line F9 Pharmacy, Manjeera Pipeline Road,
              Gopal Nagar, Hyderabad - 500085
              <br />
              Email:{" "}
              <a
                href="mailto:support@f9carcare.co.in"
                className="text-primary hover:underline"
              >
                support@f9carcare.co.in
              </a>
              <br />
              Phone:{" "}
              <a href="tel:+917032674047" className="text-primary hover:underline">
                +91 70326 74047
              </a>
            </p>
          </section>

          <div className="pt-8 border-t border-border">
            <Link
              to="/"
              className="text-xs tracking-[0.15em] uppercase text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
