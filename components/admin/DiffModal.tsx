"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, Plus, Minus, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import {
  computeDiff,
  getArrayDelta,
  renderValue,
  type DiffEntry,
} from "@/lib/admin/diff";

interface DiffModalProps {
  isOpen: boolean;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional title shown in the header, e.g. "Experience — Acme Corp" */
  title?: string;
}

function ArrayDeltaRows({
  before,
  after,
}: {
  before: unknown;
  after: unknown;
}) {
  const delta = getArrayDelta(before, after);
  if (!delta) return null;

  const { added, removed } = delta;
  if (added.length === 0 && removed.length === 0) return null;

  return (
    <div className="mt-1.5 space-y-1 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
      {removed.map((item, i) => (
        <div key={`rm-${i}`} className="flex items-start gap-1.5 text-xs text-red-500">
          <Minus size={11} className="mt-0.5 shrink-0" />
          <span className="break-words">{item}</span>
        </div>
      ))}
      {added.map((item, i) => (
        <div key={`add-${i}`} className="flex items-start gap-1.5 text-xs text-green-500">
          <Plus size={11} className="mt-0.5 shrink-0" />
          <span className="break-words">{item}</span>
        </div>
      ))}
    </div>
  );
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const isArrayChange =
    Array.isArray(entry.before) || Array.isArray(entry.after);

  return (
    <div className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 font-heading">
        {entry.label}
      </p>
      {isArrayChange ? (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-heading">
            <span className="line-through opacity-60">
              {Array.isArray(entry.before) ? `${(entry.before as unknown[]).length} items` : renderValue(entry.before)}
            </span>
            <ArrowRight size={11} />
            <span>
              {Array.isArray(entry.after) ? `${(entry.after as unknown[]).length} items` : renderValue(entry.after)}
            </span>
          </div>
          <ArrayDeltaRows before={entry.before} after={entry.after} />
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
          <span className="text-sm text-red-500/80 line-through break-words font-heading">
            {renderValue(entry.before)}
          </span>
          <ArrowRight size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <span className="text-sm text-green-600 dark:text-green-400 break-words font-heading">
            {renderValue(entry.after)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function DiffModal({
  isOpen,
  before,
  after,
  onConfirm,
  onCancel,
  title,
}: DiffModalProps) {
  const diffs = isOpen ? computeDiff(before, after) : [];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
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
          {/* Backdrop */}
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

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-label="Review changes"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg max-h-[82vh] flex flex-col pointer-events-auto rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200/40 dark:border-slate-700/30 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/15 dark:bg-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-indigo-400">
                    <GitCompare size={16} />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Review changes
                    </h2>
                    {title && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-heading">
                        {title}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancel"
                  className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
                {diffs.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500 font-heading">
                    No changes detected.
                  </p>
                ) : (
                  <div>
                    <p className="py-2 text-xs text-slate-400 dark:text-slate-500 font-heading">
                      {diffs.length} field{diffs.length !== 1 ? "s" : ""} changed
                    </p>
                    {diffs.map((entry) => (
                      <DiffRow key={entry.path} entry={entry} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200/40 dark:border-slate-700/30 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={diffs.length === 0}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm &amp; Save
                </button>
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
