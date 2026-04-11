"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";

interface EntryCardProps {
  title: string;
  subtitle?: string;
  onDelete: () => void;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Expandable card for one entry in an EntryList.
 * Header: title + subtitle + expand chevron + delete button.
 * Body: Framer Motion height collapse/expand.
 */
export default function EntryCard({
  title,
  subtitle,
  onDelete,
  children,
  defaultExpanded = false,
}: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-2xl admin-card-surface border border-black/[0.07] dark:border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIsExpanded((p) => !p)}
          className="flex-1 flex items-center gap-2.5 text-left min-w-0"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 text-slate-400 dark:text-slate-500"
          >
            <ChevronDown size={16} />
          </motion.span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate tracking-tight">
              {title}
            </span>
            {subtitle && (
              <span className="block text-[12px] text-slate-500 dark:text-slate-400 truncate">
                {subtitle}
              </span>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${title}`}
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#FF3B30] dark:hover:text-[#FF453A] hover:bg-[#FF3B30]/[0.08] dark:hover:bg-[#FF453A]/[0.12] transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-black/[0.06] dark:border-white/[0.05]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
