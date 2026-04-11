"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  label: string;
}

/**
 * Modal confirm before deleting an entry.
 * Accessible: focus-trap-friendly, role="dialog", closes on Escape.
 */
export default function DeleteConfirm({
  isOpen,
  onConfirm,
  onCancel,
  label,
}: DeleteConfirmProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); },
    [onCancel],
  );

  useEffect(() => {
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-label="Confirm deletion"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm pointer-events-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-white/98 dark:bg-[#2c2c2e]/98 backdrop-blur-2xl shadow-2xl shadow-black/12 dark:shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* macOS window chrome */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.05]">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Cancel"
                    className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 transition-all flex items-center justify-center group"
                  >
                    <X size={7} className="opacity-0 group-hover:opacity-100 text-[#8b0000] transition-opacity" strokeWidth={2.5} />
                  </button>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex items-center gap-1.5 text-[#FF3B30] dark:text-[#FF453A]">
                  <Trash2 size={14} />
                  <h2 className="text-[13px] font-semibold">Delete entry?</h2>
                </div>
                <div className="w-[52px]" />
              </div>
              <div className="px-5 py-4">
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {label}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 min-h-[44px] rounded-[10px] text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="px-4 py-2.5 min-h-[44px] rounded-[10px] text-[13px] font-medium bg-[#FF3B30] hover:bg-[#FF2D20] dark:bg-[#FF453A] dark:hover:bg-[#FF3830] text-white transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(content, document.body);
}
