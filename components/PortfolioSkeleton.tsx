/**
 * Pulsing skeleton that mimics the main portfolio layout while
 * the async Firebase fetch is in-flight.
 *
 * Uses Tailwind `animate-pulse` with theme-aware colours so the
 * skeleton looks correct in both light and dark mode.
 */
export default function PortfolioSkeleton() {
  /* Shared pill / block helpers */
  const bar = (w: string, h = "h-4") =>
    `${h} ${w} rounded-md bg-slate-200 dark:bg-slate-800`;
  const block = (h: string, extra = "") =>
    `${h} w-full rounded-xl bg-slate-200 dark:bg-slate-800 ${extra}`;

  return (
    <div className="animate-pulse max-w-6xl mx-auto px-6 md:px-16 lg:px-32 py-16 space-y-24">
      {/* ── Intro / Hero ──────────────────────────────────────── */}
      <section className="min-h-[60vh] flex flex-col justify-center space-y-5">
        <div className={bar("w-32")} />
        <div className={bar("w-72", "h-12")} />
        <div className={bar("w-56", "h-8")} />
        <div className="space-y-2 max-w-xl">
          <div className={bar("w-full")} />
          <div className={bar("w-5/6")} />
          <div className={bar("w-3/4")} />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>

      {/* ── Experience ────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className={bar("w-48", "h-8")} />
        <div className="h-px w-32 bg-slate-200 dark:bg-slate-800" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 p-6 space-y-3"
          >
            <div className={bar("w-40", "h-6")} />
            <div className={bar("w-56")} />
            <div className={bar("w-32", "h-3")} />
            <div className="space-y-2 pt-2">
              <div className={bar("w-full")} />
              <div className={bar("w-11/12")} />
              <div className={bar("w-4/5")} />
            </div>
          </div>
        ))}
      </section>

      {/* ── Skills ────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className={bar("w-32", "h-8")} />
        <div className="h-px w-32 bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className={bar("w-28")} />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 + (i % 3) }).map((_, j) => (
                  <div
                    key={j}
                    className="h-8 rounded-lg bg-slate-200 dark:bg-slate-800"
                    style={{ width: `${60 + ((j * 17) % 40)}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects (horizontal cards) ───────────────────────── */}
      <section className="space-y-6">
        <div className={bar("w-40", "h-8")} />
        <div className="h-px w-32 bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[300px] rounded-xl border border-slate-200/60 dark:border-slate-700/40 p-5 space-y-3 flex-shrink-0"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className={bar("w-44", "h-5")} />
              <div className="space-y-2">
                <div className={bar("w-full")} />
                <div className={bar("w-5/6")} />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-14 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-12 rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Achievements ──────────────────────────────────────── */}
      <section className="space-y-6">
        <div className={bar("w-48", "h-8")} />
        <div className="h-px w-32 bg-slate-200 dark:bg-slate-800" />
        <div className={block("h-28")} />
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className={bar("w-44", "h-8")} />
        <div className="h-px w-32 bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 max-w-lg">
          <div className={bar("w-full")} />
          <div className={bar("w-4/5")} />
        </div>
        <div className="max-w-xl space-y-4">
          <div className={block("h-11")} />
          <div className={block("h-11")} />
          <div className={block("h-28")} />
          <div className="h-11 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>
    </div>
  );
}
