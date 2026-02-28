"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { MapPin, Mail, Linkedin, Eye, ExternalLink } from "lucide-react";
import Image from "next/image";
import { portfolioData } from "@/lib/data";
import Modal from "@/components/Modal";
import ContactForm from "@/components/ContactForm";

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
  const codingProfiles = Object.values(personal.coding_profiles);
  const [contactOpen, setContactOpen] = useState(false);

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
          sequence={personal.alternateRoles.flatMap((role) => [role, 2000])}
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
          onClick={(e) => {
            e.preventDefault();
            setContactOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 dark:shadow-indigo-500/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-indigo-500/30 hover:-translate-y-0.5 cursor-pointer"
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

      {/* Coding Profiles Section */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-12 max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 max-w-[3rem] bg-gradient-to-r from-transparent via-blue-500/40 dark:via-indigo-400/40 to-blue-500/40 dark:to-indigo-400/40" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Coding Profiles
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 dark:from-indigo-400/40 via-blue-500/40 dark:via-indigo-400/40 to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {codingProfiles.map((profile, idx) => (
            <motion.a
              key={profile.title}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.08, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative"
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 dark:from-indigo-500/30 dark:via-purple-500/30 dark:to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
              
              {/* Glow effect on hover */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-cyan-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

              {/* Card content */}
              <div className="relative flex flex-col items-center gap-3 px-4 py-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md transition-all duration-300 group-hover:border-blue-400/40 dark:group-hover:border-indigo-400/40 group-hover:bg-white/80 dark:group-hover:bg-slate-800/60 group-hover:shadow-lg group-hover:shadow-blue-500/5 dark:group-hover:shadow-indigo-500/10">
                {/* Profile icon */}
                <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-700/50 group-hover:bg-blue-50 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
                  <Image
                    src={profile.image}
                    alt={profile.title}
                    width={24}
                    height={24}
                    className="dark:invert dark:brightness-200 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                {/* Title + arrow */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-indigo-300 transition-colors duration-300">
                    {profile.title}
                  </span>
                  <ExternalLink
                    size={11}
                    className="text-slate-400 dark:text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  />
                </div>

                {/* Subtle bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-2/3 h-[2px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 transition-all duration-500 ease-out" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Contact Modal */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Send me a message"
      >
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
          Fill out the form below and I&apos;ll get back to you as soon as
          possible.
        </p>
        <ContactForm idPrefix="intro" />
      </Modal>
    </section>
  );
}
