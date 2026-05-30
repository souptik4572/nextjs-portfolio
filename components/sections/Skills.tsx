"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { TrafficLights } from "@/components/MacOSElements";
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

      {/* macOS window shell wrapping the design's bordered box grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="max-w-4xl rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl macos-shadow"
      >
        {/* Window chrome — traffic lights + title */}
        <div className="relative flex items-center px-4 py-2.5 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-700/40">
          <TrafficLights size="small" />
          <span className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-slate-500 dark:text-slate-400">
            ~/skills
          </span>
        </div>

        {/* Box grid — 2-col cells split by 1px dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200/70 dark:bg-slate-700/50">
          {groups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + gi * 0.1 }}
              className={`group bg-white/80 dark:bg-slate-900/60 p-6 md:p-7 transition-colors hover:bg-blue-500/[0.04] dark:hover:bg-indigo-500/[0.06] ${
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
      </motion.div>
    </section>
  );
}
