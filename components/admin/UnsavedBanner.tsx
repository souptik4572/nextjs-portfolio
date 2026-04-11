"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import SaveButton from "./SaveButton";
import type { SaveStatus } from "@/types/admin";

interface UnsavedBannerProps {
  isDirty: boolean;
  onSave: () => void;
  status: SaveStatus;
  onDiscard?: () => void;
}

/**
 * Sticky banner at the bottom of the screen when there are unsaved changes.
 * Slides up from bottom via Framer Motion.
 */
export default function UnsavedBanner({
  isDirty,
  onSave,
  status,
  onDiscard,
}: UnsavedBannerProps) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="fixed bottom-safe-banner left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-max sm:max-w-[calc(100vw-2rem)] z-40 flex items-center gap-3 pl-4 pr-2 py-2 rounded-2xl border border-black/[0.10] dark:border-white/[0.10] bg-white/92 dark:bg-[#2c2c2e]/92 backdrop-blur-2xl shadow-xl shadow-black/12 dark:shadow-black/40"
        >
          <AlertCircle size={14} className="text-[#FF9F0A] dark:text-[#FFD60A] shrink-0" />
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200 flex-1 sm:flex-none sm:whitespace-nowrap min-w-0">
            Unsaved changes
          </span>
          <SaveButton status={status} onClick={onSave} />
          {onDiscard && (
            <button
              type="button"
              onClick={onDiscard}
              aria-label="Discard changes"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
