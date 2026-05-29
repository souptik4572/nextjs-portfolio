"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  /** 1-based section number; rendered as a zero-padded mono prefix (e.g. "02."). */
  index?: number;
  title: string;
  /** Muted descriptor shown in the right-hand column. */
  blurb?: string;
  className?: string;
}

/**
 * Editorial section header — mono number + large title on the left, a muted
 * blurb pushed to the right, all over a full-width divider. Mirrors the design
 * mockup's `.section-head`.
 */
export default function SectionHeading({
  index,
  title,
  blurb,
  className = "",
}: SectionHeadingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`mb-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-slate-200/70 dark:border-slate-700/50 pb-5 ${className}`}
    >
      {index !== undefined && (
        <span className="font-mono text-sm sm:text-base text-blue-600 dark:text-indigo-400 tracking-wider">
          {String(index).padStart(2, "0")}.
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {blurb && (
        <p className="ml-auto basis-full md:basis-auto max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400 text-pretty">
          {blurb}
        </p>
      )}
    </motion.div>
  );
}
