"use client";

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Collapsible card wrapping each form group.
 * Matches the portfolio's card aesthetic — same border, radius, background.
 */
export default function SectionCard({
  title,
  description,
  children,
  action,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm macos-shadow overflow-hidden">
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200/40 dark:border-slate-700/30">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 font-heading">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
