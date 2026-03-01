"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full
            bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl
            border border-slate-200/60 dark:border-slate-700/50
            text-slate-600 dark:text-slate-300
            shadow-lg shadow-black/5 dark:shadow-black/20
            hover:bg-white/80 dark:hover:bg-slate-700/70
            hover:border-blue-400/50 dark:hover:border-indigo-400/50
            hover:text-blue-600 dark:hover:text-indigo-400
            hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/15
            hover:-translate-y-0.5
            transition-all duration-200 cursor-pointer"
        >
          <ArrowUp size={16} />
          <span className="text-sm font-medium hidden sm:inline">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
