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

    // Cross-browser autoplay requirements: muted + playsInline must be set
    // imperatively (some browsers ignore React props before first paint).
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    // Some mobile browsers need a nudge after metadata is ready
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
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
            src="/homepage-showcase.mp4"
            poster={garwareImg}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
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
