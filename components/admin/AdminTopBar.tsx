"use client";

import { Menu } from "lucide-react";

interface AdminTopBarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

/**
 * Top bar: page title + optional save/action area + hamburger on mobile.
 */
export default function AdminTopBar({
  title,
  onMenuClick,
  actions,
}: AdminTopBarProps) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 lg:px-6 border-b border-slate-200/40 dark:border-slate-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      {/* Hamburger (mobile / tablet only) */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="flex-1 text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
        {title}
      </h1>

      {/* Actions slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
