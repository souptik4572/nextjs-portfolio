"use client";

import { GripVertical } from "lucide-react";
import type { DraggableSyntheticListeners, DraggableAttributes } from "@dnd-kit/core";

interface DragHandleProps {
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
}

/**
 * Drag icon for reorderable lists.
 * Pass dnd-kit's listeners and attributes to enable drag behaviour.
 */
export default function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <button
      type="button"
      className="cursor-grab active:cursor-grabbing touch-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      aria-label="Drag to reorder"
      {...listeners}
      {...attributes}
    >
      <GripVertical size={18} />
    </button>
  );
}
