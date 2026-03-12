"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SectionCard from "@/components/admin/SectionCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import TagInput from "@/components/admin/TagInput";
import SaveButton from "@/components/admin/SaveButton";
import { FieldSkeleton } from "@/components/admin/LoadingSkeleton";
import { useSkills } from "@/hooks/admin/useSkills";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { SkillCategory, SkillsConfig } from "@/types/portfolio";
import DiffModal from "@/components/admin/DiffModal";

type SkillKey = keyof SkillsConfig;

const SKILL_KEYS: SkillKey[] = [
  "languages",
  "libraries_frameworks",
  "databases",
  "infrastructure",
  "others",
];

const SKILL_LABELS: Record<SkillKey, string> = {
  languages: "Languages",
  libraries_frameworks: "Libraries & Frameworks",
  databases: "Databases",
  infrastructure: "Infrastructure",
  others: "Others",
};

export default function SkillsPage() {
  const { data, isLoading, error, save } = useSkills();
  const diff = useDiffConfirm();
  const [local, setLocal] = useState<SkillsConfig | null>(null);
  const [saveStatuses, setSaveStatuses] = useState<Record<SkillKey, SaveStatus>>(
    Object.fromEntries(SKILL_KEYS.map((k) => [k, "idle"])) as Record<SkillKey, SaveStatus>,
  );

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const updateCategory = (key: SkillKey, patch: Partial<SkillCategory>) => {
    setLocal((prev) =>
      prev
        ? { ...prev, [key]: { ...prev[key], ...patch } }
        : null,
    );
  };

  const saveCategory = (key: SkillKey) => {
    if (!local || !data) return;
    diff.request(
      data[key] as unknown as Record<string, unknown>,
      local[key] as unknown as Record<string, unknown>,
      SKILL_LABELS[key],
      async () => {
        setSaveStatuses((p) => ({ ...p, [key]: "saving" }));
        try {
          await save(local);
          setSaveStatuses((p) => ({ ...p, [key]: "success" }));
        } catch (err) {
          logger.error(`Skills save failed for ${key}`, err);
          setSaveStatuses((p) => ({ ...p, [key]: "error" }));
        }
      },
    );
  };

  if (error) {
    return (
      <AdminShell title="Skills">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load skills data.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Skills">
      <div className="max-w-3xl space-y-5">
        {SKILL_KEYS.map((key) => (
          <SectionCard
            key={key}
            title={SKILL_LABELS[key]}
            action={
              <SaveButton
                status={saveStatuses[key]}
                onClick={() => saveCategory(key)}
              />
            }
          >
            {isLoading || !local ? (
              <FieldSkeleton />
            ) : (
              <div className="space-y-4">
                <FormField label="Category Label" htmlFor={`cat-${key}`}>
                  <input
                    id={`cat-${key}`}
                    value={local[key]?.category ?? ""}
                    onChange={(e) => updateCategory(key, { category: e.target.value })}
                    className={inputClass()}
                    placeholder="e.g. Languages"
                  />
                </FormField>
                <FormField label="Items" htmlFor={`items-${key}`} description="Press Enter or comma to add a skill">
                  <TagInput
                    value={local[key]?.items ?? []}
                    onChange={(items) => updateCategory(key, { items })}
                    placeholder="Add skill…"
                  />
                </FormField>
              </div>
            )}
          </SectionCard>
        ))}
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
