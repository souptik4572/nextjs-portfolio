"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { ProjectCard } from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import type { SectionProps } from "@/app/page";

export default function Projects({ sectionIndex }: SectionProps) {
  const portfolioData = usePortfolioData();
  // Sort by admin-configured `order` (missing → end, key as tiebreaker), then take the first 4.
  const FEATURED_PROJECTS = Object.entries(portfolioData.projects)
    .sort(([keyA, a], [keyB, b]) => {
      const oa = a.order ?? Number.POSITIVE_INFINITY;
      const ob = b.order ?? Number.POSITIVE_INFINITY;
      if (oa !== ob) return oa - ob;
      return keyA.localeCompare(keyB);
    })
    .map(([, project]) => project)
    .slice(0, 4);

  return (
    <section id="projects" className="py-16">
      <div className="px-6 md:px-16 lg:px-32">
        <SectionHeading
          index={sectionIndex}
          title="Projects"
          blurb="A selection of work I'm proud of."
        />

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
