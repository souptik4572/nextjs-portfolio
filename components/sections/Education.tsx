"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar } from "lucide-react";
import { portfolioData } from "@/lib/data";

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="education" className="px-6 md:px-16 lg:px-32 py-24 bg-slate-900/40">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
          <span className="text-indigo-400 font-mono text-xl mr-3">05.</span>
          Education
        </h2>
        <div className="mt-2 h-px w-32 bg-indigo-500/40" />
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {portfolioData.education.map((edu, i) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                <GraduationCap size={20} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-100">{edu.degree}</h3>
                <p className="text-indigo-400 font-medium mt-0.5">{edu.institution}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {edu.period}
                  </span>
                  <span className="text-slate-300 font-medium">GPA: {edu.gpa}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
