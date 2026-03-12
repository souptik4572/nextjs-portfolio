"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import EntryList from "@/components/admin/EntryList";
import EntryCard from "@/components/admin/EntryCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import TagInput from "@/components/admin/TagInput";
import SaveButton from "@/components/admin/SaveButton";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import DiffModal from "@/components/admin/DiffModal";
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

export default function ProjectsPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry } = useProjects();
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
      logger.error("Delete project failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedKeys = Object.keys(entries).sort((a, b) => {
    const na = parseInt(a.replace("proj-", ""), 10);
    const nb = parseInt(b.replace("proj-", ""), 10);
    return nb - na;
  });

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
    <AdminShell title="Projects">
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <EntryList count={sortedKeys.length} onAdd={handleAdd} addLabel="Add Project" empty={<p className="text-sm">No projects yet.</p>}>
            {sortedKeys.map((key) => (
              <EntryCard
                key={key}
                title={entries[key].title || "New Project"}
                subtitle={entries[key].tech?.join(", ")}
                onDelete={() => setDeleteTarget(key)}
                defaultExpanded={key === newKey}
              >
                <ProjectForm entryKey={key} defaultValues={entries[key]} onSave={save} requestDiff={diff.request} />
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
