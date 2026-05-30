"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import SectionHeading from "@/components/SectionHeading";
import type { SectionProps } from "@/app/page";

export default function Skills({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();

  const groups = Object.values(portfolioData.skills);
  const oddCount = groups.length % 2 !== 0;

  return (
    <section id="skills" className="px-6 md:px-16 lg:px-32 py-16">
      <SectionHeading
        index={sectionIndex}
        title="Skills"
        blurb="The stack I reach for, grouped by layer."
      />

      {/* Bordered cell-grid — 1px dividers via a tinted background showing
          through `gap-px`, each cell painted with the page background. */}
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-slate-200/70 dark:border-slate-700/50 bg-slate-200/70 dark:bg-slate-700/50 max-w-4xl overflow-hidden rounded-xl"
      >
        {groups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            className={`bg-[var(--background)] p-6 md:p-7 ${
              oddCount && gi === groups.length - 1 ? "sm:col-span-2" : ""
            }`}
          >
            <h3 className="flex items-baseline gap-2.5 mb-4">
              <span className="font-mono text-xs text-blue-600 dark:text-indigo-400 tracking-wider">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-sm uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {group.category}
              </span>
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
