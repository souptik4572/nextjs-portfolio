"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { SectionProps } from "@/app/page";

export default function Skills({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();

  return (
    <section id="skills" className="px-6 md:px-16 lg:px-32 py-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
          {sectionIndex !== undefined && (
            <span className="text-blue-600 dark:text-indigo-400 font-mono text-2xl mr-3">{String(sectionIndex).padStart(2, '0')}.</span>
          )}
          Skills
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl">
        {Object.values(portfolioData.skills).map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
          >
            <h3 className="text-blue-600 dark:text-indigo-400 font-mono text-base tracking-wider mb-3">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 font-mono text-sm tracking-tight bg-blue-500/[0.06] dark:bg-indigo-500/[0.08] border border-blue-500/20 dark:border-indigo-500/25 text-slate-700 dark:text-slate-300 rounded-md hover:bg-blue-500/10 dark:hover:bg-indigo-500/15 hover:border-blue-500/45 dark:hover:border-indigo-400/50 hover:text-blue-700 dark:hover:text-indigo-200 transition-all"
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
