"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { ProjectEntry } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";
import type { SectionProps } from "@/app/page";

function ProjectCard({
  project,
  index,
  isFeatured = false,
}: {
  project: ProjectEntry;
  index: number;
  isFeatured?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <MacOSCard className="flex flex-col h-full">
        <div className={`flex flex-col flex-1 min-h-0 ${isFeatured ? "p-6 sm:p-8" : "p-3.5 sm:p-4"}`}>
          {/* Header row: icon + links */}
          <div className={`flex items-start justify-between ${isFeatured ? "mb-4" : "mb-2.5"}`}>
            <div
              className={`rounded-lg bg-blue-500/10 dark:bg-indigo-500/10 border border-blue-500/20 dark:border-indigo-500/20 flex items-center justify-center shrink-0 ${
                isFeatured ? "w-11 h-11" : "w-8 h-8"
              }`}
            >
              <span
                className={`text-blue-600 dark:text-indigo-400 font-mono ${
                  isFeatured ? "text-xl" : "text-sm"
                }`}
              >
                {"</>"}
              </span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github size={isFeatured ? 18 : 15} />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Live demo"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink size={isFeatured ? 18 : 15} />
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-slate-900 dark:text-slate-100 ${
              isFeatured ? "text-2xl sm:text-3xl mb-2" : "text-base sm:text-lg mb-1.5"
            }`}
          >
            {project.title}
          </h3>

          {/* Description — clamped in compact cards so tech badges stay visible */}
          <p
            className={`text-slate-600 dark:text-slate-400 leading-relaxed ${
              isFeatured
                ? "text-base sm:text-lg flex-1"
                : "text-xs sm:text-sm line-clamp-2"
            }`}
          >
            {project.description}
          </p>

          {/* Tech badges — pinned to bottom */}
          <div className={`flex flex-wrap gap-1.5 mt-auto ${isFeatured ? "pt-6" : "pt-3"}`}>
            {project.tech.map((t) => (
              <span
                key={t}
                className={`bg-blue-50 dark:bg-indigo-950/30 border border-blue-200/60 dark:border-indigo-500/30 text-blue-700 dark:text-indigo-300 rounded-md font-semibold hover:bg-blue-100 dark:hover:bg-indigo-900/40 hover:border-blue-300 dark:hover:border-indigo-400/50 transition-all ${
                  isFeatured ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-[11px]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </MacOSCard>
    </motion.div>
  );
}

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
             Top-left  & bottom-right → tall  (flex-1, isFeatured)
             Top-right & bottom-left  → short (fixed h-[220px])
        ─────────────────────────────────────────────────────────── */}

        {/* Mobile: plain stack */}
        <div className="flex flex-col gap-4 md:hidden">
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isFeatured={i === 0 || i === 3} />
          ))}
        </div>

        {/* md+: diagonal two-column bento */}
        <div className="hidden md:flex gap-4 lg:gap-6">
          {/* Left column — tall top, short bottom */}
          <div className="flex flex-col gap-4 lg:gap-6 flex-1">
            <div className="flex-1 min-h-[300px]">
              <ProjectCard project={FEATURED_PROJECTS[0]} index={0} isFeatured />
            </div>
            <div className="h-[260px]">
              <ProjectCard project={FEATURED_PROJECTS[2]} index={2} />
            </div>
          </div>

          {/* Right column — short top, tall bottom */}
          <div className="flex flex-col gap-4 lg:gap-6 flex-1">
            <div className="h-[260px]">
              <ProjectCard project={FEATURED_PROJECTS[1]} index={1} />
            </div>
            <div className="flex-1 min-h-[300px]">
              <ProjectCard project={FEATURED_PROJECTS[3]} index={3} isFeatured />
            </div>
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
