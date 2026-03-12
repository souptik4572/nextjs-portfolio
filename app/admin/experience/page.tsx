"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import EntryList from "@/components/admin/EntryList";
import EntryCard from "@/components/admin/EntryCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import ArrayEditor from "@/components/admin/ArrayEditor";
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { useExperience } from "@/hooks/admin/useExperience";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { ExperienceEntrySchema, type ExperienceEntryForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { ExperienceEntry } from "@/types/portfolio";

interface ExperienceFormProps {
  entryKey: string;
  defaultValues: ExperienceEntry;
  onSave: (key: string, data: ExperienceEntry) => Promise<void>;
  requestDiff: (
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    title: string,
    doSave: () => Promise<void>,
  ) => void;
}

function ExperienceForm({ entryKey, defaultValues, onSave, requestDiff }: ExperienceFormProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<ExperienceEntryForm>({
    resolver: zodResolver(ExperienceEntrySchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: ExperienceEntryForm) => {
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
          logger.error("Experience save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company" htmlFor={`company-${entryKey}`} error={errors.company?.message} required>
          <input id={`company-${entryKey}`} {...register("company")} className={inputClass(!!errors.company)} placeholder="Acme Corp" />
        </FormField>
        <FormField label="Role" htmlFor={`role-${entryKey}`} error={errors.role?.message} required>
          <input id={`role-${entryKey}`} {...register("role")} className={inputClass(!!errors.role)} placeholder="Software Engineer" />
        </FormField>
        <FormField label="Period" htmlFor={`period-${entryKey}`} error={errors.period?.message} required>
          <input id={`period-${entryKey}`} {...register("period")} className={inputClass(!!errors.period)} placeholder="Jan 2022 – Present" />
        </FormField>
        <FormField label="Location" htmlFor={`location-${entryKey}`} error={errors.location?.message}>
          <input id={`location-${entryKey}`} {...register("location")} className={inputClass(!!errors.location)} placeholder="Remote" />
        </FormField>
        <FormField label="Company Website" htmlFor={`website-${entryKey}`} error={errors.companyWebsite?.message}>
          <input id={`website-${entryKey}`} type="url" {...register("companyWebsite")} className={inputClass(!!errors.companyWebsite)} placeholder="https://…" />
        </FormField>
        <FormField label="Company Logo (path)" htmlFor={`logo-${entryKey}`} error={errors.companyLogo?.message}>
          <input id={`logo-${entryKey}`} {...register("companyLogo")} className={inputClass(!!errors.companyLogo)} placeholder="/images/companies/acme.png" />
        </FormField>
      </div>
      <FormField label="Highlights" htmlFor={`highlights-${entryKey}`}>
        <Controller
          name="highlights"
          control={control}
          render={({ field }) => (
            <ArrayEditor value={field.value} onChange={field.onChange} placeholder="Led a team of 5 engineers…" addLabel="Add highlight" />
          )}
        />
      </FormField>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

export default function ExperiencePage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry } = useExperience();
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
      logger.error("Delete experience failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedKeys = Object.keys(entries).sort((a, b) => {
    const na = parseInt(a.replace("exp-", ""), 10);
    const nb = parseInt(b.replace("exp-", ""), 10);
    return nb - na;
  });

  if (error) {
    return (
      <AdminShell title="Experience">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load experience data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Experience">
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <EntryList count={sortedKeys.length} onAdd={handleAdd} addLabel="Add Experience" empty={<p className="text-sm font-heading">No experience entries yet.</p>}>
            {sortedKeys.map((key) => (
              <EntryCard
                key={key}
                title={entries[key].company || "New Entry"}
                subtitle={entries[key].role || undefined}
                onDelete={() => setDeleteTarget(key)}
                defaultExpanded={key === newKey}
              >
                <ExperienceForm entryKey={key} defaultValues={entries[key]} onSave={save} requestDiff={diff.request} />
              </EntryCard>
            ))}
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
