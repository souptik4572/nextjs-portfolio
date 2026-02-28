"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import { portfolioData } from "@/lib/data";
import type { ProjectEntry } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";
import type { SectionProps } from "@/app/page";

function ProjectCard({
  project,
  index,
}: {
  project: ProjectEntry;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
    >
      <MacOSCard className="flex flex-col h-full">
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 dark:bg-indigo-500/10 border border-blue-500/20 dark:border-indigo-500/20 flex items-center justify-center">
              <span className="text-blue-600 dark:text-indigo-400 font-mono text-base sm:text-lg">{"</>"}</span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              )}
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{project.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {project.tech.map((t) => (
              <span 
                key={t} 
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-indigo-950/30 border border-blue-200/60 dark:border-indigo-500/30 text-blue-700 dark:text-indigo-300 rounded-md text-xs sm:text-sm font-semibold hover:bg-blue-100 dark:hover:bg-indigo-900/40 hover:border-blue-300 dark:hover:border-indigo-400/50 transition-all"
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="py-16">
      <div className="px-6 md:px-16 lg:px-32">
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
            Projects
          </h2>
          <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block">→</span>
            Horizontal scroll to view all projects
          </p>
        </motion.div>
      </div>

      <div className="px-6 md:px-16 lg:px-32">
        <div className="relative">
          <div className="overflow-x-auto pt-2 pb-4 scroll-smooth hide-scrollbar">
            <div className="flex items-center gap-10 md:gap-10 min-w-max px-8 md:px-12">
              {Object.entries(portfolioData.projects).map(([id, project], i) => (
                <div key={id} className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] flex-shrink-0">
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
            </div>
          </div>
          {/* Gradient fade on the left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none" />
          {/* Gradient fade on the right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
