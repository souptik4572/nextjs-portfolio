"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

/**
 * Chip-style tag add/remove input.
 * Press Enter or comma to add a tag. Click × to remove.
 * Used for: keywords, tech stacks, skill category items.
 */
export default function TagInput({
  value: valueProp,
  onChange,
  placeholder = "Add tag…",
}: TagInputProps) {
  const value = valueProp ?? [];
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-[42px] px-3 py-2 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-300/60 dark:border-slate-700/50 rounded-lg focus-within:border-blue-500/60 dark:focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-blue-500/40 dark:focus-within:ring-indigo-500/40 transition-all macos-shadow cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(idx);
            }}
            aria-label={`Remove tag ${tag}`}
            className="hover:text-blue-900 dark:hover:text-indigo-100 transition-colors"
          >
            <X size={10} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
      />
    </div>
  );
}
