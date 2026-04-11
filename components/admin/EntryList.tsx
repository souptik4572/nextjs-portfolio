"use client";

import { Plus } from "lucide-react";

interface EntryListProps {
  onAdd: () => void;
  addLabel?: string;
  children: React.ReactNode;
  empty?: React.ReactNode;
  count: number;
}

/**
 * Generic container for a keyed list of entries (exp-N, proj-N).
 * Shows an "Add" button at the top and handles empty state.
 */
export default function EntryList({
  onAdd,
  addLabel = "Add entry",
  children,
  empty,
  count,
}: EntryListProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-medium bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white transition-colors shadow-sm"
        >
          <Plus size={15} />
          {addLabel}
        </button>
      </div>
      {count === 0 && empty ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          {empty}
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}
