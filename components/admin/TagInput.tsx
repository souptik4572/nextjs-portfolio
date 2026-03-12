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
      className="flex flex-wrap gap-1.5 min-h-[38px] px-2.5 py-2 bg-white dark:bg-[#1c1c1e]/80 border border-black/[0.15] dark:border-white/[0.10] rounded-[8px] focus-within:ring-2 focus-within:ring-[#007AFF]/20 dark:focus-within:ring-[#0A84FF]/20 focus-within:border-[#007AFF]/60 dark:focus-within:border-[#0A84FF]/60 transition-all cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#007AFF]/[0.10] dark:bg-[#0A84FF]/[0.15] text-[#007AFF] dark:text-[#4DB8FF] text-[12px] font-medium"
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
