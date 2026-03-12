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
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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

/** Shared input class — matches the portfolio's ContactForm styling exactly. */
export const inputClass = (hasError?: boolean) =>
  [
    "w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm",
    "border rounded-lg text-slate-900 dark:text-slate-100",
    "placeholder-slate-400 dark:placeholder-slate-500",
    "focus:outline-none focus:ring-1 transition-all macos-shadow text-sm",
    hasError
      ? "border-red-500 focus:border-red-500/60 focus:ring-red-500/40"
      : "border-slate-300/60 dark:border-slate-700/50 focus:border-blue-500/60 dark:focus:border-indigo-500/60 focus:ring-blue-500/40 dark:focus:ring-indigo-500/40",
  ].join(" ");
