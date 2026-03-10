"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { ExperienceEntry } from "@/lib/data";
import { MacOSCard } from "@/components/MacOSElements";
import Image from "next/image";
import type { SectionProps } from "@/app/page";

function ExperienceCard({
  exp,
  index,
}: {
  exp: ExperienceEntry;
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
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <span className="absolute left-0 top-2 bottom-0 w-px bg-slate-300 dark:bg-slate-700" />
      {/* Timeline dot */}
      <span className="absolute left-[-5px] top-2 w-[11px] h-[11px] rounded-full bg-blue-600 dark:bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />

      <MacOSCard>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
              <div className="flex items-center gap-2 mt-2">
                {(exp as any).companyLogo && (exp as any).companyWebsite ? (
                  <a
                    href={(exp as any).companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 p-1.5 group-hover:border-blue-500/60 dark:group-hover:border-indigo-500/50 transition-all flex items-center justify-center">
                      <Image
                        src={(exp as any).companyLogo}
                        alt={`${exp.company} logo`}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <p className="text-blue-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 text-lg group-hover:text-blue-500 dark:group-hover:text-indigo-300 transition-colors">
                      <Briefcase size={18} />
                      {exp.company}
                    </p>
                  </a>
                ) : (
                  <p className="text-blue-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 text-lg">
                    <Briefcase size={18} />
                    {exp.company}
                  </p>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right text-base text-slate-600 dark:text-slate-400 space-y-1 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 sm:justify-end">
                <Calendar size={14} />
                <span>{exp.period}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end">
                <MapPin size={14} />
                <span>{exp.location}</span>
              </div>
            </div>
          </div>
          <ul className="space-y-2">
            {exp.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                <span className="text-blue-600 dark:text-indigo-400 mt-1 shrink-0">▹</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </MacOSCard>
    </motion.div>
  );
}

export default function Experience({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();

  return (
    <section id="experience" className="px-6 md:px-16 lg:px-32 py-16">
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
          Experience
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <div className="max-w-3xl">
        {Object.entries(portfolioData.experience).map(([id, exp], i) => (
          <ExperienceCard key={id} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
