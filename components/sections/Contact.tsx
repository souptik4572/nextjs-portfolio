"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { personal } = portfolioData;

  return (
    <section id="contact" className="px-6 md:px-16 lg:px-32 py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
          <span className="text-indigo-400 font-mono text-xl mr-3">06.</span>
          Get In Touch
        </h2>
        <div className="mt-2 h-px w-32 bg-indigo-500/40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="max-w-lg"
      >
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          I&apos;m currently open to senior engineering opportunities. Whether
          you have a question, a project idea, or just want to say hi — my inbox
          is always open.
        </p>

        <div className="space-y-4">
          <a
            href={`mailto:${personal.email}`}
            className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
              <Mail size={16} />
            </span>
            <span>{personal.email}</span>
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
              <Github size={16} />
            </span>
            <span>github.com/souptik4572</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-300 hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
              <Linkedin size={16} />
            </span>
            <span>linkedin.com/in/souptik-sarkar</span>
          </a>
          <div className="flex items-center gap-3 text-slate-500">
            <span className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <MapPin size={16} />
            </span>
            <span>{personal.location}</span>
          </div>
        </div>

        <a
          href={`mailto:${personal.email}`}
          className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Mail size={16} /> Say Hello
        </a>
      </motion.div>
    </section>
  );
}
