"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { ProjectCard } from "@/components/ProjectCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

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
