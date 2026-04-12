"use client";

import { useRef, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminShellTitle, useAdminShellSetters } from "@/contexts/AdminShellContext";

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

/**
 * macOS-style toolbar rendered once in the admin layout.
 *
 * Title is read from AdminShellTitleCtx (set by the current page's AdminShell).
 *
 * Actions are NOT stored in context — instead, this component renders an empty
 * <div> slot and registers it via registerActionsSlot(). AdminShell then uses
 * ReactDOM.createPortal to render the page's action buttons into that div.
 * This avoids any context state update for actions, eliminating re-render loops.
 */
export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const title = useAdminShellTitle();
  const { registerActionsSlot } = useAdminShellSetters();
  const slotRef = useRef<HTMLDivElement>(null);

  // Register the slot element after mount so AdminShell can portal into it.
  // Cleanup on unmount (TopBar should never unmount in practice, but be safe).
  useEffect(() => {
    registerActionsSlot(slotRef.current);
    return () => registerActionsSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* Right side: actions slot + theme toggle */}
      <div className="ml-auto flex items-center gap-2">
        {/* Empty div — AdminShell portals the current page's actions here */}
        <div ref={slotRef} className="flex items-center gap-2" />

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
