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
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm macos-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setIsExpanded((p) => !p)}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-slate-400"
          >
            <ChevronDown size={18} />
          </motion.span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </span>
            {subtitle && (
              <span className="block text-xs text-slate-500 dark:text-slate-400 truncate font-heading">
                {subtitle}
              </span>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${title}`}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={15} />
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
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-slate-200/40 dark:border-slate-700/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
