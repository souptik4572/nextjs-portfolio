"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Check, X, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/types/admin";

interface SaveButtonProps {
  status: SaveStatus;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

/**
 * Save button with idle / saving / success / error visual states.
 * Success resets after 2 s, error after 3 s.
 */
export default function SaveButton({
  status,
  onClick,
  disabled,
  type = "button",
}: SaveButtonProps) {
  const [display, setDisplay] = useState<SaveStatus>(status);

  useEffect(() => {
    setDisplay(status);
    if (status === "success") {
      const t = setTimeout(() => setDisplay("idle"), 2000);
      return () => clearTimeout(t);
    }
    if (status === "error") {
      const t = setTimeout(() => setDisplay("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const isLoading = display === "saving";
  const isSuccess = display === "success";
  const isError = display === "error";
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        isSuccess
          ? "bg-green-500/15 text-green-500 border border-green-500/30"
          : isError
            ? "bg-red-500/15 text-red-500 border border-red-500/30"
            : "bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white border border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={15} />
          </motion.span>
        )}
        {isSuccess && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={15} />
          </motion.span>
        )}
        {isError && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X size={15} />
          </motion.span>
        )}
        {!isLoading && !isSuccess && !isError && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Save size={15} />
          </motion.span>
        )}
      </AnimatePresence>
      {isLoading ? "Saving…" : isSuccess ? "Saved!" : isError ? "Error" : "Save Changes"}
    </button>
  );
}
