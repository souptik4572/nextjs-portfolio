"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { ProjectEntry } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

function ProjectCard({
  project,
  index,
}: {
  project: ProjectEntry;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: "easeOut" }}
      className="h-full"
    >
      <MacOSCard className="flex flex-col h-full">
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {/* Header: icon + links */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 dark:bg-indigo-500/10 border border-blue-500/20 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-600 dark:text-indigo-400 font-mono text-base">
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
                  <Github size={17} />
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
                  <ExternalLink size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
            {project.description}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 bg-blue-50 dark:bg-indigo-950/30 border border-blue-200/60 dark:border-indigo-500/30 text-blue-700 dark:text-indigo-300 rounded-md text-xs font-semibold hover:bg-blue-100 dark:hover:bg-indigo-900/40 hover:border-blue-300 dark:hover:border-indigo-400/50 transition-all"
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

export default function ProjectsPage() {
  const portfolioData = usePortfolioData();
  const allProjects = Object.values(portfolioData.projects);

  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 md:px-16 lg:px-32 pt-28 pb-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to portfolio
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            <span className="text-blue-600 dark:text-indigo-400 font-mono text-2xl mr-3">
              ./
            </span>
            All Projects
          </h1>
          <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} in total
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {allProjects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
