"use client";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { MapPin, Mail, Github, Linkedin } from "lucide-react";
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
      className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 py-24"
    >
      <motion.span
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-mono text-indigo-400 text-base md:text-lg tracking-widest mb-4"
      >
        Hi, my name is
      </motion.span>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-5xl md:text-7xl font-bold text-slate-100 leading-tight"
      >
        {personal.name}
      </motion.h1>

      <motion.h2
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-400 mt-2 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem]"
      >
        <TypeAnimation
          sequence={[
            "Software Engineer (SDE-2)",
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
        className="mt-6 max-w-xl text-slate-400 text-base md:text-lg leading-relaxed"
      >
        {personal.bio}
      </motion.p>

      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-4 mt-8"
      >
        <a
          href="#contact"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Mail size={16} /> Contact Me
        </a>
        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:border-indigo-400 text-slate-300 hover:text-indigo-400 rounded-lg font-medium transition-colors"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href={personal.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:border-indigo-400 text-slate-300 hover:text-indigo-400 rounded-lg font-medium transition-colors"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </motion.div>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 mt-6 text-slate-500 text-sm"
      >
        <MapPin size={14} />
        <span>{personal.location}</span>
      </motion.div>
    </section>
  );
}
