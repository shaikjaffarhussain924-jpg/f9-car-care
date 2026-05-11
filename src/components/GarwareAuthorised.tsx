import { motion } from "framer-motion";
import garwareImg from "@/assets/garware-authorised.jpg";

const GarwareAuthorised = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={garwareImg}
            alt="Hyderabad's Garware authorised detailing studio — F9 Car Care PPF & paint protection film"
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GarwareAuthorised;
