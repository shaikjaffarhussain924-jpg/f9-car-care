import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-background pt-24 md:pt-28 pb-20">
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/hero-bg.mp4"
          poster={heroBg}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/25 md:to-background/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-background/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,hsl(var(--background)/0.55)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0, 1] }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-primary" />
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-medium">
              F9 Car Care & Detailing Studio
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="font-heading text-[clamp(1.875rem,4.2vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-foreground mb-6"
          >
            Best Car Detailing Studio in Hyderabad{" "}
            <span className="block mt-1 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              | F9 Car Care
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-sm md:text-base text-muted-foreground max-w-lg mb-10 leading-relaxed font-light"
          >
            Complete car care solutions — from ceramic coating to full restoration. 20+ years of trusted craftsmanship in Hyderabad.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                to="/book"
                className="group relative inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-8 py-4 font-semibold overflow-hidden transition-all duration-500 shadow-[0_10px_40px_-10px_hsl(45_100%_50%/0.5)] hover:shadow-[0_20px_60px_-10px_hsl(45_100%_50%/0.7)]"
              >
                <span className="relative z-10">Book Your Service</span>
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <a
                href="tel:+917032674047"
                className="group inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase border border-foreground/15 backdrop-blur-sm bg-background/30 text-foreground px-8 py-4 font-medium hover:border-primary hover:text-primary hover:bg-background/50 transition-all duration-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Call: 70326 74047
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default Hero;
