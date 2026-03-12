"use client";

/**
 * Shimmer placeholder while fetching data.
 */
export default function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FieldSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
