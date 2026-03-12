"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import EntryList from "@/components/admin/EntryList";
import EntryCard from "@/components/admin/EntryCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { useAchievements } from "@/hooks/admin/useAchievements";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { AchievementEntrySchema, type AchievementEntryForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { AchievementEntry } from "@/types/portfolio";

interface AchievementFormProps {
  entryKey: string;
  defaultValues: AchievementEntry;
  onSave: (key: string, data: AchievementEntry) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function AchievementForm({ entryKey, defaultValues, onSave, requestDiff }: AchievementFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<AchievementEntryForm>({
    resolver: zodResolver(AchievementEntrySchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: AchievementEntryForm) => {
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
          logger.error("Achievement save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Title" htmlFor={`title-${entryKey}`} error={errors.title?.message} required>
          <input id={`title-${entryKey}`} {...register("title")} className={inputClass(!!errors.title)} placeholder="Award or achievement name" />
        </FormField>
        <FormField label="Date" htmlFor={`date-${entryKey}`} error={errors.date?.message} required>
          <input id={`date-${entryKey}`} {...register("date")} className={inputClass(!!errors.date)} placeholder="Jan 2024" />
        </FormField>
      </div>
      <FormField label="Description" htmlFor={`desc-${entryKey}`} error={errors.description?.message} required>
        <textarea id={`desc-${entryKey}`} {...register("description")} rows={3} className={`${inputClass(!!errors.description)} resize-none`} placeholder="Describe the achievement…" />
      </FormField>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

export default function AchievementsPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry } = useAchievements();
  const diff = useDiffConfirm();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleAdd = async () => {
    const key = await addEntry();
    setNewKey(key);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEntry(deleteTarget);
    } catch (err) {
      logger.error("Delete achievement failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedKeys = Object.keys(entries).sort((a, b) => {
    const na = parseInt(a.replace("ach-", ""), 10);
    const nb = parseInt(b.replace("ach-", ""), 10);
    return nb - na;
  });

  if (error) {
    return (
      <AdminShell title="Achievements">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load achievements data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Achievements">
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <EntryList count={sortedKeys.length} onAdd={handleAdd} addLabel="Add Achievement" empty={<p className="text-sm">No achievements yet.</p>}>
            {sortedKeys.map((key) => (
              <EntryCard
                key={key}
                title={entries[key].title || "New Achievement"}
                subtitle={entries[key].date || undefined}
                onDelete={() => setDeleteTarget(key)}
                defaultExpanded={key === newKey}
              >
                <AchievementForm entryKey={key} defaultValues={entries[key]} onSave={save} requestDiff={diff.request} />
              </EntryCard>
            ))}
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
