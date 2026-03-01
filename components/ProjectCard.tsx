"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import type { ProjectEntry } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";

export function ProjectCard({
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
