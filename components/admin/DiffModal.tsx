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
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
        {entry.label}
      </p>
      {isArrayChange ? (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
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
          <span className="text-sm text-red-500/80 line-through break-words">
            {renderValue(entry.before)}
          </span>
          <ArrowRight size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <span className="text-sm text-green-600 dark:text-green-400 break-words">
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
              className="w-full max-w-lg max-h-[82dvh] flex flex-col pointer-events-auto rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#2c2c2e] shadow-2xl shadow-black/20 dark:shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* macOS window chrome */}
              <div className="flex items-center gap-3 px-5 pt-4 pb-3.5 border-b border-slate-200 dark:border-white/[0.05] shrink-0">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
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
                {/* Title */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[#007AFF]/[0.12] dark:bg-[#0A84FF]/[0.18] flex items-center justify-center text-[#007AFF] dark:text-[#4DB8FF] shrink-0">
                    <GitCompare size={13} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                      Review changes
                    </h2>
                    {title && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
                {diffs.length === 0 ? (
                  <p className="py-8 text-center text-[13px] text-slate-400 dark:text-slate-500">
                    No changes detected.
                  </p>
                ) : (
                  <div>
                    <p className="py-2 text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium">
                      {diffs.length} field{diffs.length !== 1 ? "s" : ""} changed
                    </p>
                    {diffs.map((entry) => (
                      <DiffRow key={entry.path} entry={entry} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-200 dark:border-white/[0.05] flex justify-end gap-2 shrink-0">
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
                  disabled={diffs.length === 0}
                  className="px-4 py-2.5 min-h-[44px] rounded-[10px] text-[13px] font-medium bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
