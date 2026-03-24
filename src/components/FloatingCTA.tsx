import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const location = useLocation();
  const isBookPage = location.pathname === "/book";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isBookPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/917032674047?text=I'd%20like%20to%20book%20a%20service"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <Link
              to="/book"
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-4 shadow-[0_0_30px_hsl(45_100%_50%/0.4)] hover:shadow-[0_0_50px_hsl(45_100%_50%/0.5)] transition-all text-sm tracking-[0.1em] uppercase font-medium"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
