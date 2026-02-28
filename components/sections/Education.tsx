"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar } from "lucide-react";
import { portfolioData } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";
import type { SectionProps } from "@/app/page";

export default function Education({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="education" className="px-6 md:px-16 lg:px-32 py-16">
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
          Education
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <div className="max-w-2xl space-y-5">
        {Object.entries(portfolioData.education).map(([id, edu], i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <MacOSCard>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-indigo-500/10 border border-blue-500/20 dark:border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                    <GraduationCap size={20} className="text-blue-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{edu.degree}</h3>
                    <p className="text-blue-600 dark:text-indigo-400 font-medium mt-0.5 text-base">{edu.institution}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-base text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {edu.period}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">GPA: {edu.gpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            </MacOSCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
