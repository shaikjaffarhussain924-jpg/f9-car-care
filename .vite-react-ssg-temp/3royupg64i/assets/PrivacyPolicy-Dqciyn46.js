import { jsxs, jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { N as Navbar, F as Footer } from "../main.mjs";
import "vite-react-ssg";
import "react";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "framer-motion";
import "embla-carousel-react";
import "@radix-ui/react-slot";
const PrivacyPolicy = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Privacy Policy | F9 Car Care & Detailing Studio" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Privacy Policy of F9 Car Care — what information we collect, how we store it, and how we use WhatsApp & email to serve you."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: "https://www.f9carcare.co.in/privacy-policy" })
    ] }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20", children: [
      /* @__PURE__ */ jsxs("header", { className: "mb-12 border-b border-border pb-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs tracking-[0.2em] uppercase text-primary mb-3", children: "Legal" }),
        /* @__PURE__ */ jsx("h1", { className: "font-heading text-4xl md:text-5xl font-bold text-foreground mb-4", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Last updated: 20 April 2026" })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "space-y-10 text-foreground/90 leading-relaxed", children: [
        /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs("p", { children: [
          'F9 Car Care & Detailing Studio ("F9 Car Care", "we", "us", or "our") operates the website',
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://www.f9carcare.co.in", className: "text-primary hover:underline", children: "www.f9carcare.co.in" }),
          " ",
          "and provides car detailing, ceramic coating, PPF, restoration and general servicing from our workshop in Hyderabad. This Privacy Policy explains what information we collect from you, why we collect it, how we store it, and the choices you have. We respect your privacy and only collect what we need to serve you well."
        ] }) }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "1. Information We Collect" }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "We only collect information that you voluntarily provide when you book a service, contact us, or message us on WhatsApp. Specifically:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Name" }),
              " — so we know who we are speaking to and can address you correctly."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Phone number" }),
              " — to confirm your appointment, send service updates, and coordinate pickup/drop."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Email address" }),
              " — for booking confirmations, invoices, and occasional service reminders."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Vehicle details" }),
              " — make, model, year, and condition so we can prepare an accurate quote."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Service preferences and messages" }),
              " — what you ask for in forms or WhatsApp chats."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Photos of your vehicle" }),
              " — only when you choose to share them with us for an estimate."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3", children: [
            "We do ",
            /* @__PURE__ */ jsx("strong", { children: "not" }),
            " collect payment card details on this website. All payments are handled in person at the workshop or through trusted third-party payment apps."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "2. Why We Collect This Information" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "To respond to your enquiries and booking requests." }),
            /* @__PURE__ */ jsx("li", { children: "To confirm, schedule, and remind you about your appointment." }),
            /* @__PURE__ */ jsx("li", { children: "To provide accurate service quotes for your vehicle." }),
            /* @__PURE__ */ jsx("li", { children: "To send invoices, receipts, and post-service care instructions." }),
            /* @__PURE__ */ jsx("li", { children: "To improve our services based on the feedback you share." }),
            /* @__PURE__ */ jsx("li", { children: "To comply with applicable Indian laws and tax requirements." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3", children: "We do not sell, rent, or trade your personal information with any third party for marketing purposes." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "3. WhatsApp Business & Meta Platforms" }),
          /* @__PURE__ */ jsxs("p", { className: "mb-3", children: [
            "We use the ",
            /* @__PURE__ */ jsx("strong", { children: "WhatsApp Business Platform" }),
            ' (provided by Meta Platforms, Inc.) to communicate with customers. When you message us on WhatsApp or click a "WhatsApp" / "Book on WhatsApp" button on this website:'
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "Your WhatsApp phone number, profile name, and the messages you send become visible to us so we can respond to your enquiry." }),
            /* @__PURE__ */ jsx("li", { children: "We may use an automated WhatsApp bot built on Meta's WhatsApp Business API to send booking confirmations, appointment reminders, status updates, and replies to common questions." }),
            /* @__PURE__ */ jsx("li", { children: "Messages exchanged on WhatsApp are end-to-end encrypted between you and our WhatsApp Business account, in line with Meta's WhatsApp encryption." }),
            /* @__PURE__ */ jsxs("li", { children: [
              "Meta may process message metadata (such as delivery status and timestamps) under their own",
              " ",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://www.whatsapp.com/legal/business-policy",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-primary hover:underline",
                  children: "WhatsApp Business Policy"
                }
              ),
              " ",
              "and",
              " ",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://www.whatsapp.com/legal/privacy-policy",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-primary hover:underline",
                  children: "WhatsApp Privacy Policy"
                }
              ),
              "."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              "We only send you marketing or promotional WhatsApp messages if you have opted in. You can opt out at any time by replying ",
              /* @__PURE__ */ jsx("strong", { children: "STOP" }),
              " in the chat."
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3", children: "We do not use WhatsApp message content for advertising and we do not share your chats with third parties other than Meta as required to operate the WhatsApp Business service." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "4. Email Communication" }),
          /* @__PURE__ */ jsxs("p", { className: "mb-3", children: [
            "When you submit your email address through our booking form or contact us at",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:support@f9carcare.co.in",
                className: "text-primary hover:underline",
                children: "support@f9carcare.co.in"
              }
            ),
            ", we use it strictly to:"
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "Send booking confirmations and digital invoices." }),
            /* @__PURE__ */ jsx("li", { children: "Send service-related updates (e.g., when your car is ready)." }),
            /* @__PURE__ */ jsx("li", { children: "Reply to questions or feedback you have raised with us." }),
            /* @__PURE__ */ jsx("li", { children: "Occasionally inform you about important changes to our services, only when relevant to you as a customer." })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3", children: [
            "We do not run bulk marketing email campaigns. You can ask us to remove your email from our records at any time by writing to",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:support@f9carcare.co.in",
                className: "text-primary hover:underline",
                children: "support@f9carcare.co.in"
              }
            ),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "5. How Your Information Is Stored" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "Booking and contact details are stored in our secure cloud database hosted with reputable providers that follow industry-standard security practices." }),
            /* @__PURE__ */ jsx("li", { children: "Access to customer data is restricted to authorised F9 Car Care staff who need it to manage your appointment and service." }),
            /* @__PURE__ */ jsx("li", { children: "Data is transmitted over encrypted HTTPS connections between your browser and our servers." }),
            /* @__PURE__ */ jsx("li", { children: "WhatsApp conversations are stored within the WhatsApp Business app / platform we use to chat with you." }),
            /* @__PURE__ */ jsx("li", { children: "We retain your information only for as long as needed to provide our services, maintain service history for warranty purposes, and meet legal obligations. Typically this is up to 3 years from your last interaction, after which records may be anonymised or deleted." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "6. Cookies & Website Analytics" }),
          /* @__PURE__ */ jsx("p", { children: "Our website may use minimal cookies and basic analytics (such as page views and device type) to understand how visitors use the site and improve it. No personally identifying profile is built from this data. You can disable cookies in your browser settings at any time without losing access to the site." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "7. Sharing of Information" }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "We share your information only when necessary, with:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "Meta / WhatsApp — to deliver messages between you and our WhatsApp Business account." }),
            /* @__PURE__ */ jsx("li", { children: "Our hosting and database providers — strictly for storing your booking information securely." }),
            /* @__PURE__ */ jsx("li", { children: "Government or legal authorities — only when required by Indian law." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3", children: "We never sell your personal data." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "8. Your Rights" }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "You have the right to:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { children: "Ask what information we hold about you." }),
            /* @__PURE__ */ jsx("li", { children: "Request correction of any inaccurate details." }),
            /* @__PURE__ */ jsx("li", { children: "Request deletion of your data (where we are not legally required to keep it)." }),
            /* @__PURE__ */ jsx("li", { children: "Opt out of WhatsApp or email communication at any time." })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3", children: [
            "To exercise any of these rights, email us at",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:support@f9carcare.co.in",
                className: "text-primary hover:underline",
                children: "support@f9carcare.co.in"
              }
            ),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "9. Children's Privacy" }),
          /* @__PURE__ */ jsx("p", { children: "Our services are intended for vehicle owners aged 18 and above. We do not knowingly collect data from minors." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "10. Changes to This Policy" }),
          /* @__PURE__ */ jsx("p", { children: "We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date at the top." })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-foreground mb-4", children: "11. Contact Us" }),
          /* @__PURE__ */ jsx("p", { className: "mb-2", children: "For any questions about this Privacy Policy or how we handle your data:" }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "F9 Car Care & Detailing Studio" }),
            /* @__PURE__ */ jsx("br", {}),
            "Near Gopal Nagar Kamaan, Beside Line F9 Pharmacy, Manjeera Pipeline Road, Gopal Nagar, Hyderabad - 500085",
            /* @__PURE__ */ jsx("br", {}),
            "Email:",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:support@f9carcare.co.in",
                className: "text-primary hover:underline",
                children: "support@f9carcare.co.in"
              }
            ),
            /* @__PURE__ */ jsx("br", {}),
            "Phone:",
            " ",
            /* @__PURE__ */ jsx("a", { href: "tel:+917032674047", className: "text-primary hover:underline", children: "+91 70326 74047" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-8 border-t border-border", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            className: "text-xs tracking-[0.15em] uppercase text-primary hover:underline",
            children: "← Back to Home"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  PrivacyPolicy as default
};
