"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminTopBarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

/**
 * macOS-style toolbar: page title centered on desktop, actions right.
 */
export default function AdminTopBar({
  title,
  onMenuClick,
  actions,
}: AdminTopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative h-11 shrink-0 flex items-center gap-2 px-3 lg:px-4 admin-toolbar-surface admin-vibrancy">
      {/* Hamburger (mobile/tablet only) */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Title — centered on desktop, left-aligned on mobile */}
      <span className="flex-1 lg:flex-none lg:absolute lg:left-1/2 lg:-translate-x-1/2 text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate pointer-events-none">
        {title}
      </span>

      {/* Actions slot — always far right */}
      <div className="ml-auto flex items-center gap-2">
        {actions}
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
