"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
import DragHandle from "@/components/admin/DragHandle";
import CompanySearch from "@/components/admin/CompanySearch";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { useNotableOffers } from "@/hooks/admin/useNotableOffers";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { NotableOfferSchema, type NotableOfferForm } from "@/lib/admin/validation";
import { importLogo } from "@/lib/admin/importLogo";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { NotableOffer } from "@/types/portfolio";

interface NotableOfferFormProps {
  entryKey: string;
  defaultValues: NotableOffer;
  onSave: (key: string, data: NotableOffer) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function NotableOfferForm({ entryKey, defaultValues, onSave, requestDiff }: NotableOfferFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<NotableOfferForm>({
    resolver: zodResolver(NotableOfferSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: NotableOfferForm) => {
    requestDiff(
      (originalValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      values.company || entryKey,
      async () => {
        setSaveStatus("saving");
        try {
          await onSave(entryKey, values);
          reset(values);
          setSaveStatus("success");
        } catch (err) {
          logger.error("Notable offer save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  const handleCompanyPick = async (s: { name: string; domain: string; logo: string }) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    setValue("company", s.name, opts);
    setValue("companyUrl", `https://${s.domain}`, opts);
    // Set the remote URL immediately so the field is populated, then swap to
    // the local path once the server finishes downloading it.
    setValue("companyLogo", s.logo, opts);
    if (s.logo) {
      const localPath = await importLogo(s.logo, s.domain || s.name);
      setValue("companyLogo", localPath, opts);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <CompanySearch onSelect={handleCompanyPick} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company" htmlFor={`company-${entryKey}`} error={errors.company?.message} required>
          <input id={`company-${entryKey}`} {...register("company")} className={inputClass(!!errors.company)} placeholder="Company Name" />
        </FormField>
        <FormField label="Role" htmlFor={`role-${entryKey}`} error={errors.role?.message} required>
          <input id={`role-${entryKey}`} {...register("role")} className={inputClass(!!errors.role)} placeholder="Software Engineer" />
        </FormField>
        <FormField label="Period" htmlFor={`period-${entryKey}`} error={errors.period?.message} required>
          <input id={`period-${entryKey}`} {...register("period")} className={inputClass(!!errors.period)} placeholder="2024" />
        </FormField>
        <FormField label="Company URL" htmlFor={`url-${entryKey}`} error={errors.companyUrl?.message}>
          <input id={`url-${entryKey}`} type="url" {...register("companyUrl")} className={inputClass(!!errors.companyUrl)} placeholder="https://…" />
        </FormField>
      </div>
      <FormField label="Company Logo (path)" htmlFor={`logo-${entryKey}`} error={errors.companyLogo?.message}>
        <input id={`logo-${entryKey}`} {...register("companyLogo")} className={inputClass(!!errors.companyLogo)} placeholder="/images/companies/acme.png" />
      </FormField>
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register("visible")} className="sr-only peer" />
          <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:ring-2 peer-focus:ring-blue-500/40 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-indigo-600 transition-colors" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
        </label>
        <span className="text-sm text-slate-700 dark:text-slate-300">Show in portfolio</span>
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
 * Sort entry keys by the entry's stored `order` field; entries without an
 * order go to the end. Key is used as a stable tiebreaker so the sort is
 * deterministic across renders.
 */
function sortKeysByOrder(
  keys: string[],
  entries: Record<string, NotableOffer>,
): string[] {
  return [...keys].sort((a, b) => {
    const oa = entries[a]?.order ?? Number.POSITIVE_INFINITY;
    const ob = entries[b]?.order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });
}

export default function NotableOffersPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry, saveOrder } =
    useNotableOffers();
  const diff = useDiffConfirm();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  // Local ordering state. `order` is the live (possibly-dirty) sequence shown
  // in the UI; `originalOrder` is the last-saved sequence for dirty-detection.
  const [order, setOrder] = useState<string[]>([]);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [orderSaveStatus, setOrderSaveStatus] = useState<SaveStatus>("idle");

  // Reconcile local order with the latest entries (initial load, add, delete,
  // save). Preserves any pending user reorder by keeping the existing order
  // for keys that still exist and appending any new keys at the end.
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
      logger.error("Delete notable offer failed", err);
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
      before[`#${i + 1}`] = entries[k]?.company || k;
    });
    order.forEach((k, i) => {
      after[`#${i + 1}`] = entries[k]?.company || k;
    });

    diff.request(before, after, "Notable Offers Order", async () => {
      setOrderSaveStatus("saving");
      try {
        await saveOrder(order);
        setOrderSaveStatus("success");
      } catch (err) {
        logger.error("Notable offers reorder save failed", err);
        setOrderSaveStatus("error");
      }
    });
  };

  if (error) {
    return (
      <AdminShell title="Notable Offers">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load notable offers data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Notable Offers"
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
          <LoadingSkeleton rows={2} />
        ) : (
          <EntryList
            count={order.length}
            onAdd={handleAdd}
            addLabel="Add Offer"
            empty={<p className="text-sm">No notable offers yet.</p>}
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
                        title={entries[key].company || "New Offer"}
                        subtitle={entries[key].role || undefined}
                        onDelete={() => setDeleteTarget(key)}
                        defaultExpanded={key === newKey}
                      >
                        <NotableOfferForm
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
        label={deleteTarget ? (entries[deleteTarget]?.company ?? deleteTarget) : ""}
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
