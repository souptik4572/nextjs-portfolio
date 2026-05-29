"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Sparkles } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import EntryList from "@/components/admin/EntryList";
import EntryCard from "@/components/admin/EntryCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { useImpact } from "@/hooks/admin/useImpact";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { ImpactStatSchema, type ImpactStatForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { ImpactStat } from "@/types/portfolio";

interface ImpactFormProps {
  entryKey: string;
  defaultValues: ImpactStat;
  onSave: (key: string, data: ImpactStat) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function ImpactForm({ entryKey, defaultValues, onSave, requestDiff }: ImpactFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<ImpactStatForm>({
    resolver: zodResolver(ImpactStatSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: ImpactStatForm) => {
    requestDiff(
      (originalValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      values.label || entryKey,
      async () => {
        setSaveStatus("saving");
        try {
          await onSave(entryKey, values);
          reset(values);
          setSaveStatus("success");
        } catch (err) {
          logger.error("Impact stat save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <FormField label="Value" htmlFor={`value-${entryKey}`} error={errors.value?.message} required>
          <input id={`value-${entryKey}`} {...register("value")} className={inputClass(!!errors.value)} placeholder="1000" />
        </FormField>
        <FormField label="Suffix" htmlFor={`suffix-${entryKey}`} error={errors.suffix?.message}>
          <input id={`suffix-${entryKey}`} {...register("suffix")} className={inputClass(!!errors.suffix)} placeholder="ms+" />
        </FormField>
        <FormField label="Order" htmlFor={`order-${entryKey}`} error={errors.order?.message}>
          <input
            id={`order-${entryKey}`}
            type="number"
            min={1}
            {...register("order", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
            className={inputClass(!!errors.order)}
            placeholder="1"
          />
        </FormField>
      </div>
      <FormField label="Label" htmlFor={`label-${entryKey}`} error={errors.label?.message} required>
        <input id={`label-${entryKey}`} {...register("label")} className={inputClass(!!errors.label)} placeholder="p99 latency shaved off core services" />
      </FormField>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
        The numeric part of <span className="font-mono">Value</span> animates as a count-up on the live site
        (e.g. <span className="font-mono">10K</span> counts to 10 then shows “K”). <span className="font-mono">Suffix</span> renders in the accent colour.
      </p>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

export default function ImpactPage() {
  const { entries, isLoading, error, save, addEntry, seedDefaults, deleteEntry } = useImpact();
  const diff = useDiffConfirm();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleAdd = async () => {
    const key = await addEntry();
    setNewKey(key);
  };

  const handleSeed = async () => {
    try {
      await seedDefaults();
    } catch (err) {
      logger.error("Seed default impact stats failed", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry(deleteTarget);
    } catch (err) {
      logger.error("Delete impact stat failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Sort by `order` (missing → end), then by key as a stable tiebreaker.
  const sortedKeys = Object.keys(entries).sort((a, b) => {
    const oa = entries[a].order ?? Number.POSITIVE_INFINITY;
    const ob = entries[b].order ?? Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });

  if (error) {
    return (
      <AdminShell title="Impact">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load impact data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Impact">
      <div className="max-w-3xl space-y-4">
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          Animated “selected impact” counters shown directly under the hero. Until you add any here, the
          site shows a set of starter metrics — replace them with your own verified numbers.
        </p>
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <EntryList
            count={sortedKeys.length}
            onAdd={handleAdd}
            addLabel="Add Stat"
            empty={
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm">No impact stats yet.</p>
                <button
                  type="button"
                  onClick={handleSeed}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-medium bg-[#007AFF]/[0.10] hover:bg-[#007AFF]/[0.18] dark:bg-[#0A84FF]/[0.15] dark:hover:bg-[#0A84FF]/[0.25] text-[#007AFF] dark:text-[#4DB8FF] transition-colors"
                >
                  <Sparkles size={14} />
                  Load 4 starter stats
                </button>
              </div>
            }
          >
            {sortedKeys.map((key) => {
              const stat = entries[key];
              return (
                <EntryCard
                  key={key}
                  title={stat.value ? `${stat.value}${stat.suffix}` : "New Stat"}
                  subtitle={stat.label || undefined}
                  onDelete={() => setDeleteTarget(key)}
                  defaultExpanded={key === newKey}
                >
                  <ImpactForm entryKey={key} defaultValues={stat} onSave={save} requestDiff={diff.request} />
                </EntryCard>
              );
            })}
          </EntryList>
        )}
      </div>

      <DeleteConfirm
        isOpen={deleteTarget !== null}
        label={deleteTarget ? (entries[deleteTarget]?.label ?? deleteTarget) : ""}
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
