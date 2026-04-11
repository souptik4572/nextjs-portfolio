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
    <div className="rounded-2xl admin-card-surface border border-black/[0.07] dark:border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.05]">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
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
