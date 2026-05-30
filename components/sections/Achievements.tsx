"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { TrafficLights } from "@/components/MacOSElements";
import SectionHeading from "@/components/SectionHeading";
import type { SectionProps } from "@/app/page";

export default function Achievements({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();

  const achievements = Object.entries(portfolioData.achievements);
  const oddCount = achievements.length % 2 !== 0;

  return (
    <section id="achievements" className="px-6 md:px-16 lg:px-32 py-16">
      <SectionHeading
        index={sectionIndex}
        title="Achievements"
        blurb="Recognitions and selections from outside the day job."
      />

      {/* macOS window shell wrapping the design's bordered box grid */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="max-w-3xl rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl macos-shadow"
      >
        {/* Window chrome — traffic lights + title */}
        <div className="relative flex items-center px-4 py-2.5 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-700/40">
          <TrafficLights size="small" />
          <span className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-slate-500 dark:text-slate-400">
            ~/achievements
          </span>
        </div>

        {/* Box grid — 2-col cells split by 1px dividers (design's `.ach-grid`) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200/70 dark:bg-slate-700/50">
          {achievements.map(([id, achievement], i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className={`group bg-white/80 dark:bg-slate-900/60 p-7 md:p-8 transition-colors hover:bg-blue-500/[0.04] dark:hover:bg-indigo-500/[0.06] ${
                oddCount && i === achievements.length - 1 ? "sm:col-span-2" : ""
              }`}
            >
              {/* mono year + trophy accent (design's `.ach-year`) */}
              <div className="flex items-center gap-2 mb-3 font-mono text-xs tracking-wider text-blue-600 dark:text-indigo-400">
                <Trophy size={13} className="shrink-0" />
                {achievement.date}
              </div>
              <h3 className="font-heading text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100 mb-3.5">
                {achievement.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-400 text-pretty">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
