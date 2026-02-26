"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";

const NAV_LABELS: Record<string, string> = {
  intro: "Home",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  contact: "Contact",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 py-3"
          : "py-5"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-16 flex items-center justify-between">
        <a href="#intro" className="font-mono text-indigo-400 font-bold text-lg">
          SS/
        </a>
        <ul className="hidden md:flex items-center gap-6">
          {portfolioData.layout.section_order.map((section, i) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium"
              >
                <span className="text-indigo-400 font-mono text-xs mr-1">
                  0{i + 1}.
                </span>
                {NAV_LABELS[section] ?? section}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
