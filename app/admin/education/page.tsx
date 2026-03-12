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
import { useEducation } from "@/hooks/admin/useEducation";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { EducationEntrySchema, type EducationEntryForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { EducationEntry } from "@/types/portfolio";

interface EducationFormProps {
  entryKey: string;
  defaultValues: EducationEntry;
  onSave: (key: string, data: EducationEntry) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function EducationForm({ entryKey, defaultValues, onSave, requestDiff }: EducationFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<EducationEntryForm>({
    resolver: zodResolver(EducationEntrySchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: EducationEntryForm) => {
    requestDiff(
      (originalValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      values.institution || entryKey,
      async () => {
        setSaveStatus("saving");
        try {
          await onSave(entryKey, values);
          reset(values);
          setSaveStatus("success");
        } catch (err) {
          logger.error("Education save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <FormField label="Institution" htmlFor={`inst-${entryKey}`} error={errors.institution?.message} required>
        <input id={`inst-${entryKey}`} {...register("institution")} className={inputClass(!!errors.institution)} placeholder="University of Example" />
      </FormField>
      <FormField label="Degree" htmlFor={`degree-${entryKey}`} error={errors.degree?.message} required>
        <input id={`degree-${entryKey}`} {...register("degree")} className={inputClass(!!errors.degree)} placeholder="B.Tech Computer Science" />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Period" htmlFor={`period-${entryKey}`} error={errors.period?.message} required>
          <input id={`period-${entryKey}`} {...register("period")} className={inputClass(!!errors.period)} placeholder="2018 – 2022" />
        </FormField>
        <FormField label="GPA" htmlFor={`gpa-${entryKey}`} error={errors.gpa?.message}>
          <input id={`gpa-${entryKey}`} {...register("gpa")} className={inputClass(!!errors.gpa)} placeholder="8.5 / 10" />
        </FormField>
      </div>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

export default function EducationPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry } = useEducation();
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
      logger.error("Delete education failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedKeys = Object.keys(entries).sort();

  if (error) {
    return (
      <AdminShell title="Education">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load education data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Education">
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={2} />
        ) : (
          <EntryList count={sortedKeys.length} onAdd={handleAdd} addLabel="Add Education" empty={<p className="text-sm">No education entries yet.</p>}>
            {sortedKeys.map((key) => (
              <EntryCard
                key={key}
                title={entries[key].institution || "New Entry"}
                subtitle={entries[key].degree || undefined}
                onDelete={() => setDeleteTarget(key)}
                defaultExpanded={key === newKey}
              >
                <EducationForm entryKey={key} defaultValues={entries[key]} onSave={save} requestDiff={diff.request} />
              </EntryCard>
            ))}
          </EntryList>
        )}
      </div>

      <DeleteConfirm
        isOpen={deleteTarget !== null}
        label={deleteTarget ? (entries[deleteTarget]?.institution ?? deleteTarget) : ""}
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
