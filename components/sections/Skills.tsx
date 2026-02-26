"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { portfolioData } from "@/lib/data";

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="px-6 md:px-16 lg:px-32 py-24 bg-slate-900/40">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
          <span className="text-indigo-400 font-mono text-xl mr-3">03.</span>
          Skills
        </h2>
        <div className="mt-2 h-px w-32 bg-indigo-500/40" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
        {portfolioData.skills.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
          >
            <h3 className="text-indigo-400 font-mono text-sm tracking-wider mb-3">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-md text-sm font-medium hover:border-indigo-500/60 hover:text-indigo-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
