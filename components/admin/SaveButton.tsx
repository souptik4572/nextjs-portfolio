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
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors",
        isSuccess
          ? "bg-[#34C759]/[0.12] dark:bg-[#30D158]/[0.15] text-[#34C759] dark:text-[#30D158] border border-[#34C759]/25"
          : isError
            ? "bg-[#FF3B30]/[0.10] dark:bg-[#FF453A]/[0.15] text-[#FF3B30] dark:text-[#FF453A] border border-[#FF3B30]/25"
            : "bg-[#007AFF] hover:bg-[#0071E3] active:bg-[#006FD6] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white border border-transparent disabled:opacity-45 disabled:cursor-not-allowed shadow-sm",
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
