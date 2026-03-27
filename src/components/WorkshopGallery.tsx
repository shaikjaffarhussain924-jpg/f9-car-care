import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import gallery1 from "@/assets/gallery-1.webp";
import gallery2 from "@/assets/gallery-2.webp";
import gallery3 from "@/assets/gallery-3.webp";
import gallery4 from "@/assets/gallery-4.webp";
import gallery5 from "@/assets/gallery-5.webp";
import gallery6 from "@/assets/gallery-6.webp";

const images = [
  { src: gallery1, alt: "F9 Car Care studio front with BMW" },
  { src: gallery2, alt: "Matte black Skoda Kushaq wrap at F9" },
  { src: gallery3, alt: "BYD with Garware PPF at F9 studio" },
  { src: gallery4, alt: "Red car denting and painting work at F9" },
  { src: gallery5, alt: "Skoda Kushaq ceramic coating at F9" },
  { src: gallery6, alt: "Red BYD at F9 Car Care entrance" },
];

const WorkshopGallery = () => {
  return (
    <section id="workshop" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="luxury-divider mb-6" />
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            The Atelier
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Where engineering meets artistry.
          </p>
        </motion.div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {images.map((img, i) => (
              <CarouselItem key={img.alt} className="pl-4 md:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="overflow-hidden group"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105 rounded-lg"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default WorkshopGallery;
