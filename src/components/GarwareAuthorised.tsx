import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import garwareImg from "@/assets/garware-authorised.jpg";

const GarwareAuthorised = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-lg bg-black"
        >
          <video
            ref={videoRef}
            src="/ppf-demo.mp4"
            poster={garwareImg}
            loop
            muted={muted}
            playsInline
            preload="metadata"
            aria-label="Hyderabad's Garware authorised detailing studio — F9 Car Care PPF & paint protection film"
            className="w-full h-auto object-cover"
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute bottom-3 right-3 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default GarwareAuthorised;
