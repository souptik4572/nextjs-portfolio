"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
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
import AdminShell from "@/components/admin/AdminShell";
import EntryList from "@/components/admin/EntryList";
import EntryCard from "@/components/admin/EntryCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import TagInput from "@/components/admin/TagInput";
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
import DragHandle from "@/components/admin/DragHandle";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { useProjects } from "@/hooks/admin/useProjects";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { ProjectEntrySchema, type ProjectEntryForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { ProjectEntry } from "@/types/portfolio";

interface ProjectFormProps {
  entryKey: string;
  defaultValues: ProjectEntry;
  onSave: (key: string, data: ProjectEntry) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function ProjectForm({ entryKey, defaultValues, onSave, requestDiff }: ProjectFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<ProjectEntryForm>({
    resolver: zodResolver(ProjectEntrySchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: ProjectEntryForm) => {
    requestDiff(
      (originalValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      values.title || entryKey,
      async () => {
        setSaveStatus("saving");
        try {
          await onSave(entryKey, values);
          reset(values);
          setSaveStatus("success");
        } catch (err) {
          logger.error("Project save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <FormField label="Title" htmlFor={`title-${entryKey}`} error={errors.title?.message} required>
        <input id={`title-${entryKey}`} {...register("title")} className={inputClass(!!errors.title)} placeholder="My Awesome Project" />
      </FormField>
      <FormField label="Description" htmlFor={`desc-${entryKey}`} error={errors.description?.message} required>
        <textarea id={`desc-${entryKey}`} {...register("description")} rows={3} className={`${inputClass(!!errors.description)} resize-none`} placeholder="What does this project do?" />
      </FormField>
      <FormField label="Tech Stack" htmlFor={`tech-${entryKey}`} description="Press Enter or comma to add">
        <Controller name="tech" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="React, TypeScript…" />} />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="GitHub URL" htmlFor={`github-${entryKey}`} error={errors.github?.message}>
          <input id={`github-${entryKey}`} type="url" {...register("github")} className={inputClass(!!errors.github)} placeholder="https://github.com/…" />
        </FormField>
        <FormField label="Live URL" htmlFor={`live-${entryKey}`} error={errors.live?.message}>
          <input id={`live-${entryKey}`} type="url" {...register("live")} className={inputClass(!!errors.live)} placeholder="https://…" />
        </FormField>
      </div>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

interface SortableEntryProps {
  id: string;
  children: React.ReactNode;
}

function SortableEntry({ id, children }: SortableEntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.85 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <div className="self-stretch flex items-start pt-1">
        <DragHandle listeners={listeners} attributes={attributes} />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/**
 * Sort entry keys by the entry's stored `order`; missing-order entries fall to
 * the end. Key is a stable tiebreaker so the sort is deterministic.
 */
function sortKeysByOrder(
  keys: string[],
  entries: Record<string, ProjectEntry>,
): string[] {
  return [...keys].sort((a, b) => {
    const oa = entries[a]?.order ?? Number.POSITIVE_INFINITY;
    const ob = entries[b]?.order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });
}

export default function ProjectsPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry, saveOrder } =
    useProjects();
  const diff = useDiffConfirm();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const [order, setOrder] = useState<string[]>([]);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [orderSaveStatus, setOrderSaveStatus] = useState<SaveStatus>("idle");

  // Reconcile local order with entries: initial load populates from saved
  // `order`; on add/delete we preserve any pending reorder.
  useEffect(() => {
    if (isLoading) return;
    setOrder((prev) => {
      if (prev.length === 0) return sortKeysByOrder(Object.keys(entries), entries);
      const filtered = prev.filter((k) => k in entries);
      const newKeys = Object.keys(entries).filter((k) => !filtered.includes(k));
      if (filtered.length === prev.length && newKeys.length === 0) return prev;
      return [...filtered, ...sortKeysByOrder(newKeys, entries)];
    });
    setOriginalOrder(sortKeysByOrder(Object.keys(entries), entries));
  }, [entries, isLoading]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleAdd = async () => {
    const key = await addEntry();
    setNewKey(key);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry(deleteTarget);
    } catch (err) {
      logger.error("Delete project failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIdx = prev.indexOf(String(active.id));
      const newIdx = prev.indexOf(String(over.id));
      if (oldIdx < 0 || newIdx < 0) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
    setOrderSaveStatus("idle");
  };

  const isOrderDirty =
    order.length !== originalOrder.length ||
    order.some((k, i) => originalOrder[i] !== k);

  const handleSaveOrder = () => {
    const before: Record<string, string> = {};
    const after: Record<string, string> = {};
    originalOrder.forEach((k, i) => {
      before[`#${i + 1}`] = entries[k]?.title || k;
    });
    order.forEach((k, i) => {
      after[`#${i + 1}`] = entries[k]?.title || k;
    });

    diff.request(before, after, "Projects Order", async () => {
      setOrderSaveStatus("saving");
      try {
        await saveOrder(order);
        setOrderSaveStatus("success");
      } catch (err) {
        logger.error("Projects reorder save failed", err);
        setOrderSaveStatus("error");
      }
    });
  };

  if (error) {
    return (
      <AdminShell title="Projects">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load projects data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Projects"
      actions={
        isOrderDirty ? (
          <SaveButton
            status={orderSaveStatus}
            onClick={handleSaveOrder}
            label="Save Order"
          />
        ) : undefined
      }
    >
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <EntryList
            count={order.length}
            onAdd={handleAdd}
            addLabel="Add Project"
            empty={<p className="text-sm">No projects yet.</p>}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                {order.map((key) =>
                  entries[key] ? (
                    <SortableEntry key={key} id={key}>
                      <EntryCard
                        title={entries[key].title || "New Project"}
                        subtitle={entries[key].tech?.join(", ")}
                        onDelete={() => setDeleteTarget(key)}
                        defaultExpanded={key === newKey}
                      >
                        <ProjectForm
                          entryKey={key}
                          defaultValues={entries[key]}
                          onSave={save}
                          requestDiff={diff.request}
                        />
                      </EntryCard>
                    </SortableEntry>
                  ) : null,
                )}
              </SortableContext>
            </DndContext>
          </EntryList>
        )}
      </div>

      <DeleteConfirm
        isOpen={deleteTarget !== null}
        label={deleteTarget ? (entries[deleteTarget]?.title ?? deleteTarget) : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

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
