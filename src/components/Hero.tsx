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
    <section className="relative min-h-screen h-screen flex items-center overflow-hidden bg-background">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
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
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
        {/* Subtle grain / vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
      </div>

      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
        className="absolute top-24 left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left z-10"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0, 1] }}
          className="lg:col-span-8 max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="h-px w-12 bg-primary" />
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">
              F9 Car Care & Detailing Studio
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="font-heading text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.02em] text-foreground mb-8"
          >
            Best Car Detailing Studio in Hyderabad{" "}
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              | F9 Car Care
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mb-12 leading-relaxed font-light"
          >
            Complete car care solutions — from ceramic coating to full restoration. 20+ years of trusted craftsmanship in Hyderabad.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                to="/book"
                className="group relative inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground px-10 py-5 font-semibold overflow-hidden transition-all duration-500 shadow-[0_10px_40px_-10px_hsl(45_100%_50%/0.5)] hover:shadow-[0_20px_60px_-10px_hsl(45_100%_50%/0.7)]"
              >
                <span className="relative z-10">Book Your Service</span>
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <a
                href="tel:+917032674047"
                className="group inline-flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase border border-foreground/15 backdrop-blur-sm bg-background/30 text-foreground px-10 py-5 font-medium hover:border-primary hover:text-primary hover:bg-background/50 transition-all duration-500"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Call: 70326 74047
              </a>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6"
          >
            {[
              { v: "20+", l: "Years" },
              { v: "10K+", l: "Cars Detailed" },
              { v: "5★", l: "Rated Studio" },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-3">
                <span className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {s.v}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {s.l}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default Hero;
