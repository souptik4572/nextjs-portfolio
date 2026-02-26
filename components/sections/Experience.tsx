"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/data";

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof portfolioData.experience)[number];
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
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <span className="absolute left-0 top-2 bottom-0 w-px bg-slate-700" />
      {/* Timeline dot */}
      <span className="absolute left-[-5px] top-2 w-[11px] h-[11px] rounded-full bg-indigo-500 ring-4 ring-slate-900" />

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/40 transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">{exp.role}</h3>
            <p className="text-indigo-400 font-semibold mt-0.5 flex items-center gap-1.5">
              <Briefcase size={14} />
              {exp.company}
            </p>
          </div>
          <div className="text-right text-sm text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar size={13} />
              <span>{exp.period}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <MapPin size={13} />
              <span>{exp.location}</span>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {exp.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
              <span className="text-indigo-400 mt-1 shrink-0">▹</span>
              {h}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="experience" className="px-6 md:px-16 lg:px-32 py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
          <span className="text-indigo-400 font-mono text-xl mr-3">02.</span>
          Experience
        </h2>
        <div className="mt-2 h-px w-32 bg-indigo-500/40" />
      </motion.div>

      <div className="max-w-3xl">
        {portfolioData.experience.map((exp, i) => (
          <ExperienceCard key={exp.id} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
