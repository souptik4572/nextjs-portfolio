"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import { portfolioData } from "@/lib/data";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof portfolioData.projects)[number];
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
      className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 flex flex-col hover:border-blue-400 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-indigo-500/10 border border-blue-500/20 dark:border-indigo-500/20 flex items-center justify-center">
          <span className="text-blue-600 dark:text-indigo-400 font-mono text-lg">{"</>"}</span>
        </div>
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Github size={18} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{project.title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.tech.map((t) => (
          <span key={t} className="font-mono text-blue-600 dark:text-indigo-400 text-xs">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="px-6 md:px-16 lg:px-32 py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          <span className="text-blue-600 dark:text-indigo-400 font-mono text-xl mr-3">04.</span>
          Projects
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioData.projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
