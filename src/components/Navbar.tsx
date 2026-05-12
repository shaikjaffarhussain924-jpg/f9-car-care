import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import whatsappLogo from "@/assets/whatsapp-logo.png";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={whatsappLogo} alt="WhatsApp" className={`${className} object-contain`} />
);

const services = [
  { label: "Ceramic Coating", slug: "ceramic-coating" },
  { label: "PPF (Paint Protection Film)", slug: "ppf" },
  { label: "Teflon Coating", slug: "teflon-coating" },
  { label: "Nano Coating", slug: "nano-coating" },
  { label: "Deep Interior Wash", slug: "deep-interior-wash" },
  { label: "Car Seat Covers", slug: "car-seat-covers" },
  { label: "Car Denting & Painting", slug: "car-denting-painting" },
  { label: "Car Restoration", slug: "car-restoration" },
  { label: "Car Sunfilm", slug: "car-sunfilm" },
  { label: "Car Washing & Painting", slug: "car-washing-painting" },
  { label: "Car General Service", slug: "car-general-service" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const otherLinks = [
    { label: "Workshop", href: isHome ? "#workshop" : "/#workshop" },
    { label: "Testimonials", href: isHome ? "#testimonials" : "/#testimonials" },
    { label: "Contact", href: isHome ? "#contact" : "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-[0_4px_30px_hsl(0_0%_0%/0.4)]"
          : "bg-background/80 backdrop-blur-md border-b border-border/20"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-20">
        <Link
          to="/"
          className="font-heading text-lg font-bold tracking-[0.2em] uppercase text-foreground"
        >
          F9 Car Care<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {/* Services dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              onClick={() => setServicesOpen((s) => !s)}
              className="text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1.5"
            >
              Services
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72"
                >
                  <div className="bg-background/95 backdrop-blur-xl border border-border/60 shadow-[0_20px_60px_hsl(0_0%_0%/0.5)] rounded-sm overflow-hidden">
                    <a
                      href={isHome ? "#services" : "/#services"}
                      onClick={() => setServicesOpen(false)}
                      className="block px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-primary border-b border-border/50 hover:bg-primary/5 transition-colors"
                    >
                      View All Services
                    </a>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => setServicesOpen(false)}
                          className="block px-5 py-2.5 text-xs tracking-wide text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {otherLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-primary hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/917032674047?text=I'd%20like%20to%20book%20a%20service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-[#25D366] transition-colors duration-300 flex items-center gap-1.5"
          >
            <WhatsAppIcon className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href="tel:+917032674047"
            className="text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <Link
            to="/book"
            className="text-xs tracking-[0.12em] uppercase bg-primary text-primary-foreground px-7 py-3 hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-[0_0_20px_hsl(45_100%_50%/0.3)]"
          >
            Book Service
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {/* Mobile services collapsible */}
              <button
                onClick={() => setMobileServicesOpen((s) => !s)}
                className="flex items-center justify-between text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-l border-border/50 ml-2 pl-4 flex flex-col gap-3"
                  >
                    <a
                      href={isHome ? "#services" : "/#services"}
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] tracking-[0.2em] uppercase text-primary"
                    >
                      View All
                    </a>
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {otherLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://wa.me/917032674047?text=I'd%20like%20to%20book%20a%20service"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-[#25D366] transition-colors flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="tel:+917032674047"
                className="text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                +91 70326 74047
              </a>
              <Link
                to="/book"
                onClick={() => setIsOpen(false)}
                className="text-sm tracking-[0.1em] uppercase bg-primary text-primary-foreground px-6 py-3 text-center hover:bg-primary/90 transition-colors"
              >
                Book Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
