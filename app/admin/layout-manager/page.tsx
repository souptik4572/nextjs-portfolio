"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SectionCard from "@/components/admin/SectionCard";
import DragHandle from "@/components/admin/DragHandle";
import SaveButton from "@/components/admin/SaveButton";
import { FieldSkeleton } from "@/components/admin/LoadingSkeleton";
import { useLayoutManager } from "@/hooks/admin/useLayoutManager";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { SectionOrder } from "@/types/portfolio";
import DiffModal from "@/components/admin/DiffModal";

const SECTION_LABELS: Record<string, string> = {
  intro: "Intro",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  achievements: "Achievements",
  notable_offers: "Notable Offers",
  education: "Education",
  contact: "Contact",
};

interface SortableRowProps {
  id: string;
  label: string;
  enabled: boolean;
  onToggle: (id: string) => void;
}

function SortableRow({ id, label, enabled, onToggle }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 min-h-[52px] rounded-lg border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40"
    >
      <DragHandle listeners={listeners} attributes={attributes} />
      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {SECTION_LABELS[id] ?? id}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onToggle(id)}
          className="sr-only peer"
          aria-label={`${label} section visible`}
        />
        <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:ring-2 peer-focus:ring-blue-500/40 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-indigo-600 transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
      </label>
    </div>
  );
}

export default function LayoutManagerPage() {
  const { data, isLoading, error, save } = useLayoutManager();
  const diff = useDiffConfirm();
  const [order, setOrder] = useState<string[]>([]);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const sensors = useSensors(
    useSensor(PointerSensor),
    // TouchSensor enables drag-to-reorder on iOS Safari / iPadOS
    useSensor(TouchSensor, {
      activationConstraint: {
        // Require a 250ms press before activating drag, so taps still register
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!data?.section_order) return;
    const entries = Object.entries(data.section_order) as [string, SectionOrder][];
    const sorted = entries.sort(([, a], [, b]) => a.order - b.order);
    setOrder(sorted.map(([k]) => k));
    setEnabledMap(
      Object.fromEntries(entries.map(([k, v]) => [k, v.enabled])),
    );
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIdx = prev.indexOf(String(active.id));
        const newIdx = prev.indexOf(String(over.id));
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const toggleEnabled = (id: string) => {
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    const section_order: Record<string, SectionOrder> = {};
    order.forEach((key, idx) => {
      section_order[key] = { enabled: enabledMap[key] ?? true, order: idx + 1 };
    });

    // Build before / after as flat label → "order:N enabled:true" strings for readability
    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};
    if (data?.section_order) {
      for (const [k, v] of Object.entries(data.section_order)) {
        before[SECTION_LABELS[k] ?? k] = `order: ${v.order} • visible: ${v.enabled}`;
      }
    }
    for (const [k, v] of Object.entries(section_order)) {
      after[SECTION_LABELS[k] ?? k] = `order: ${v.order} • visible: ${v.enabled}`;
    }

    diff.request(before, after, "Section Order & Visibility", async () => {
      setSaveStatus("saving");
      try {
        await save({ section_order });
        setSaveStatus("success");
      } catch (err) {
        logger.error("Layout save failed", err);
        setSaveStatus("error");
      }
    });
  };

  if (error) {
    return (
      <AdminShell title="Layout Manager">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load layout data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Layout Manager"
      actions={<SaveButton status={saveStatus} onClick={handleSave} />}
    >
      <div className="max-w-xl">
        <SectionCard
          title="Section Order & Visibility"
          description="Drag to reorder. Toggle to show or hide each section."
        >
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {order.map((key) => (
                    <SortableRow
                      key={key}
                      id={key}
                      label={SECTION_LABELS[key] ?? key}
                      enabled={enabledMap[key] ?? true}
                      onToggle={toggleEnabled}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </SectionCard>
      </div>

      <DiffModal
        isOpen={diff.isOpen}
        before={diff.before}
        after={diff.after}
        title={diff.title}
        onConfirm={diff.confirm}
        onCancel={diff.cancel}
      />
    </AdminShell>
  );
}
