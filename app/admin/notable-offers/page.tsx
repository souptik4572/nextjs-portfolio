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
import { useNotableOffers } from "@/hooks/admin/useNotableOffers";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { NotableOfferSchema, type NotableOfferForm } from "@/lib/admin/validation";
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
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
        <span className="text-sm text-slate-700 dark:text-slate-300 font-heading">Show in portfolio</span>
      </div>
      <div className="flex justify-end">
        <SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" disabled={!isDirty} />
      </div>
    </form>
  );
}

export default function NotableOffersPage() {
  const { entries, isLoading, error, save, addEntry, deleteEntry } = useNotableOffers();
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
      logger.error("Delete notable offer failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedKeys = Object.keys(entries).sort();

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
    <AdminShell title="Notable Offers">
      <div className="max-w-3xl">
        {isLoading ? (
          <LoadingSkeleton rows={2} />
        ) : (
          <EntryList count={sortedKeys.length} onAdd={handleAdd} addLabel="Add Offer" empty={<p className="text-sm font-heading">No notable offers yet.</p>}>
            {sortedKeys.map((key) => (
              <EntryCard
                key={key}
                title={entries[key].company || "New Offer"}
                subtitle={entries[key].role || undefined}
                onDelete={() => setDeleteTarget(key)}
                defaultExpanded={key === newKey}
              >
                <NotableOfferForm entryKey={key} defaultValues={entries[key]} onSave={save} requestDiff={diff.request} />
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
