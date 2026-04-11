"use client";

import { Plus, Trash2 } from "lucide-react";
import { inputClass } from "./FormField";

interface ArrayEditorProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  label?: string;
  addLabel?: string;
}

/**
 * Renders each string in an array as a row: text input + delete button.
 * "Add item" appends an empty string. Used for highlights, alternateRoles, etc.
 */
export default function ArrayEditor({
  value: valueProp,
  onChange,
  placeholder = "Add item…",
  addLabel = "Add item",
}: ArrayEditorProps) {
  const value = valueProp ?? [];

  const handleChange = (idx: number, val: string) => {
    const next = [...value];
    next[idx] = val;
    onChange(next);
  };

  const handleDelete = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    onChange([...value, ""]);
  };

  return (
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder={placeholder}
            className={inputClass()}
          />
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            aria-label={`Delete item ${idx + 1}`}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] text-[#007AFF] dark:text-[#4DB8FF] hover:bg-[#007AFF]/[0.07] dark:hover:bg-[#0A84FF]/[0.10] transition-colors border border-dashed border-[#007AFF]/30 dark:border-[#0A84FF]/30"
      >
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}
