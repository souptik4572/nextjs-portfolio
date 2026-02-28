"use client";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { MapPin, Mail, Github, Linkedin, Eye } from "lucide-react";
import { portfolioData } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" },
  }),
};

export default function Intro() {
  const { personal } = portfolioData;
  return (
    <section
      id="intro"
      className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 py-16"
    >
      <motion.span
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-blue-600 dark:text-indigo-400 text-lg md:text-xl font-light tracking-wide mb-3"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
      >
        Hi, my name is
      </motion.span>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-slate-100 leading-tight"
      >
        {personal.name}
      </motion.h1>

      <motion.h2
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-600 dark:text-slate-400 mt-3 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem]"
      >
        <TypeAnimation
          sequence={[
            "Software Engineer",
            2000,
            "Full-Stack Developer",
            2000,
            "Polyglot Engineer",
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          cursor={true}
          style={{ display: "inline-block" }}
        />
      </motion.h2>

      <motion.p
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-5 max-w-xl text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed"
      >
        {personal.bio}
      </motion.p>

      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-4 mt-6"
      >
        <a
          href="#contact"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 dark:shadow-indigo-500/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-indigo-500/30 hover:-translate-y-0.5"
        >
          <Mail size={16} /> Contact Me
        </a>
        <a
          href={personal.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300/60 dark:border-slate-600/60 hover:border-blue-500/60 dark:hover:border-indigo-400/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          <Eye size={16} /> Resume
        </a>
        <a
          href={personal.coding_profiles.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300/60 dark:border-slate-600/60 hover:border-blue-500/60 dark:hover:border-indigo-400/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href={personal.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300/60 dark:border-slate-600/60 hover:border-blue-500/60 dark:hover:border-indigo-400/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg font-medium transition-all hover:-translate-y-0.5"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </motion.div>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 mt-5 text-slate-500 dark:text-slate-500 text-base"
      >
        <MapPin size={16} />
        <span>{personal.location}</span>
      </motion.div>
    </section>
  );
}
