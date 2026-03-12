"use client";

import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}

/**
 * Label + input slot + error message unit.
 * Wrap any input/textarea/select inside this component.
 */
export default function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  description,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 tracking-tight"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-400" aria-hidden>
            *
          </span>
        )}
      </label>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-400" role="alert">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared input class — macOS NSTextField aesthetic. */
export const inputClass = (hasError?: boolean) =>
  [
    "w-full px-3 py-[7px] bg-white dark:bg-[#1c1c1e]/80",
    "border rounded-[8px] text-[13px] text-slate-900 dark:text-slate-100",
    "placeholder-slate-400/70 dark:placeholder-slate-500",
    "focus:outline-none focus:ring-2 transition-all",
    hasError
      ? "border-[#FF3B30]/60 dark:border-[#FF453A]/50 focus:ring-[#FF3B30]/20 dark:focus:ring-[#FF453A]/20 focus:border-[#FF3B30]/80"
      : "border-black/[0.15] dark:border-white/[0.10] focus:ring-[#007AFF]/20 dark:focus:ring-[#0A84FF]/20 focus:border-[#007AFF]/60 dark:focus:border-[#0A84FF]/60",
  ].join(" ");
