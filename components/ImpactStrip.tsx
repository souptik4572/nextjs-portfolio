"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { DEFAULT_IMPACT_STATS, type ImpactStat } from "@/lib/data";

/** Split a value like "10K" into its animatable number (10) and trailing text ("K"). */
function parseValue(value: string): { target: number; trailing: string } | null {
  const m = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { target: parseFloat(m[1]), trailing: m[2] };
}

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);
const COUNT_MS = 1600;

function Counter({ value, inView }: { value: string; inView: boolean }) {
  // Memoize so the parsed object keeps a stable identity across the re-renders
  // the count-up triggers — otherwise the effect below restarts every frame.
  const parsed = useMemo(() => parseValue(value), [value]);
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(() => (parsed && !reduceMotion ? "0" : value));

  useEffect(() => {
    // Non-numeric values (or reduced motion) render statically.
    if (!parsed || reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    const isFloat = !Number.isInteger(parsed.target);
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / COUNT_MS);
      const current = parsed.target * EASE_OUT(p);
      const shown = isFloat ? current.toFixed(1) : Math.round(current).toString();
      setDisplay(`${shown}${parsed.trailing}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, parsed, reduceMotion]);

  return <span className="tabular-nums">{display}</span>;
}

export default function ImpactStrip() {
  const data = usePortfolioData();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Use admin-configured stats when present; otherwise the design's starter set.
  const configured = Object.values(data.impact ?? {}) as ImpactStat[];
  const stats = (configured.length > 0 ? configured : DEFAULT_IMPACT_STATS)
    .slice()
    .sort((a, b) => {
      const oa = a.order ?? Number.POSITIVE_INFINITY;
      const ob = b.order ?? Number.POSITIVE_INFINITY;
      return oa - ob;
    });

  if (stats.length === 0) return null;

  return (
    <section id="impact" aria-label="Selected impact" className="px-6 md:px-16 lg:px-32 pb-4 -mt-2">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="mb-4 flex items-center gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500">
            // selected impact
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 dark:from-indigo-400/30 to-transparent" />
        </div>

        {/* Bordered cell-grid — 1px gaps over the container background form the dividers. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/50 bg-slate-200/60 dark:bg-slate-700/40">
          {stats.map((stat, i) => (
            <div
              key={`${stat.label}-${i}`}
              className="group relative bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 md:p-7 transition-colors hover:bg-white/90 dark:hover:bg-slate-900/70"
            >
              <div className="flex items-baseline gap-0.5">
                <span className="font-heading font-bold tracking-tight text-slate-900 dark:text-slate-100 text-4xl sm:text-5xl leading-none">
                  <Counter value={stat.value} inView={inView} />
                </span>
                {stat.suffix && (
                  <span className="font-mono text-blue-600 dark:text-indigo-400 text-lg sm:text-xl leading-none">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-snug text-slate-500 dark:text-slate-400 text-pretty">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
