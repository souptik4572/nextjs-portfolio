"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { ProjectCard } from "@/components/ProjectCard";
import type { SectionProps } from "@/app/page";

export default function Projects({ sectionIndex }: SectionProps) {
  const portfolioData = usePortfolioData();
  const FEATURED_PROJECTS = Object.values(portfolioData.projects).slice(0, 4);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="py-16">
      <div className="px-6 md:px-16 lg:px-32">
        {/* Section heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            {sectionIndex !== undefined && (
              <span className="text-blue-600 dark:text-indigo-400 font-mono text-2xl mr-3">
                {String(sectionIndex).padStart(2, "0")}.
              </span>
            )}
            Projects
          </h2>
          <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            A selection of work I&apos;m proud of
          </p>
        </motion.div>

        {/* ─── Bento Grid ────────────────────────────────────────────────
             Mobile  : single column, all 4 cards stacked
             md+     : diagonal asymmetric two-column layout
                        ┌──────────────┬──────────────┐
                        │   TALL [0]   │  SHORT [1]   │
                        │              ├──────────────┤
                        ├──────────────│   TALL  [3]  │
                        │  SHORT [2]   │              │
                        └──────────────┴──────────────┘
             Top-left  & bottom-right → tall  (isFeatured)
             Top-right & bottom-left  → short (fixed h-[260px])
        ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-4 lg:gap-6">
          <div className="md:min-h-[300px] h-full">
            <ProjectCard project={FEATURED_PROJECTS[0]} index={0} isFeatured />
          </div>
          <div className="md:h-[260px]">
            <ProjectCard project={FEATURED_PROJECTS[1]} index={1} />
          </div>
          <div className="md:h-[260px]">
            <ProjectCard project={FEATURED_PROJECTS[2]} index={2} />
          </div>
          <div className="md:min-h-[300px] h-full">
            <ProjectCard project={FEATURED_PROJECTS[3]} index={3} isFeatured />
          </div>
        </div>

        {/* View All Projects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mt-8 flex justify-end"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-blue-400/70 dark:hover:border-indigo-500/50 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-blue-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200"
          >
            View All Projects
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
