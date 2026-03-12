"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import SaveButton from "./SaveButton";
import type { SaveStatus } from "@/types/admin";

interface UnsavedBannerProps {
  isDirty: boolean;
  onSave: () => void;
  status: SaveStatus;
}

/**
 * Sticky banner at the bottom of the screen when there are unsaved changes.
 * Slides up from bottom via Framer Motion.
 */
export default function UnsavedBanner({
  isDirty,
  onSave,
  status,
}: UnsavedBannerProps) {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-xl border border-amber-400/30 bg-amber-50/90 dark:bg-amber-950/80 backdrop-blur-xl shadow-xl shadow-black/10"
        >
          <AlertCircle size={16} className="text-amber-500 shrink-0" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300 font-heading">
            You have unsaved changes
          </span>
          <SaveButton status={status} onClick={onSave} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
